# Made by Amar — Portfolio

Static gallery portfolio served at [madebyamar.co](https://madebyamar.co) via GitHub Pages (`CNAME`).

- `index.html` — page content; each gallery tile is an `<li class="tile" data-project="...">`
- `styles.css`, `script.js` — styling, project filters and lightbox
- `images/` — web-optimized WebP (`name.webp` full size, `name-thumb.webp` for the grid)
- `assets/originals/` — source PNGs

## Adding a piece

```bash
convert assets/originals/new.png -resize 1080x -strip -quality 82 images/new.webp
convert assets/originals/new.png -resize 600x -strip -quality 78 images/new-thumb.webp
```

Then copy a tile in `index.html`, set `data-project`, `data-full`, `data-caption`, the thumb `src` and `alt`.
To add a new project, also add a matching filter button.
