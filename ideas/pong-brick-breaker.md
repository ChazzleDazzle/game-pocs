# Pong brick breaker

Top-down competitive brick breaker: two sides (Pong-style), bricks in the playfield, colorful particles, and an exciting soundtrack. First to get the ball past the other player's goal line scores the round.

## One-line pitch

Top-down Pong meets brick breaker: break bricks, defend your goal, and score by getting the ball past the other player's line. 2P or vs CPU, with colorful particle effects and an exciting soundtrack.

## Core loop

- **Serve/launch** the balls; they bounce off paddles and bricks.
- **Break bricks** in the playfield (power-ups optional for later scope).
- **Defend** your goal line with your paddle; **attack** by sending your ball toward the opponent's goal line.
- **Score:** first to get your ball past the other side's goal line wins the round; first to N points (e.g. 3 or 5) wins the match.
- **Juice:** particle bursts on brick hits and on goal; soundtrack drives the pace.

**Two balls (one per player):** each player has their own ball. Your ball starts on your side. Get your ball past the opponent's goal to score. If your ball goes past your own goal, it respawns on your side (no point to opponent). **Speed boost:** hitting your own ball with your paddle increases its speed slightly each time (capped); letting it past your goal resets the speed. **Combo:** consecutive own-paddle hits are shown as a combo (+100 per hit, max +1000) near your paddle, with size and color scaling by level.

## Platform / monetization

- **Platform:** Web (POC); TBD for ship (mobile / Steam possible).
- **Monetization:** TBD (premium, IAP cosmetics/soundtrack, or ad-supported).

## Scope

- **POC (current):** One arena (480×720), two balls (one per player), bricks centered in the middle, two paddles, goal lines. Each ball starts on its owner's side; own-goal respawns the ball and resets its speed. Speed boost on own-paddle hit (+6% per hit, cap 2×); combo display near each paddle (+100 per hit, max +1000, size/color by level). Particle bursts on brick break and on goal; comet-style trails on balls; Web Audio twinkle on brick break. First to 3 wins. 2P local only.
- **MVP:** Polish particles and soundtrack, vs CPU, simple menus and win screen.
- **Full:** Extra arenas, power-ups, multiple tracks, optional online or more modes.

## Risks / open questions

- **Brick layout:** POC uses bricks centered in the middle; each half having its own bricks is an alternative for level design.
- **Art/audio:** Lock particle style (chunky, neon, etc.) and genre of "exciting" soundtrack (synth, rock, EDM) for consistency. POC uses Web Audio for brick-break twinkle (no assets).
- **Shared assets:** Use `assets/` for shared art, audio, and fonts when adding music or art.

## References

Classic Pong (goal-line scoring, paddle defense); brick breaker / Arkanoid (bricks, bounces). See [assets/](../assets/) for shared assets when building the POC.
