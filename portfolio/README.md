# Mithun Murali — Portfolio

## Folder Structure
```
portfolio/
├── index.html          ← Main HTML — all pages live here
├── css/
│   └── styles.css      ← All styling, tokens, animations
├── js/
│   └── main.js         ← All interactivity, routing, cursor
├── assets/             ← LOCAL assets only (keep minimal)
│   └── (placeholder)
└── README.md
```

## Media Assets
All images, videos, and heavy files are hosted on Cloudinary.
Never put large files in the assets/ folder — use Cloudinary URLs instead.

Cloudinary URL format:
```
https://res.cloudinary.com/[your-name]/image/upload/[transforms]/[filename]
```

Useful transforms:
- `w_1200,q_80,f_webp` → resize to 1200px wide, 80% quality, WebP format
- `w_800,q_70,f_webp`  → for card thumbnails
- `w_400,q_80,f_webp`  → for small previews

## Deployment
Connected to Vercel via GitHub.
Push to main branch → auto deploys.

```
git add .
git commit -m "your message"
git push
```

## Adding New Content
1. Export from Figma/Procreate
2. Upload to Cloudinary
3. Copy the URL (with transforms)
4. Paste into index.html at the right place
5. git push → live in ~30 seconds
