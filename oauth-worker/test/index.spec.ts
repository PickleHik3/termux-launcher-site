import { afterEach, describe, expect, it, vi } from "vitest";
import worker from "../src/index";

const env = {
  GITHUB_OAUTH_ID: "client-id",
  GITHUB_OAUTH_SECRET: "client-secret",
  ALLOWED_GITHUB_LOGIN: "PickleHik3",
  ALLOWED_ORIGIN: "https://picklehik3.github.io",
  ALLOWED_SITE_DOMAIN: "picklehik3.github.io"
};

afterEach(() => vi.unstubAllGlobals());

describe("OAuth worker", () => {
  it("serves a no-store health response", async () => {
    const response = await worker.fetch(new Request("https://auth.example/health"), env);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("rejects invalid providers and site IDs", async () => {
    const provider = await worker.fetch(new Request("https://auth.example/auth?provider=gitlab&site_id=picklehik3.github.io"), env);
    const site = await worker.fetch(new Request("https://auth.example/auth?provider=github&site_id=evil.example"), env);
    expect(provider.status).toBe(400);
    expect(site.status).toBe(403);
  });

  it("starts GitHub OAuth with a secure state cookie", async () => {
    const response = await worker.fetch(new Request("https://auth.example/auth?provider=github&site_id=picklehik3.github.io"), env);
    const location = new URL(response.headers.get("Location")!);
    const state = location.searchParams.get("state");
    expect(response.status).toBe(302);
    expect(location.origin + location.pathname).toBe("https://github.com/login/oauth/authorize");
    expect(location.searchParams.get("scope")).toBe("public_repo");
    expect(state).toMatch(/^[a-f0-9]{64}$/);
    expect(response.headers.get("Set-Cookie")).toContain(`decap_oauth_state=${state}`);
    expect(response.headers.get("Set-Cookie")).toContain("HttpOnly; Secure; SameSite=Lax");
  });

  it("rejects callbacks whose state does not match", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const request = new Request("https://auth.example/callback?provider=github&code=abc&state=wrong", {
      headers: { Cookie: "decap_oauth_state=expected" }
    });
    const response = await worker.fetch(request, env);
    expect(response.status).toBe(400);
    expect(await response.text()).toContain("OAuth state validation failed");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects every GitHub user except the configured owner without exposing the token", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "secret-token" }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ login: "SomebodyElse" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const request = new Request("https://auth.example/callback?provider=github&code=abc&state=expected", {
      headers: { Cookie: "decap_oauth_state=expected" }
    });
    const response = await worker.fetch(request, env);
    const body = await response.text();
    expect(response.status).toBe(403);
    expect(body).toContain("not authorized");
    expect(body).not.toContain("secret-token");
  });

  it("returns the token only to the configured site origin for the owner", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "secret-token" }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ login: "PickleHik3" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const request = new Request("https://auth.example/callback?provider=github&code=abc&state=expected", {
      headers: { Cookie: "decap_oauth_state=expected" }
    });
    const response = await worker.fetch(request, env);
    const body = await response.text();
    expect(response.status).toBe(200);
    expect(body).toContain('authorization:github:success:{\\"token\\":\\"secret-token\\"}');
    expect(body).toContain('"https://picklehik3.github.io"');
    expect(body).not.toContain(', "*")');
    expect(response.headers.get("Content-Security-Policy")).toContain("script-src 'nonce-");
    expect(response.headers.get("Set-Cookie")).toContain("Max-Age=0");
  });

  it("reports token exchange failures without leaking credentials", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "bad_verification_code" }), { status: 401 })
    ));
    const request = new Request("https://auth.example/callback?provider=github&code=bad&state=expected", {
      headers: { Cookie: "decap_oauth_state=expected" }
    });
    const response = await worker.fetch(request, env);
    const body = await response.text();
    expect(response.status).toBe(502);
    expect(body).toContain("bad_verification_code");
    expect(body).not.toContain(env.GITHUB_OAUTH_SECRET);
  });
});
