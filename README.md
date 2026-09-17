# Mic Cheque Live (43)

Create a modern, high-energy Progressive Web App (PWA) for the "Mic Cheque Podcast"—one of Kenya's biggest comedy and pop-culture shows hosted by Chaxy, Mariah, Mwass, and Saddam. The app should feel immersive, community-driven, and designed mobile-first while scaling seamlessly for desktop.

---

### 1. DESIGN SYSTEM & VISUAL STYLE

* **Aesthetic:** "Frosted Obsidian" dark mode with dynamic 3D elements, glassmorphism, and energetic street-culture vibes.
* **Color Palette:**
  * Background: Studio Dark Slate (`#121212`)
  * Card Surfaces: Dark Glass (`rgba(30, 30, 34, 0.75)` with `backdrop-blur-md` and subtle borders `rgba(255, 255, 255, 0.08)`)
  * Primary Accent: Bus Yellow (`#FACC15`) — for active states, highlights, and primary CTAs
  * Secondary Accent: Studio Mic Red (`#EF4444`) — for live tags, badges, and alerts
  * Text: Off-white (`#F9FAFB`) for main headings, Studio Gray (`#9CA3AF`) for body/muted text
* **Typography:**
  * System-first font stack that respects the user's native device font setting (iOS, Android, Windows, Mac).
  * Fallback Font: **Rubik** (Google Fonts) for a softly rounded, modern, non-serious, high-energy tone.
* **Glassmorphism:** Subtle, non-distracting cards with soft yellow border glows on hover/tap. Avoid heavy performance-killing blurs.

---

### 2. CORE FEATURES & ARCHITECTURE

#### A. Authentication: "Become a Cheque Mate"
* Interactive modal overlay with options:
  * "Continue with Google"
  * "Continue with Apple"
  * "Sign up with Email & Password"
* Upon registration, user creates a `@ChequeMate` handle and picks their favorite host (Chaxy, Mariah, Mwass, or Saddam).
* Profile dashboard storing saved event passes, upvoted hot takes, and FPL Manager ID.

#### B. Home / Landing Page ("The Studio")
* **3D Hero Element:** Floating 3D studio microphone component that subtely tilts with cursor/touch gestures.
* **Latest Episode Spotlight:** Shows current episode title, guest tag, duration, and direct action buttons:
  * "Watch on YouTube" (external link)
  * "Listen on Spotify" (external link)
* **Interactive Campus Tour Route:**
  * Visual route featuring the iconic yellow Mic Cheque School/Party Bus driving along a campus tour track.
  * Campus stops (e.g., UoN, KU, Strathmore, JKUAT) showing free RSVP digital pass claims.

#### C. Community Hub
1. **"Hot Takes Wall" (Digital Mailbag):**
   * Fan submission box for crazy stories, segment prompts, and relationship dilemmas.
   * Upvote counter system for community voting.
   * Filter tags: `#DatingDilemmas`, `#CampusLife`, `#WildStories`, `#KenyanPopCulture`.
   * Special "Discussed on Air" badge for takes featured in episodes.
2. **"Cheque Mates" FPL Hub:**
   * Leaderboard integration for the official Mic Cheque Fantasy Premier League (League Code: `ykpeg4`).
   * Hosts vs. Fan Manager rankings.
   * "Manager of the Week" spotlight banner and a trash-talk banter comment feed.

#### D. Events & Merchandise ("The Shop")
* **3D Flip-Cards for Tickets:** Holographic ticket pass design for events (Cheque Mates Hangouts & Campus Tours). Tapping flips the card in 3D to display event details and a digital QR entry pass.
* **Merch Storefront:** Interactive catalog featuring branded hoodies, t-shirts, caps, and accessories with an "Add to Cart" and checkout workflow.

#### E. PWA Capability
* Configure `manifest.json` for full PWA installation ("Add to Home Screen" prompt).
* Native bottom navigation bar for mobile, top/sidebar nav for desktop. note no gradients

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8500796c-744b-4c25-a812-a2969e653aab).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
