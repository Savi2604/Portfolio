# SAVITHA K — Developer Portfolio

A luminous **glassmorphic neon-tech** personal portfolio built with **HTML5 + Tailwind CSS (CDN) + Vanilla JavaScript**. Zero build step, 100% static — optimized for free deployment on **GitHub Pages**.

## Features

- **3-column asymmetric grid** — Project Streams (left) · Profile Core (center) · Analytics & Telemetry (right).
- **Glassmorphism panels** — frosted glass, neon borders and soft glow-on-hover.
- **Telemetry charts (Chart.js)** — an Amethyst *Radar* chart (skill proficiency density) and a live Cyan *Line* chart (simulated portfolio traffic ingestion).
- **Interactive shell terminal** — a retro-futuristic console supporting `help`, `about`, `skills`, `projects`, `contact`, `clear` (plus command history via ↑/↓).
- **Fully responsive** with smooth CSS transitions and reveal-on-scroll animations.

## Structure

```
.
├── index.html        # markup + CDN includes
├── css/styles.css    # design system, glass panels, neon, responsive
├── js/main.js        # charts, live metrics, terminal engine
└── .nojekyll         # tell GitHub Pages to serve files as-is
```

## Run locally

Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Push to the `main` (or default) branch.
2. Repo **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / root.
3. Your site goes live at `https://<username>.github.io/<repo>/`.

---

Built by **Savitha K** · [GitHub](https://github.com/Savi2604) · [LinkedIn](https://www.linkedin.com/in/savitha-k-44169a357) · savithak2006@gmail.com
