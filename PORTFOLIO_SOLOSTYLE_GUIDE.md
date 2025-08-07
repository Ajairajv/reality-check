# 📒 Solo-Leveling-Style Portfolio Build Guide

Personal checklist to recreate the dark-purple, neon-anime aesthetic (à la *Solo Leveling S2*) in **any** React / Next.js project.

> Keep this file for quick reference while crafting your portfolio.  All snippets assume Tailwind CSS + DaisyUI + Vite/Next.

---

## 0  Prerequisites
1. Node ≥ 18 | npm ≥ 9
2. `npm i -g vercel` *(optional deploy)*
3. Good hero illustration (PNG with transparency)

---

## 1  Stack & Libraries
| Purpose | Package | Install |
|---------|---------|---------|
| Build / HMR | **Vite** *(or Next.js 15)* | `npm create vite@latest` |
| Styling | **Tailwind CSS 4** + **DaisyUI 5** | `npm i -D tailwindcss postcss autoprefixer daisyui` |
| Motion | **GSAP 3** (+ ScrollTrigger) | `npm i gsap` |
| Sliders | **Swiper 9** | `npm i swiper` |
| Lightbox | **G-lightbox** | `npm i glightbox` |
| Text reveal | **Splitting.js** | `npm i splitting` |

> Analytics (GA4 / GTM) optional.

---

## 2  Tailwind Config Snippet
```js
// tailwind.config.js
export default {
  content:["./src/**/*.{js,jsx,ts,tsx,mdx}"],
  theme:{
    extend:{
      colors:{
        midnight:'#0a0014',
        royal:'#7d0aff',
        magenta:'#c233ff',
      },
      fontFamily:{
        display:['"Barlow Condensed"','sans-serif'],
        body:['Rajdhani','sans-serif'],
      },
    },
  },
  plugins:[require('daisyui')],
  daisyui:{themes:['dark']},
};
```
Import fonts in `globals.css`:
```css
@font-face{font-family:'Barlow Condensed';src:url('/fonts/BarlowCondensed.woff2') format('woff2');font-display:swap}
@font-face{font-family:'Rajdhani';src:url('/fonts/Rajdhani.woff2') format('woff2');font-display:swap}
```

---

## 3  Global CSS Utilities (`globals.css`)
```css
/* Purple film */
.purple-film{background:rgba(125,10,255,.06);mix-blend-mode:multiply;}

/* Grid overlay */
.grid-bg{position:relative;}
.grid-bg::before{content:'';position:absolute;inset:0;
  background-image:repeating-linear-gradient(0deg,rgba(255,255,255,.05)0 1px,transparent 1px 60px),
                   repeating-linear-gradient(90deg,rgba(255,255,255,.05)0 1px,transparent 1px 60px);
  pointer-events:none;z-index:1;}

/* Outline button */
.btn-outline-solo{position:relative;padding:1rem 3.5rem;font-family:'Barlow Condensed';letter-spacing:.25em;color:#fff;}
.btn-outline-solo::before,.btn-outline-solo::after{content:'';position:absolute;inset:0;border:2px solid #fff;transition:.3s;}
.btn-outline-solo:hover::before{inset:-6px;}
.btn-outline-solo:hover::after{inset:6px;opacity:0;}
```
Add once per app:
```jsx
<div className="background-fog" />   {/* optional fog layer */}
```

---

## 4  Layout Blueprint
```
src/
  components/
    SideMenu.jsx     ← fixed left nav
    Hero.jsx         ← parallax banner
    NewsSlider.jsx   ← Swiper implementation
```
### `SideMenu.jsx`
```jsx
export default function SideMenu(){
  const items=["NEWS","ON AIR","STORY","MOVIE","INTRO","STAFF & CAST","MUSIC"];
  return(
    <nav className="fixed top-0 left-0 w-[240px] h-screen flex flex-col bg-gradient-to-b from-midnight via-[#120022] to-[#200032] z-40">
      <Logo/>
      {items.map(txt=>(
        <a key={txt} href={`#${txt.toLowerCase()}`} className="px-8 py-4 text-white/80 tracking-[.2em] font-display hover:text-white hover:bg-white/10 transition">
          {txt}
        </a>))}
    </nav>);
}
```
Wrap main content with `ml-[240px]` to avoid overlap.

### `Hero.jsx`
```jsx
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function Hero(){
  useEffect(()=>{
    gsap.from('.hero-title span',{y:80,opacity:0,stagger:.1,duration:1.2,scrollTrigger:{trigger:'#hero',start:'top 60%'}});
  },[]);

  return(
    <section id="hero" className="relative h-[85vh] flex items-center purple-film grid-bg overflow-hidden">
      <img src="/bg/shadows.svg" className="absolute inset-0 object-cover opacity-30" />
      <img src="/hero/character.png" className="absolute right-0 bottom-0 w-1/2 drop-shadow-[0_0_20px_rgba(125,10,255,0.4)]" />
      <div className="relative z-10 max-w-5xl px-6">
        <h1 className="hero-title font-display text-7xl text-white leading-tight">
          <span className="block">ARISE FROM THE</span>
          <span className="text-royal">SHADOW</span>
        </h1>
        <button className="mt-10 btn-outline-solo">ARCHIVE</button>
      </div>
    </section>
  );
}
```

---

## 5  Motion & Sliders
```js
// Swiper global import (e.g. NewsSlider.jsx)
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

<Swiper slidesPerView={3} loop={true} autoplay={{delay:4000}} breakpoints={{768:{slidesPerView:2},1280:{slidesPerView:3}}}>
  {news.map(n=> <SwiperSlide key={n.id}><NewsCard {...n}/></SwiperSlide>)}
</Swiper>
```

---

## 6  Deploy
1. `git init && git remote add origin <repo>`  
2. `vercel` (or `npm run build && vercel --prod`)  
3. Custom domain via Vercel or Cloudflare Pages.

---

Happy leveling ⚔️ 