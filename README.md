# joonkim.dev

A retro pixel-art RPG personal website. Visitors experience a game boot sequence, land on an interactive pixel town, and explore by clicking into buildings.

**Vibe:** Maplestory × Stardew Valley. Cozy, pixel, witty.

## Concept

```
Splash Screen → Loading Screen → Main Menu → Pixel Town Hub → Sections
```

The "town" is a fully interactive pixel scene. Each building is a section of the site (About, Projects, Blog, Skills, Bookshelf, Now, Contact, Achievements).

## Sections

| Building | Content |
|----------|---------|
| Home | Character Sheet — full-person stats |
| Quest Log | Projects |
| Field Notes | Blog |
| Shop | Skills & Stack (inventory rarity system) |
| Library | Bookshelf |
| Noticeboard | Now Page — "menu of the day" |
| Guild Hall | Contact |
| Hall of Fame | Achievements |

## Status

Core scaffolding and all primary routes are implemented on Astro + Tailwind + Cloudflare.
Content can be expanded over time through `src/content/blog` and `src/content/projects/index.json`.

See [WEBSITE_PLAN.md](./WEBSITE_PLAN.md) for full design spec.
