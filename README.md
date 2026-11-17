# Santosh Barigedi — Personal Portfolio

An interactive, responsive portfolio built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Motion for React** (`motion`). Inspired by an anime visual aesthetic featuring a near-black textured background, subtle crimson brushstroke accents, warm ivory typography, and continuous drifting red leaves.

---

## 🚀 Running Locally

1. **Install dependencies**:
   ```bash
   pnpm install
   # or: npm install
   ```

2. **Start the development server**:
   ```bash
   pnpm dev
   # or: npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production build check**:
   ```bash
   pnpm build
   pnpm start
   ```

---

## 🛠️ Architecture & Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (`strict: true`)
- **Styling**: Tailwind CSS with custom theme tokens (`--color-bg`, `--color-crimson`, etc.)
- **Typography**: 
  - **Headings & Display**: `Electroharmonix.otf` (Released under **CC0 license / Public Domain** by Ray Larabie / Typodermic Fonts) with Google Font `Cinzel` fallback. **100% free for commercial & personal public use.**
  - **Body text**: Google Font `Inter`.
- **Landing Animation & Choreography**:
  - **Top Wordmark**: `SANTOSH BARIGEDI` smoothly slides in from left to right on page load.
  - **Bottom Navigation**: Slides smoothly up into view from the bottom.
  - **Continuous Anime Leaves**: Seamless, multi-layered HTML5 canvas animation running at 60 FPS with organic curved silhouettes, natural sinusoidal drift, and depth-based recycling that never stops across the entire portfolio.
  - **Ambient Video / Atmospheric Backdrop**: Integrates the 1080p anime video backdrop (`public/videos/landing.mp4`) with a dark vignette overlay ensuring crisp readability.
- **Hero Dynamic Role Animation**:
  - `components/TypewriterRole.tsx`: Letter-by-letter typing and deleting cycle with a blinking crimson cursor cycling through:
    1. `Full-Stack Vibe Developer`
    2. `Problem-Solving Builder`
    3. `No Code Developer`
    4. `Website Tester`
    5. `UI/UX Tester`
    6. `Video Editing`

---

## 📂 Project Structure

```
portfolio-anime_style/
├── app/
│   ├── layout.tsx              # Root layout, Google Fonts (Inter + Cinzel)
│   ├── globals.css             # Tailwind imports, Electroharmonix @font-face, tokens
│   └── page.tsx                # Single-page layout with backdrop video & leaves
├── components/
│   ├── HeroSection.tsx         # Clear introduction, wordmark, specializations
│   ├── TypewriterRole.tsx      # Letter-by-letter rotating title component with cursor
│   ├── AboutSection.tsx        # Bio, technical skill breakdown, education card
│   ├── ExperienceSection.tsx   # SDE Internship, Netmaxin Group, Achievements
│   ├── ProjectsSection.tsx     # AI Interview Coach, CertiFlow, A³-Agent, etc.
│   ├── CertificatesSection.tsx # Category-filtered certificate grid with preview trigger
│   ├── CertModal.tsx           # Accessible modal dialog (Escape key, focus trap, tab navigation)
│   ├── BottomNav.tsx           # Top wordmark (slides left->right) & bottom nav (slides up)
│   ├── LeavesCanvas.tsx        # Continuous, elegant organic red anime leaf particle loop
│   ├── BrushBlob.tsx           # Gentle floating Japanese-style crimson brush blobs
│   └── Reveal.tsx              # Reusable motion reveal helpers
├── lib/
│   └── data.ts                 # Source of truth: profile, skills, timeline, projects, certs
└── public/
    ├── certificates/           # All 19 verified certificates (PDF & PNG)
    ├── fonts/                  # Electroharmonix.otf (CC0 Public Domain)
    ├── images/                 # Atmospheric artwork (bg-clouds.jpg)
    └── videos/                 # Landing animation video (landing.mp4)
```

---

## ✏️ Updating Content & Adding Certificates

All portfolio data is centralized in **`lib/data.ts`**:
- **Edit bio & rotating roles**: Update `PROFILE.roles` or other fields
- **Add or change projects**: Edit `PROJECTS`
- **Add new certificates**:
  1. Drop the PDF or image file into `public/certificates/`.
  2. Add an entry to the `CERTIFICATES` array in `lib/data.ts` with its category (`networking`, `security`, `cloud`, or `dev`).

---

## 🌐 Deploying to Vercel

The site is ready for deployment. You can deploy it using:
```bash
npx vercel
```
or connect your GitHub repository directly to Vercel.
