# joonkim.dev — Website Plan

**Concept:** A retro pixel-art RPG personal website. Visitors experience a game boot sequence, land on a pixel town map, and explore Joon's life/work by clicking into buildings.

**Vibe:** Maplestory × Stardew Valley. Cozy, peaceful, witty-but-professional.

---

## 1. Experience Flow

```
[SPLASH SCREEN]
  → Logo: "JOON.DEV"  |  Pixel art title card
  → "Press any key to continue"
  → CC-licensed Maple/Stardew-style lofi music fades in

        ↓

[LOADING SCREEN]
  → Pixel-style progress bar
  → Rotating witty loading tips:
      "Loading curiosity module..."
      "Installing opinions on Nietzsche..."
      "Calibrating hot takes..."
      "Syncing gym schedule..."
      "Compiling bad puns..."
      "Loading bookshelf... (this takes a while)"

        ↓

[MAIN MENU]
  → Pixel art scene with menu overlay
  → Player card:
        PLAYER   Joon Kim
        CLASS    Polymath Engineer
        GUILD    Geotab
        LEVEL    [age]
  → Options:
        ▶ Continue       (enters the town)
          Settings       (site settings: audio, motion)
          Credits        (fun credits page — people who shaped me)

        ↓

[PIXEL TOWN — main site hub]
  → Full interactive pixel scene
  → Click buildings to navigate to sections
  → Ambient sound + music continues
```

---

## 2. The Pixel Town Map

Full interactive pixel art scene. Buildings are clickable. Hover shows building name + short description tooltip. Clicking triggers a door-open animation and transitions to that section.

**Town Layout (rough):**

```
  ☁️        ☁️             ☁️
                    🏛️ LIBRARY
  🌲🌲                          🌲
       🏠 HOME    🗺️ QUEST LOG
  🌸                        🌸
    🏪 SHOP    📋 NOTICEBOARD
  🌲                          🌲
       ⚔️ GUILD HALL    🏆 HALL OF FAME
              🌿 path 🌿
```

**Time of day:** Town changes lighting based on visitor's local time (morning/afternoon/night palette shifts). No gameplay logic needed — pure CSS/canvas filter.

**Ambient details:** Pixel clouds drifting, flowers swaying, birds passing. Makes it feel alive without being busy.

---

## 3. Sections

### HOME — Character Sheet (About)
Full-person stat card. Not just developer skills — who Joon is as a human.

**Stats:**
```
STR  ████████░░  Discipline      gym consistency, habits, follow-through
INT  ██████████  Curiosity       psych, philosophy, tech, learning breadth
WIS  ████████░░  Pattern Detect  finding problems before they're obvious
DEX  ███████░░░  Adaptability    polyglot, AI-era, context-switching
CHA  █████████░  Expression      singing, writing, communicating clearly
VIT  ████████░░  Longevity       health-first mindset, sustainable pace
```

**Also includes:**
- Short bio / origin story
- Interests listed as "passive skills" (psychology, philosophy, fitness, singing, personal dev)
- Current "equipped items" (tools/tech actively using)
- A witty flavor text line (like a Pokédex entry)

---

### QUEST LOG — Projects
Each project = a quest entry.

**Quest card fields:**
- Quest name + one-liner
- Status: `COMPLETED` / `IN PROGRESS` / `ABANDONED`
- Difficulty: ★★★☆☆
- Tech used (as item tags)
- Short description
- Links (repo, live demo)

---

### FIELD NOTES — Blog
Blog posts styled as journal/field note entries. RPG journal aesthetic.

**Categories as "expedition types":**
- `[TECH]` — engineering, software
- `[MIND]` — psychology, philosophy, behavioral science
- `[BODY]` — fitness, health
- `[MISC]` — everything else

---

### SHOP / INVENTORY — Skills & Stack
Skills displayed as inventory items with rarity tiers:

```
[LEGENDARY]  Problem Detection, Systems Thinking
[EPIC]       Python, Go, SQL, Backend Architecture
[RARE]       TypeScript, React, DevOps basics
[UNCOMMON]   Philosophy, Behavioral Science
[COMMON]     Git, Linux, Communication
```

Hover on item = tooltip with context ("Used at Geotab to build X").

---

### LIBRARY — Bookshelf
Books read/reading, styled as RPG tomes on a shelf.

**Fields per book:**
- Title + author
- Status: `READ` / `READING` / `WANT TO READ`
- Rating: ★★★★☆
- One-sentence takeaway (optional)
- Genre tag

Categories: Psychology, Philosophy, Tech, Self-Development, Fiction.

---

