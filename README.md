# Lammensyli website

A responsive, multilingual static website for the Lammensyli holiday cabin in Ruka, Finland.

## Included

- Finnish as the default language
- English, Swedish, Spanish, German and Italian translations
- Styled language selector with saved preference and optional `?lang=en` links
- Responsive navigation and layouts for desktop, tablet and mobile
- Accessible menu, keyboard-friendly native language selector, translated alt/ARIA labels and reduced-motion support
- Booking.com and Airbnb booking links
- OpenStreetMap location map with a Lammensyli pin
- Clickable email and telephone contact details in the reservation section
- Midnight Aurora visual theme with a supplied Lammensyli aurora hero image
- Compact 500 px hero and animated aurora call-to-action button hovers
- Keyboard-accessible dynamic carousel that discovers every supported image in `images/`
- Guest review highlights and key property details
- Favicon and SEO description
- No framework, build step, external font or analytics dependency

## Files

```text
lammensyli-site/
├── index.html
├── styles.css
├── translations.js
├── gallery-config.js
├── script.js
├── favicon.svg
├── README.md
├── SOURCE-NOTES.md
├── assets/
│   └── living-room.jpg
├── scripts/
│   └── generate-image-manifest.py
├── .github/workflows/
│   └── update-image-manifest.yml
└── images/
    ├── images.json
    ├── living-room.jpg
    ├── lake-view.jpg
    ├── bedroom.jpg
    ├── sauna.jpg
    └── winter-trail.jpg
```

## Preview locally

Open `index.html` directly, or run a local server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a public GitHub repository.
2. Copy all files from this folder to the repository root.
3. Commit and push.
4. In **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
5. Save. GitHub will display the public URL after deployment.

## Dynamic carousel images

The carousel has **no image filenames hard-coded in `index.html` or `script.js`**. It discovers files from `images/` in either of these ways:

1. On a normal `username.github.io/repository` GitHub Pages URL, it reads the public repository folder through the GitHub Contents API. Adding or removing an image updates the carousel automatically after the repository change is live.
2. On other hosting or during local preview, it reads `images/images.json`. A bundled GitHub workflow regenerates and commits this fallback manifest whenever `images/` changes.

Supported formats are `.avif`, `.gif`, `.jpg`, `.jpeg`, `.png` and `.webp`. Images are shown whole, never cropped. Portrait and square images are placed side by side, as many as fit the page width, and each landscape image gets its own slide; each group is centred and the layout recalculates when the window is resized. Files are displayed in natural filename order, so names such as `01-exterior.jpg`, `02-living-room.jpg` are useful when you want to control the sequence.

### Add or remove carousel images

- Add or delete image files in `images/` and commit/push the change.
- Do not edit `index.html` or `script.js`.
- For a custom domain, set the public repository once in `gallery-config.js`, for example:

```js
repository: "your-github-name/lammensyli"
```

- For local/offline hosting, regenerate the fallback manifest after changing images:

```bash
python scripts/generate-image-manifest.py
```

When using GitHub Actions, ensure the repository permits workflows to write contents under **Settings → Actions → General → Workflow permissions**. The included workflow only updates `images/images.json`.

## Image sources

The hero background is `assets/hero-lammensyli.jpg` (with a smaller `hero-lammensyli-1440.jpg` for narrower screens): one full-width image combining the Lammensyli cabin photo with an AI-edited aurora sky and frosted spruces. Replace both files to change it. The initial JPEG files in `images/` are AI-generated sample visuals. The fixed introduction image lives separately in `assets/`, so the contents of `images/` can be managed freely for the carousel.

## Important: replace the sample images

The initial JPEG files in `images/` are **AI-generated sample visuals**, not photographs of the actual Lammensyli property. Replace them with your own authorized property photographs before publishing. You may use any filenames; regenerate the manifest when not using automatic GitHub discovery.

Recommended source image size: at least 1600 px wide, landscape orientation, optimized JPEG/WebP under about 500 KB each.

## Editing content or translations

- Finnish fallback content is in `index.html`.
- The five additional languages are in `translations.js`.
- A translation key is connected with `data-i18n`, `data-i18n-alt` or `data-i18n-aria`.
- Do not translate the property name `Lammensyli`.

## Review and rate freshness

The site states the review counts and scores available when researched in November 2026. Recheck and update these values periodically. Booking terms, linen/cleaning prices and included equipment can change, so verify them on the listing platforms before publication.
