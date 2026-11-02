# Mayank Soni — Luxury Dark / Digital Atelier Portfolio

A premium, immersive creative developer portfolio engineered with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4**, and **GSAP Motion**. Designed in a **Luxury Dark / Digital Atelier** aesthetic with deep obsidian surfaces, disciplined electric lime contrast, refined editorial typography, and atmospheric depth.

---

## 🏛️ Design Language & Aesthetics

### 1. Base Palette
- **Primary Background**: `#08090D` — deep obsidian.
- **Secondary Background**: `#101219` — rich charcoal.
- **Elevated Surfaces**: `#171A24` — dark glass panels with subtle inner bevels.
- **Primary Typography**: `#F4F2ED` — warm near-white.
- **Secondary Typography**: `#9296A3` — muted cool grey.
- **Fine Borders & Separators**: `#292C37` & `rgba(255, 255, 255, 0.07)`.

### 2. Contrast & Accent Hierarchy
- **Electric Lime (`#C6F36B`)**: Primary signature accent for high-priority CTAs, active navigation states, live playback indicators, and typographic accents.
- **Electric Blue (`#7185FF`)**: High-concurrency systems, network telemetry, and LinkedIn links.
- **Vivid Violet (`#A78BFA`)**: Multi-agent DAG states and anime dossier highlights.
- **Warm Amber (`#E9AF65`)**: Latency telemetry, human-in-the-loop review alerts, and algorithm callouts.

### 3. Atmosphere & Surfaces
- Multi-layered near-black and charcoal surfaces with subtle dimensional depth.
- Low-opacity ambient lighting (`rgba(113, 133, 255, 0.08)` and `rgba(198, 243, 107, 0.06)`).
- Dark translucent glassmorphic panels (`background: rgba(23, 26, 36, 0.72)`, `backdrop-filter: blur(18px)`).
- Selective dark chrome sheens with fine metallic border reflections.

### 4. Typography System
- **Headings**: [*Newsreader*](https://fonts.google.com/specimen/Newsreader) with italic ligatures for an editorial, literary feel.
- **Body Text**: [*Geist*](https://vercel.com/font) for clean modern readability.
- **Technical Metadata**: [*Geist Mono*](https://vercel.com/font) for coordinates, status chips, and throughput metrics.

---

## 🧭 Page Architecture & Sections

### 1. Hero / Overview
- Oversized typography (`Mayank Soni`) with electric lime punctuation.
- Live academic credential: **IIT Jodhpur — B.Tech Electrical Engineering (2024–2028)**.
- Jodhpur coordinates (`26.29° N, 73.01° E`) and real-time IST clock.
- Architectural specimen card on `#171A24` detailing current engineering focus areas.
- High-contrast CTAs: Electric lime pill for *Explore Selected Work*, dark glass for *Get in Touch*.

### 2. About & Technical Strengths
- Academic background as an electrical engineering student at IIT Jodhpur.
- Engineering philosophy cards highlighting high-concurrency systems, agentic safety layers, and state DAGs.
- **Compact Technology Stack**: Editorial specimen matrix categorizing skills by domain (`languages`, `frontend`, `backend & systems`, `ai & machine learning`, `databases & infrastructure`, `creative tools`).

### 3. Selected Work & Deep Project Showcases
Varied, non-template editorial presentations for core engineering repositories:
1. **NeuroRoute** — AI-driven packet optimizer featuring a live Rich TUI terminal preview with PyTorch DQN telemetry (`4,820 pps`, `1.42 ms`).
2. **Anchor8** — Autonomous agent security and policy control layer with real-time `SAFE / REVIEW / DANGEROUS` classifier lifecycle.
3. **Continuum** — AI-native virtual film studio OS and production continuity coordinator powered by Google Cloud Agent Builder and ClickHouse MCP state graphs.
4. **EV Route Optimizer** — C++ pathfinder on 150k-node OpenStreetMap graphs (Jaipur city) with dynamic charging range constraints.
5. **Torrent Downloader** — High-performance desktop BitTorrent client handling 100+ GB swarms with Electron v33 and atomic storage.
- Interactive **"Inspect Spec & Architecture"** modal dialog for each project detailing the problem statement, solution architecture, and personal contributions.

### 4. Beyond the Build (Personal Creative Intermission)
- **A. Currently Listening (Spotify Web API):** Server-side route handler (`/api/spotify`) broadcasting currently playing tracks with live electric lime equalizer bars or recently played tracks with album artwork and Spotify links. (Graceful preview fallback when credentials are not yet configured).
- **B. Anime Corner (AniList GraphQL):** Live profile connection displaying total completed anime, currently watching, total episodes, days watched, and mean score with Japanese kanji watermark (`アニメ`).
- **C. Find Me on Discord:** Tactile personal identity card with `@mayanks0ni` handle and one-click copy feedback.
- **D. Visual Archive (Designs & Edits):** Dark gallery (UI/UX, Posters & Brand, Motion & Edits) with interactive [Lightbox Modal](file:///Users/mayank/Coding/portfolio/frontend/components/LightboxModal.tsx).

### 5. Contact & Closing
- Compelling editorial invitation to collaborate and open to work status.
- One-click copy email button for `mayanks86027@gmail.com` with compose shortcut.
- Verified links to GitHub and LinkedIn.
- Colophon footer with smooth back-to-top navigation.

### 6. Moonlit AI Terminal Companion (Integrated Modal)
- Discreet macOS-style floating terminal companion preserving terminal commands (`help`, `about`, `projects`, `skills`, `contact`, `clear`) and AI query chat functionality.

---

## 🛠️ Tech Stack

| Domain | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Components & Dynamic API Routes) |
| **Language & UI** | React 19, TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| **Motion** | GSAP (`gsap`, `@gsap/react`, `ScrollTrigger`) |
| **Typography** | `next/font/google` (*Newsreader*, *Geist*, *Geist Mono*) |
| **Icons** | Lucide React |
| **Integrations** | Spotify Web API (OAuth 2.0), AniList GraphQL API |

---

## ⚙️ Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables (Optional)

Copy `.env.example` to `.env.local` inside `frontend/`:

```bash
cp .env.example .env.local
```

Configure your personal keys:

```ini
# 🎵 Spotify Web API
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token

# 🎌 Anime Corner (AniList)
ANILIST_USERNAME=mayanks0ni

# 💬 Discord Social Tag
NEXT_PUBLIC_DISCORD_TAG=mayanks0ni
```

> **Note:** If Spotify credentials are not provided, the portfolio automatically operates in a high-fidelity preview mode with zero crashes or UI breaks.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 👤 Author

**Mayank Soni**  
Electrical Engineering Undergraduate — Indian Institute of Technology (IIT) Jodhpur  
- 📧 Email: [mayanks86027@gmail.com](mailto:mayanks86027@gmail.com)  
- 💻 GitHub: [github.com/mayanks0ni](https://github.com/mayanks0ni)  
- 🔗 LinkedIn: [linkedin.com/in/mayanks0ni](https://linkedin.com/in/mayanks0ni)  
