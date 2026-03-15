# Pong Brick Breaker — POC

Playable proof-of-concept for the [pong-brick-breaker](../pong-brick-breaker.md) design doc idea.

## Run

Open `index.html` in a browser (no build step). Or serve the folder with any static server, e.g.:

```bash
cd ideas/pong-brick-breaker
python3 -m http.server 8080
# then open http://localhost:8080
```

## Controls

- **P1 (bottom paddle):** A / D — red ball
- **P2 (top paddle):** Left / Right arrow keys — blue ball
- **After match:** SPACE to play again

First to 3 points wins. Get **your** ball past the other player's goal line to score. If your ball goes past your own goal, it respawns on your side (speed resets).

## POC features

- **Two balls:** One per player; each starts on their side. Bricks are centered in the arena.
- **Speed boost:** Hitting your own ball with your paddle makes it slightly faster each time (capped at 2×). Letting it past your goal resets speed.
- **Combo:** Consecutive own-paddle hits show as +100, +200, … +1000 (max 10 hits). Displayed on the canvas near your paddle; font size and color scale with level (green → yellow → orange → red → gold).
- **Comet tails:** Both balls leave a fading trail.
- **Particles:** Bursts on brick break and on goal.
- **Sound:** Web Audio twinkle when a brick breaks (no asset files).

Canvas size 480×720.

## Tech

Vanilla HTML5 canvas and JavaScript. Shared assets in [assets/](../../assets/) when you add music or art.
