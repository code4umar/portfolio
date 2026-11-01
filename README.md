# Muhammad Umar Farooqi — Portfolio

Static site (HTML, CSS, vanilla JS) served by GitHub Pages at https://code4umar.github.io/portfolio/

| File | What it holds |
|---|---|
| `index.html` | All page content (English) and the analytics IDs |
| `style.css` | Navy & white theme, layout, Urdu / RTL styles |
| `script.js` | Loader, animations, GitHub data, contact form, command palette, analytics |
| `i18n.js` | English ↔ Urdu switch and every Urdu translation |
| `assets/og-image.png` | 1200×630 card shown when the link is shared on WhatsApp / LinkedIn |

## Visitor analytics

Analytics load only on the live site (not on `file://` or `localhost`) and are skipped for visitors with Do Not Track on. Set either ID — or both — in `index.html`:

```js
window.SITE_CONFIG = {
  ga4: 'G-XXXXXXXXXX',     // Google Analytics 4
  goatcounter: 'yourname'  // GoatCounter
};
```

**Google Analytics 4** (free, detailed): analytics.google.com → Admin → Create property → Web stream with URL `code4umar.github.io` → copy the Measurement ID (`G-…`).

**GoatCounter** (free, simple, privacy-friendly, no cookie banner needed): sign up at goatcounter.com, pick a code such as `umarfarooqi`, and use that code.

Tracked events: `download-cv`, `open-deskly`, `open-github`, `open-linkedin`, `view-certificate`, `copy-email`, `contact-form-submit`, `language`.

## Urdu translation

Add or edit Urdu text in the `UR` object in `i18n.js` (CSS selector → translation). Link straight to the Urdu version with `?lang=ur`.

## Social preview

After deploying, refresh the cached preview with the LinkedIn Post Inspector (linkedin.com/post-inspector) and the Facebook Sharing Debugger (developers.facebook.com/tools/debug). WhatsApp picks up the new image on the next share, sometimes after a few hours.
