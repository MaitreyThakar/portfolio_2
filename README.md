# Maitrey Thakar — Personal Portfolio Website

A dark, bold, editorial creative personal portfolio engineered with semantic HTML5, modern CSS3, and modular ES6 JavaScript. Built with high performance, accessibility, and zero-framework agility for deployment to GitHub Pages.

---

## 🚀 Features & Stack Overview

- **Aesthetic:** Dark editorial theme (`#0A0A0B` background, `#F2F2F0` primary text, `#8A8A8F` muted secondary, `#C6FF3D` electric lime accent).
- **Typography:** Google Fonts ("Anton" for giant condensed headlines, "Inter" for clean body text, "Caveat" for handwritten signatures).
- **Smooth Motion & Physics:** Smooth scrolling with **Lenis 1.1.9**, scroll-synced interactions with **GSAP 3.12.5 + ScrollTrigger**, FLIP-animated project filters, and interactive before/after image comparison slider.
- **Accessibility:** Full keyboard operability, visible focus rings (`:focus-visible`), WCAG AA+ contrast ratios, ARIA dialog modal with focus trapping, ARIA slider, and strict `prefers-reduced-motion` compliance.
- **Zero Build Step:** 100% native ES modules and plain CSS. No Webpack, Vite, or npm compilation required.

---

## 🛠️ Project Structure

```text
├── index.html              # Semantic HTML5 entry document & metadata
├── css/
│   ├── base.css            # Custom properties, fluid clamps, reset, focus
│   ├── layout.css          # 12-column grid, breakpoints (360-1920px), header
│   ├── components.css      # Cards, buttons, modal, marquee, sliders, toast
│   └── animations.css      # Keyframes, loader, mask reveals, reduced motion
├── js/
│   ├── main.js             # Root controller, Lenis + GSAP sync, UI handlers
│   ├── cursors.js          # Desktop custom mouse dot & floating hero cursors
│   ├── filter.js           # Project filter engine & accessible details modal
│   ├── counters.js         # Animated numeral counting triggered on scroll
│   ├── timeline.js         # Vertical timeline progress line & card reveals
│   └── marquee.js          # Infinite technology ticker
├── data/
│   └── content.js          # Single source of truth: all text, projects & stats
├── assets/
│   └── img/                # High-res SVG diagrams, silhouettes & placeholders
├── robots.txt              # Search engine crawling rules
├── sitemap.xml             # XML sitemap
└── README.md               # Documentation & deployment guide
```

---

## 📝 How to Edit Content (`/data/content.js`)

All portfolio content is decoupled into `/data/content.js`. To update your information, open that single file:

1. **Email:** Find `links.email` and replace `'your@email.com'` with your personal contact email.
2. **Project Demo & Code Links:** Search for `TODO:` in `projects`. Replace `demoUrl: "#"` and `repoUrl: "#"` with your live links or repository URLs.
3. **Internship Dates:** Under `timeline`, find the entries for `AIQuantum Smart Solutions` and `BrainyBeam Technology` and update `year: "TODO: [Dates]"` with your actual dates (e.g., `"May 2024 — July 2024"`).
4. **Certifications:** Update the `certifications` array and the `stats` count to reflect your latest credentials.

---

## 🖼️ How to Replace Images

1. **Your Profile Photo:**
   - Save your cutout portrait photograph with a transparent background as a PNG file.
   - Name it `me.png` and place it in `/assets/img/me.png`.
   - The hero automatically layers your photo between the giant background outline word and the foreground title to create depth.
   - If missing, the site gracefully falls back to the stylized vector silhouette (`/assets/img/silhouette.svg`).
2. **Project Thumbnails:**
   - Replace or add thumbnail images inside `/assets/img/` (PNG, JPG, WebP, or SVG).
   - In `/data/content.js`, set `image: "assets/img/your-image.png"` on the corresponding project item.
3. **Showcase Comparison Images:**
   - Replace `/assets/img/showcase-raw.svg` and `/assets/img/showcase-real.svg` with your before/after system screenshots.

---

## 🌐 How to Deploy to GitHub Pages in 5 Steps

Because this project uses native HTML5, CSS3, and ES modules, GitHub Pages can host it directly without any build step:

1. **Initialize Git (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "feat: complete production portfolio for Maitrey Thakar"
   ```
2. **Create a GitHub Repository:**
   - Head to [github.com/new](https://github.com/new) and name your repository `portfolio` (or `MaitreyThakar.github.io`).
3. **Link Remote and Push:**
   ```bash
   git remote add origin https://github.com/MaitreyThakar/portfolio.git
   git branch -M main
   git push -u origin main
   ```
4. **Enable GitHub Pages:**
   - Open your repository on GitHub.
   - Click **Settings** &rarr; **Pages** (under the "Code and automation" section).
   - Under **Build and deployment > Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and `/ (root)`, then click **Save**.
5. **Visit Your Live Site:**
   - Within 1–2 minutes, your portfolio will be live at:
     `https://maitreythakar.github.io/portfolio/` (or your chosen URL).

---

## 🧪 Verification & Quality Benchmarks

- **Browser Verification:** Validated at responsive viewports `360px`, `768px`, `1024px`, `1440px`, and `1920px` with 0px horizontal overflow.
- **Accessibility:** WCAG AA/AAA contrast ratios; keyboard-navigable modal with focus lock and Escape listener; slider operable via keyboard arrows; screen-reader accessible attributes.
- **Performance:** Asynchronous font swaps (`font-display: swap`), lazy-loaded media assets, lightweight JS modules under 30KB total.
