# Termux Launcher Site

Product, setup, documentation, and showcase site for [Termux Launcher](https://github.com/PickleHik3/termux-launcher). GitHub Pages builds the site with Jekyll and publishes it at <https://picklehik3.github.io/termux-launcher-site/>.

## Edit the wiki

The wiki pages live in `_wiki/` as Markdown with `title` and numeric `order` front matter. Lower order values appear first in the sidebar.

Once production OAuth is configured, sign in at <https://picklehik3.github.io/termux-launcher-site/admin/>. The Decap editor can create, edit, reorder, and delete pages, upload images to `assets/uploads/`, and publish directly to `main`.

## Local preview

Install the pinned GitHub Pages dependencies and serve the site:

```sh
bundle install
bundle exec jekyll serve --baseurl ""
```

Open <http://127.0.0.1:4000/>.

To test the CMS without GitHub authentication, run the local content proxy in a second terminal:

```sh
npx decap-server
```

Then open <http://127.0.0.1:4000/admin/>. Local CMS edits write directly to the working tree and still need to be reviewed and committed normally.

## Production authentication

The hardened Cloudflare Worker in `oauth-worker/` handles GitHub OAuth. It accepts only the `PickleHik3` GitHub login and never stores access tokens. See [`oauth-worker/README.md`](oauth-worker/README.md) for the one-time deployment procedure.
