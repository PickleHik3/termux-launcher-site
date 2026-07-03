# Decap GitHub OAuth Worker

This Cloudflare Worker provides the `/auth` and `/callback` endpoints required by Decap's GitHub backend. It validates OAuth state, restricts browser messages to the production site, and accepts only the configured GitHub login.

## One-time deployment

1. Install dependencies and authenticate Wrangler:

   ```sh
   npm ci
   npx wrangler login
   ```

2. Deploy once to obtain the stable `workers.dev` URL:

   ```sh
   npm run deploy
   ```

3. In GitHub **Settings → Developer settings → OAuth Apps**, create an OAuth App using:

   - Homepage URL: the Worker URL.
   - Authorization callback URL: the Worker URL followed by `/callback`.

4. Store the OAuth credentials as encrypted Worker secrets. Enter each value only at Wrangler's prompt:

   ```sh
   npx wrangler secret put GITHUB_OAUTH_ID
   npx wrangler secret put GITHUB_OAUTH_SECRET
   ```

5. Replace the `base_url` placeholder in `../admin/config.yml` with the exact Worker URL, then rebuild the site.

Do not add OAuth credentials, Cloudflare tokens, or generated Wrangler state to this repository.

## Verification

```sh
npm run check
npm test
curl -fsS https://WORKER_URL/health
```

Opening the site's `/admin/` path should then complete GitHub login for `PickleHik3`; any other GitHub account is rejected after identity verification.
