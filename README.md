# Termux Launcher Site

Product, setup, documentation, and showcase site for [Termux Launcher](https://github.com/PickleHik3/termux-launcher). GitHub Pages builds the site with Jekyll and publishes it at <https://picklehik3.github.io/termux-launcher-site/>.

## Layout of the site

- `index.html` holds the two views (About, Docs); `migrate-vaj.html` is the standalone migration page.
- `styles.css` carries the tokens and the glass design system; `DESIGN.md` is the spec it follows and the contract between `index.html`, `styles.css` and `motion.js`. Read it before changing any of the three.
- `app.js` routes views and hashes, hydrates the wiki and release data, and builds the search index.
- `motion.js` owns the GSAP scroll story on the About view, the reveal observer and the sliding nav, sidebar and TOC indicators. It is gated on `prefers-reduced-motion` and drops out cleanly without GSAP.
- The `?v=` query on the stylesheet and scripts is a cache-bust; bump it whenever you edit `styles.css`, `app.js` or `motion.js`.

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
