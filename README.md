# Life RPG v2 — your life, your rules

A Solo Leveling–inspired life game. The player is **you**: you do real tasks,
they become quests, you check in, you earn EXP + gold + stats, you level up,
you rank up (E → S), you slay a weekly boss, you buy real rewards.

Everything is stored in your browser — no account, no server, no cost.
Cloud sync (optional, free) makes your save follow you across devices.

---

## What's in the game

| Tab | What it does |
|---|---|
| 👁️ **Player** | Your system window: level, rank, EXP/HP bars, **STR/INT/VIT/CHA** stats, class, badges + **📸 Share Card / ⬇ Save Card** (generates a character-card image) + **📊 Month Report** |
| ⚔️ **Quests** | 🐉 **Weekly Boss** (new boss every Monday, 3 phases, BOSS DOWN screen) · 📡 **System Quest** (a random daily quest from the System) · **Daily / Weekly / Monthly** quest boards. Tap a quest name to edit it. |
| 📜 **Log** | Every deed you've ever completed |
| 🛒 **Shop** | Spend gold on REAL rewards you allow yourself |
| ⚙️ **Rules** | **Game Master panel — every rule is editable** (below) |

### Quest frequencies
- **Daily** — resets every midnight
- **Weekly** — resets every Monday
- **Monthly** — resets on the 1st
- Finish ALL quests of a period → **Perfect Day / Week / Month** gold bonus.

### Classes (pick at creation, change anytime in Rules)
- ⚔️ **Warrior** — +25% EXP from Body quests (feeds STR)
- 🔮 **Mage** — +25% EXP from Mind quests (feeds INT)
- 🛡️ **Guardian** — +25% EXP from Discipline quests (feeds VIT)
- 🃏 **Trickster** — +25% EXP from Social quests (feeds CHA)

Every check-in also raises the matching stat (bigger quest = more points).

### The System's rules (all editable)
- ≥1 quest/day → 🔥 streak grows · miss a day → streak breaks, **−HP**
- Every check-in heals +HP
- Weekly boss: set your own boss task (or auto — "the hardest thing you've been avoiding")

## The Game Master panel (Rules tab) — everything you can change

- **Character** — name, avatar, class, sound
- **Leveling curve** — EXP base, curve steepness, and the level each rank starts at (D/C/B/A/S)
- **Survival** — HP penalty for missed days, HP heal per check-in, max HP
- **Perfect bonus** — gold for perfect day / week / month
- **Weekly boss** — total EXP, total gold, number of phases, kill bonus
- **The System** — random daily System quests on/off
- **Cloud sync** — see below
- **Data** — export / import / reset rules / reset all

## Cloud sync (optional, free, ~3 min setup)

Makes your save follow you across devices (phone ↔ laptop, etc.).

1. Sign up free at **supabase.com** → "New project" (any region).
2. Open **SQL Editor**, paste this, Run:
   ```sql
   create table public.saves (
     id text primary key,
     data jsonb not null,
     updated_at timestamptz not null default now()
   );
   alter table public.saves enable row level security;
   create policy "open personal sync"
     on public.saves for all
     using (true) with check (true);
   ```
3. **Project Settings → API** → copy "Project URL" and "anon public key"
   into the Cloud Sync boxes (Rules tab).
4. Tap **⬆ Push**. On your phone (or any device): open the app, paste the
   same URL + key, tap **⬇ Pull**. Tick **auto-sync** and it saves to the
   cloud after every check-in.

⚠️ Treat the URL + key like a password — anyone with both can read this save.
(You can always revoke/regenerate the key in Supabase.)

## Installing it on your phone

Open the app URL in your phone's browser:
- **Android (Chrome):** menu ⋮ → "Add to Home screen" / "Install app".
- **iPhone (Safari):** Share → "Add to Home Screen".

It opens fullscreen with its own icon, works offline once loaded.

## Putting it on the internet for free (optional)

This is a static folder — any free static host works:
1. **Cloudflare Pages** or **Netlify** — drag & drop the `life-rpg` folder → done.
2. **GitHub** — put the folder in a repo, enable GitHub Pages.

Then install it on your phone from that link and it's yours forever.

## How to change / extend this app

Don't know code? No problem — describe what you want in plain English to an
AI and point it at these files. The map:

| File | What it is |
|---|---|
| `index.html` | the screens (player, quests, log, shop, settings, pop-ups) |
| `style.css` | the whole look (blue "system window" aesthetic) |
| `app.js` | all the game logic — search for the function you want to change |
| `manifest.webmanifest` | app icon / install settings |
| `sw.js` | offline support (ignore this) |
| `icon-192.png` / `icon-512.png` | app icons |

Useful places in `app.js`:
- `DEFAULT_QUESTS` / `DEFAULT_REWARDS` — starter content
- `SYS_POOL` — the pool of random System quests (add your own!)
- `BOSS_POOL` — the names of the weekly bosses
- `expNeededFor(level)` + Settings — the level curve
- `rankForLevel(l)` + Settings — rank thresholds
- `rollover()` — daily/weekly/monthly reset, streak, HP penalty, month report
- `checkIn()` / `bossHit()` / `systemHit()` — the core loop
- `drawCard()` — the shareable character card image
- `syncPush()` / `syncPull()` — cloud sync

## Ideas for v3

- Class evolution at rank B/A/S (new abilities: e.g. Warrior "Adrenaline" = double EXP for 1 day, bought with gold)
- Boss HP bar with real damage numbers + weekly boss "dungeon" theme
- Quest chains (finish quest A unlocks quest B)
- "Doom countdown" — monthly quest shows a shrinking deadline bar
- Export your whole log as a CSV
- Sound pack (clicks, level-up music stinger)
