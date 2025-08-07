# Solo-Leveling Style Guide & Tech Teardown

> Theme blueprint extracted from the official Season-2 website **sololeveling-anime.net** (A-1 Pictures / Aniplex).

---

## 1  Technology Stack Detected

| Layer | Library / Service | Evidence |
|-------|-------------------|----------|
| Build tool | **Vite** | `__vite_ping`, hashed assets `index-fd2a2fc4.js` |
| Hosting / CDN | **Cloudflare Pages** | `cf-cache-status`, IP `104.*` |
| JS motion | **GSAP 3** + **ScrollTrigger** | `gsap.min.js` |
| Slider | **Swiper 9** | `swiper-bundle.min.js` |
| Lightbox | **G-Lightbox** | script tag |
| Text split | **Splitting.js** | `.splitting` classes |
| Utility | **jQuery 3.6** | `window.$` present |
| CSS authoring | **SCSS** → one `style.css` | source-map comment |
| Analytics | **Google Tag Manager** + **GA4** | `gtm.js?id=…` |

_No React/Vue—pages are prerendered HTML enhanced by the libraries above._

---

## 2  Visual Design

### Color Palette
| Use | Hex |
|-----|-----|
| Base / Background | `#0a0014` |
| Primary Accent | `#7d0aff` → `#c233ff` gradient |
| Highlight | pure white (`#ffffff`) |

### Typography
* **Barlow Condensed** — All-caps nav & buttons  
* **Rajdhani** — Body copy, headings

Both fonts are self-hosted WOFF2 files (`@font-face`).

### Background Effects
1. **Purple Film** `background: rgba(125,10,255,.06); mix-blend-mode:multiply;`
2. **Grid Overlay** two `repeating-linear-gradient` layers every 60 px.
3. **Section Fades** top/bottom `div`s with `bg-gradient-to-b` / `to-t`.

### UI Components
* Fixed vertical menu (240 px) with gradient background.
* Hero banner: dark illustration + character PNG parallax.
* Outlined CTA button (“ARCHIVE”) — border animated via pseudo-elements.
* Swiper sliders for NEWS / MOVIE blocks.

---

## 3  Tailwind Setup (Reality Check Integration)

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        midnight: '#0a0014',
        royal: '#7d0aff',
        magenta: '#c233ff',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: { themes: ['dark'] },
};
```

### Global CSS snippets
```css
/* Purple film overlay */
.purple-film { background:rgba(125,10,255,.06); mix-blend-mode:multiply; }

/* Grid overlay */
.grid-bg::before {
  content:''; position:absolute; inset:0;
  background-image:repeating-linear-gradient(0deg,rgba(255,255,255,.05)0 1px,transparent 1px 60px),
                   repeating-linear-gradient(90deg,rgba(255,255,255,.05)0 1px,transparent 1px 60px);
  pointer-events:none; z-index:1;
}

/* Outlined button */
.btn-outline-solo{position:relative;padding:1rem 3.5rem;font-family:'Barlow Condensed';letter-spacing:.25em;color:#fff}
.btn-outline-solo::before,.btn-outline-solo::after{content:'';position:absolute;inset:0;border:2px solid #fff;transition:.3s}
.btn-outline-solo:hover::before{inset:-6px}.btn-outline-solo:hover::after{inset:6px;opacity:0}
```

### Hero JSX Example
```tsx
<section className="relative h-[85vh] flex items-center purple-film grid-bg overflow-hidden">
  <img src="/bg/shadows.svg" className="absolute inset-0 object-cover opacity-30" />
  <img src="/hero/character.png" className="absolute right-0 bottom-0 w-1/2 drop-shadow-[0_0_20px_rgba(125,10,255,0.4)]" />
  <div className="relative z-10 max-w-5xl px-6">
    <h1 className="font-display text-7xl text-white tracking-widest leading-tight">
      <span className="block">ARISE FROM THE</span>
      <span className="text-royal">SHADOW</span>
    </h1>
    <button className="mt-10 btn-outline-solo">ARCHIVE</button>
  </div>
</section>
```

---

## 4  Installing Motion & Slider Libs
```bash
npm i gsap swiper glightbox splitting
```
Add GSAP ScrollTrigger and Swiper initialisation in a small `useEffect`.

---

## 5  Credits & Reference
All information obtained from publicly-served assets and headers of the official Solo-Leveling S2 site ↗︎ <https://sololeveling-anime.net/>.

This guide is provided for educational & inspiration purposes to replicate a similar dark-neon, anime-themed UI in your own projects. 