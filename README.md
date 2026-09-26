<div align="center">

Formline — Dark Studio Landing Page Template

A hand-built, dependency-free landing page template for design tools, studios
and product companies. Dark "ink & bone" theme, custom cursor, preloader,
letter-roll buttons, split-text headings, logo marquee, a fake app UI demo,
video-style story cards, a bento feature grid and an animated FAQ.

</div>

## What's inside

```
formline/
├── index.html          # the whole page, one file
├── css/
│   └── style.css       # design tokens + all styling
├── js/
│   └── main.js         # all interactions, vanilla JS, zero dependencies
├── assets/
│   ├── favicon.svg
│   └── img/            # replace these with your own product shots
├── .gitignore
├── LICENSE             # MIT — use it for anything
├── PUBLISHING.md       # step-by-step GitHub Pages guide (drag & drop)
└── README.md
```

## Features

- **Preloader** with an organic-feeling percentage counter and curtain reveal
- **Custom cursor** — dot + lagging ring, grows on links, shows "Drag" /
  "Watch" labels over interactive media (auto-disabled on touch devices)
- **Letter-roll buttons** — every character animates individually on hover
- **Split-text headings** that stagger in per character on scroll
- **Draggable hero cards** — grab the floating product renders and throw
  them around
- **Infinite logo marquee**, two rows, opposite directions, pauses on hover
- **Fake app UI** with tabs (Sketch → Render → Iterate → Make it real),
  a typing prompt field and auto-cycling canvas frames
- **Story cards** that open a modal "player"
- **Bento feature grid** with hover image swaps and zooms
- **Animated FAQ accordion** using native `<details>` under the hood
- **Respects `prefers-reduced-motion`** — every animation has a quiet fallback
- Fully responsive, including a full-screen mobile menu

## Make it yours

1. **Brand** — search `Formline` in `index.html` and swap the name.
2. **Colors** — everything lives in the `:root` block at the top of
   `css/style.css`. Change `--accent` and you've rethemed the site.
3. **Fonts** — swap the Google Fonts link in `index.html` and the two
   `--font-*` tokens in the CSS.
4. **Images** — drop your own shots into `assets/img/` keeping the same
   filenames, or update the paths in `index.html`.
5. **Copy** — it's all plain HTML. No build step, no framework, nothing
   to install.

## Running locally

It's static. Double-click `index.html`, or for nicer routing:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## License

MIT. Use it commercially, modify it, ship it. Attribution appreciated,
never required. All imagery in `assets/img/` was generated for this
template; the brand names in the marquee are fictional.

<div align="centr">

If this template is useful, please leave a star ⭐ on GitHub to show your support!

</div>
