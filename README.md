# Portfolio Website

Live: https://asmit-123.github.io/Portfolio-Website/

Static site (HTML, CSS, vanilla JS), no build step. Run locally by opening `index.html`, or `python -m http.server`.

## Pages
- `index.html` : main portfolio. `gallery.html` : photo gallery. `404.html` : themed not-found page.
- Press `Ctrl K` (or `/`) on any page for quick navigation.

## Adding a project automatically
The "More builds" row reads your public GitHub repos at load time. To show a repo there, add the topic **`portfolio`** to it on GitHub (repo page, gear icon next to About, Topics). Forks and the three featured projects are skipped. If no repo has the topic, the built-in list is shown. The "public repositories" number is also live.

## Adding photos to the Gallery
Add a resized `.webp` to `assets/gallery/full/` (about 1600px) and `assets/gallery/thumb/` (about 640px), then add an entry to the `DATA` list at the top of `gallery.js`.

## Resume
`assets/Asmit-Bhattacharyya-Resume.pdf` is the public copy (no phone number or referee line). Keep the full version elsewhere.
