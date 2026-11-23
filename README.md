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
- Keyboard-accessible five-image carousel using every JPEG in the `images/` folder
- Guest review highlights and key property details
- Favicon and SEO description
- No framework, build step, external font or analytics dependency

## Files

```text
lammensyli-site/
├── index.html
├── styles.css
├── translations.js
├── script.js
├── favicon.svg
├── README.md
├── SOURCE-NOTES.md
└── images/
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

## Images

The hero uses the supplied Booking.com image `335563954.jpg` from its original CDN URL. The five JPEG files in `images/` are AI-generated sample visuals.

## Important: replace the sample images

The five JPEG files in `images/` are **AI-generated sample visuals**, not photographs of the actual Lammensyli property. Replace those five gallery/content images with your own authorized property photographs before publishing. Keep the same filenames to avoid changing the HTML, or update each image path and translated alt text.

Recommended source image size: at least 1600 px wide, landscape orientation, optimized JPEG/WebP under about 500 KB each.

## Editing content or translations

- Finnish fallback content is in `index.html`.
- The five additional languages are in `translations.js`.
- A translation key is connected with `data-i18n`, `data-i18n-alt` or `data-i18n-aria`.
- Do not translate the property name `Lammensyli`.

## Review and rate freshness

The site states the review counts and scores available when researched in November 2026. Recheck and update these values periodically. Booking terms, linen/cleaning prices and included equipment can change, so verify them on the listing platforms before publication.
