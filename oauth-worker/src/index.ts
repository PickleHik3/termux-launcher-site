interface Env {
  GITHUB_OAUTH_ID: string;
  GITHUB_OAUTH_SECRET: string;
  ALLOWED_GITHUB_LOGIN: string;
  ALLOWED_ORIGIN: string;
  ALLOWED_SITE_DOMAIN: string;
}

interface TokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface UserResponse {
  login?: string;
}

const STATE_COOKIE = "decap_oauth_state";
const STATE_MAX_AGE_SECONDS = 600;

function secureHeaders(contentType: string): HeadersInit {
  return {
    "Cache-Control": "no-store",
    "Content-Type": contentType,
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY"
  };
}

function randomHex(bytes: number): string {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return Array.from(buffer, (value) => value.toString(16).padStart(2, "0")).join("");
}

function callbackUrl(url: URL): string {
  return `${url.origin}/callback?provider=github`;
}

function readCookie(request: Request, name: string): string | null {
  const cookies = request.headers.get("Cookie") || "";
  for (const entry of cookies.split(";")) {
    const separator = entry.indexOf("=");
    if (separator < 0) continue;
    if (entry.slice(0, separator).trim() === name) return entry.slice(separator + 1).trim();
  }
  return null;
}

function stateCookie(value: string, maxAge: number): string {
  return `${STATE_COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

function plainResponse(message: string, status: number): Response {
  return new Response(message, { status, headers: secureHeaders("text/plain; charset=utf-8") });
}

function callbackResponse(
  env: Env,
  status: "success" | "error",
  payload: { token?: string; message?: string },
  httpStatus = 200
): Response {
  const nonce = randomHex(16);
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  const messageLiteral = JSON.stringify(message).replace(/</g, "\\u003c");
  const originLiteral = JSON.stringify(env.ALLOWED_ORIGIN);
  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Authorizing Decap CMS</title></head>
<body><p>Authorizing Decap CMS…</p>
<script nonce="${nonce}">
(() => {
  const targetOrigin = ${originLiteral};
  const finish = (event) => {
    if (event.origin !== targetOrigin || event.source !== window.opener) return;
    window.opener.postMessage(${messageLiteral}, targetOrigin);
    window.removeEventListener("message", finish);
  };
  window.addEventListener("message", finish);
  if (window.opener) window.opener.postMessage("authorizing:github", targetOrigin);
})();
</script></body></html>`;
  const headers = new Headers(secureHeaders("text/html; charset=utf-8"));
  headers.set("Content-Security-Policy", `default-src 'none'; script-src 'nonce-${nonce}'; base-uri 'none'; frame-ancestors 'none'`);
  headers.set("Set-Cookie", stateCookie("", 0));
  return new Response(html, { status: httpStatus, headers });
}

async function handleAuth(request: Request, env: Env, url: URL): Promise<Response> {
  if (url.searchParams.get("provider") !== "github") return plainResponse("Invalid provider", 400);
  if (url.searchParams.get("site_id") !== env.ALLOWED_SITE_DOMAIN) return plainResponse("Invalid site", 403);

  const state = randomHex(32);
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", env.GITHUB_OAUTH_ID);
  authorize.searchParams.set("redirect_uri", callbackUrl(url));
  authorize.searchParams.set("scope", "public_repo");
  authorize.searchParams.set("state", state);

  const headers = new Headers(secureHeaders("text/plain; charset=utf-8"));
  headers.set("Location", authorize.toString());
  headers.set("Set-Cookie", stateCookie(state, STATE_MAX_AGE_SECONDS));
  return new Response(null, { status: 302, headers });
}

async function exchangeCode(url: URL, env: Env, code: string): Promise<string> {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env.GITHUB_OAUTH_ID,
      client_secret: env.GITHUB_OAUTH_SECRET,
      code,
      redirect_uri: callbackUrl(url)
    })
  });
  const result = await response.json<TokenResponse>();
  if (!response.ok || !result.access_token) {
    throw new Error(result.error_description || result.error || "GitHub token exchange failed");
  }
  return result.access_token;
}

async function githubLogin(token: string): Promise<string> {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "termux-launcher-decap-oauth",
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });
  const result = await response.json<UserResponse>();
  if (!response.ok || !result.login) throw new Error("Unable to verify the GitHub account");
  return result.login;
}

async function handleCallback(request: Request, env: Env, url: URL): Promise<Response> {
  if (url.searchParams.get("provider") !== "github") return plainResponse("Invalid provider", 400);

  const expectedState = readCookie(request, STATE_COOKIE);
  const receivedState = url.searchParams.get("state");
  if (!expectedState || !receivedState || expectedState !== receivedState) {
    return callbackResponse(env, "error", { message: "OAuth state validation failed" }, 400);
  }

  const code = url.searchParams.get("code");
  if (!code) return callbackResponse(env, "error", { message: "GitHub did not return an authorization code" }, 400);

  try {
    const token = await exchangeCode(url, env, code);
    const login = await githubLogin(token);
    if (login.toLowerCase() !== env.ALLOWED_GITHUB_LOGIN.toLowerCase()) {
      return callbackResponse(env, "error", { message: "This GitHub account is not authorized" }, 403);
    }
    return callbackResponse(env, "success", { token });
  } catch (error) {
    const message = error instanceof Error ? error.message : "GitHub authentication failed";
    return callbackResponse(env, "error", { message }, 502);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "GET") return plainResponse("Method not allowed", 405);
    const url = new URL(request.url);
    if (url.pathname === "/auth") return handleAuth(request, env, url);
    if (url.pathname === "/callback") return handleCallback(request, env, url);
    if (url.pathname === "/" || url.pathname === "/health") {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: secureHeaders("application/json; charset=utf-8")
      });
    }
    return plainResponse("Not found", 404);
  }
};
