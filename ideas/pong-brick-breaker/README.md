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

- **P1 (bottom paddle):** A / D
- **P2 (top paddle):** Left / Right arrow keys
- **After match:** SPACE to play again

First to 3 points wins. Get the ball past the other player's goal line to score. Bricks in the middle can be broken; particle bursts on brick hits and on goals.

## Tech

Vanilla HTML5 canvas and JavaScript. Shared assets live in repo [assets/](../../assets/) when you add music or art.
