# LiFE RPG — Extracted Blueprint (from the YouTube tutorial)

Source: "How to Build a Solo Leveling System in Notion | LiFE RPG Tutorial" — heyalbert (9:09)
The video builds a Simple Version in Notion; the creator's full product (liferpg.site) is the "More" list.

---

## 1. Core data model (3 databases / 3 tables)

### Character (1 row = you)
- Name (real name, username, or game name)
- Avatar / profile picture
- **Current EXP** — rollup = SUM of EXP from all Log entries
- **Level requirements** — in the video: 5 manual number properties (L2 needs 1000 EXP, etc.)
  - In the full system: a formula-based curve, so you never define each level by hand
- Derived: current level + dynamic EXP progress bar (formula)

### Quest (your daily tasks)
- Task name (e.g. "50 pushups")
- **Rewarded EXP** — number you assign per quest. Rule from the video:
  > "Your life, your rules. You are the game master of your life."

### Log (game history — the ledger)
- Created automatically each time you complete a quest
- EXP Earned (number)
- Label (text — what you did, formatted)
- Timestamp (page name = time of completion)
- Relation → Character

## 2. The loop (check-in automation)

1. Click **Check In** button on a Quest
2. Automation creates a new Log entry (from a template pre-linked to your Character)
3. Log.EXP = that quest's Rewarded EXP
4. Character's rollup auto-updates → level recalculates → progress bar moves → dashboard updates

So: **quest → check-in → log → EXP → level → feedback.** That single loop is the whole game.

## 3. The "More" — full LiFE RPG feature list (roadmap candidates)

- Character stats (STR/INT style attributes)
- HP (miss a quest = lose HP; streaks keep you alive — Solo Leveling "penalty" vibe)
- Badges / achievements
- Goals (long-term quests vs daily quests)
- **Reward market** — earn gold, spend it on real-life rewards (shop)
- NPC quests (quests that appear randomly/from a "system" persona)
- AI-generated quests
- Finance tracking
- Streaks, levels, ranks (E → S rank, the Solo Leveling ranks)

## 4. Design principles worth stealing

- Player is customizable (name, avatar) — the app is a *character sheet*, not a to-do list
- Feedback on every action (EXP pop, bar fill, level-up moment)
- Level curve should be tunable by the player (flat → exponential)
- Separate "Dashboard" (presentation) from "Database" (data) — in an app: UI vs API split, same idea
- Every completed thing becomes permanent history (the Log) — you can see your whole game life
