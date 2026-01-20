# Retro Arcade

This is a browser-based retro arcade I built as a portfolio project.

Right now, the arcade acts as a central hub where you can select and play original mini-games I’ve built from scratch. The focus at this stage is on the games themselves rather than a fully explorable environment.

**Live demo:** https://retro-arcade-kappa.vercel.app/

---

## About the arcade space

The arcade is intentionally static for now.

At this stage, it functions as a **hub** rather than a walkable world. That was a deliberate choice while I focused on designing, building, and polishing the individual games first.

The long-term idea is to expand the arcade into multiple rooms with different machines and themes, but for now the goal is simplicity and clarity: pick a cabinet, play a game, and move on without friction.

This lets the games stand on their own instead of hiding behind extra systems too early.

---

## Why I built this

I wanted a portfolio project that:

- wasn’t another CRUD app or dashboard
- let me work with interaction, animation, sound, and game-style logic
- pushed me outside typical frontend patterns
- and actually felt fun to use

The arcade format gave me a way to group multiple ideas together while still keeping each game self-contained.

---

## The games

### Bug Squash

A small, fast reflex game.

Bug Squash is intentionally simple:

- short play sessions
- immediate input → feedback
- very little setup or explanation

The focus here was restraint. I wanted the core loop to feel good without adding unnecessary mechanics or systems.

---

### Pixel Invaders

A more involved arcade shooter inspired by classic space-invader-style games.

This one includes:

- a real-time game loop using `<canvas>`
- enemies, bullets, collisions, and power-ups
- wave-based difficulty
- internal dev/debug tools I used while building and testing

Pixel Invaders is where I pushed myself the most technically and worked through the messier parts of game logic inside a React app.

---

## How it’s structured

- The **arcade** handles navigation, transitions, audio, and mounting/unmounting games.
- Each **game is isolated** so it doesn’t interfere with the others.
- React is used for UI, layout, and flow.
- Canvas is used where real-time rendering makes more sense.
- Shared arcade state and per-game state are kept separate on purpose.

I prioritised clarity and separation over clever abstractions.

---

## Tech used

- React
- TypeScript
- Create React App
- Framer Motion (animations)
- Zustand (state)
- Howler.js (audio)
- Canvas API
- Deployed on Vercel

---

## Running locally

```bash
git clone https://github.com/Azlyum/retro-arcade.git
cd retro-arcade
npm install
npm start
```