### NOTICEBOARD — Now Page
"Menu of the Day" — what Joon is currently up to. Updated manually whenever things change.

**Fields:**
- 📖 Currently reading
- 🔨 Currently building
- 🎵 Currently listening to
- 🧠 Currently thinking about
- 💪 Currently training for
- 📍 Currently located

Simple, personal, scannable.

---

### GUILD HALL — Contact
Contact form + social links. Styled as a guild quest board — "Post a Request."

**Links:** GitHub, LinkedIn, email
**Form:** Name, subject (dropdown: "Job Opportunity / Collaboration / Just saying hi / Other"), message.

---

### HALL OF FAME — Achievements
Witty achievement cards. Mix of real milestones and humorous ones.

**Examples:**
```
🏆 HIRED!               Landed first software engineering job
🔍 PROBLEM FINDER       Caught a bug no one else noticed
📚 THE SCHOLAR          Read 20+ non-fiction books
🎵 DUAL CLASS           Can code AND sing (not simultaneously)
🌙 NIGHT OWL            Committed code past 2am (multiple offenses)
🧠 UNSOLICITED WISDOM   Recommended a psychology book in a code review
💪 IRON DISCIPLINE      Maintained workout streak through crunch time
🗺️ POLYMATH             Interests span 5+ unrelated fields
```

---

## 4. Visual Design

**Aesthetic:** Full retro pixel art. 16-bit era. Maplestory × Stardew Valley warmth.

**Color Palette:**
```
Background sky:   #1a1a2e → #2d1b69 (night) | #87CEEB → #FFF8DC (day)
Town ground:      #8B7355, #6B8E23, #556B2F
Building walls:   #DEB887, #D2691E, #8FBC8F
Accent warm:      #FFD700, #FF8C00, #FF6347
Accent cool:      #4169E1, #00CED1, #7B68EE
Text (UI panels): #F5F5DC on #2C1810 (parchment feel)
HP/stat bars:     #00FF7F (green), #FF4500 (red), #4169E1 (blue)
```

**Typography:**
- Pixel/retro font for headings and UI labels (e.g., Press Start 2P, Silkscreen)
- Clean readable font for body text in panels (e.g., VT323 for flavor, Inter for readability)

**UI Panels:** When you click into a section, content appears in a Stardew-style dialogue/panel overlay — wood border, parchment background, pixel close button.

---

## 5. Audio

**Background music — SELECTED:**

| Track | Pack | Artist |
|-------|------|--------|
| "Life is full of Joy" | ✨GOOD VIBE Upbeat Pixel Pop | Clement Panchout |

Source: https://clement-panchout.itch.io/yet-another-free-music-pack
License: CC BY 4.0 — free for any use, attribution required.
**Required credit (must appear on site):** `Music by Clement Panchout – www.clementpanchout.com`

Place attribution in: Credits page + site footer.

May add more tracks later. Same artist has other packs worth checking.

**Toggle:** Music on/off button (pixel speaker icon, top corner). Default: on.

**Track variation:** Optional — different tracks per section/time of day.

**SFX (optional, low priority):** Soft click sounds, page-turn, door-open. All CC-licensed.

---

## 6. Pages / Routes

```
/                   Splash → Loading → Menu → Town (hub)
/about              Character Sheet
/projects           Quest Log
/blog               Field Notes (index)
/blog/[slug]        Individual post
/skills             Inventory / Shop
/bookshelf          Library
/now                Noticeboard
/contact            Guild Hall
/achievements       Hall of Fame
/credits            Credits (accessible from main menu)
```

---

## 7. Content To Write

- [x] Character Sheet bio + flavor text
- [x] Stats values + descriptions
- [x] 3-5 initial blog posts
- [x] Project entries (past + current)
- [x] Bookshelf entries
- [x] Achievement list (real + witty)
- [x] Now page (first entry)
- [x] Credits page
- [x] Loading screen tips (15-20)

---

## 8. Nice-to-Haves (Post-Launch)

- Pixel character (chibi Joon) wandering the town map
- Seasonal town changes (snow in winter, cherry blossoms in spring)
- Secret easter egg (konami code unlocks something)
- Dark/light mode = night/day town toggle
- Blog post RSS feed
- OG image generation for blog posts

---

## 9. Open Questions

- [x] Tech stack: Astro + Tailwind + Cloudflare, with contact API route wired for Resend env vars
- [x] Music: "Life is full of Joy" by Clement Panchout (CC BY 4.0) — may add more later

**Resolved:**
- Hosting: Cloudflare (already live)
- Domain: joonkim.dev (already owned)
- Now page update cadence: whenever
