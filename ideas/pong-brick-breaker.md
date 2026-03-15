# Pong brick breaker

Top-down competitive brick breaker: two sides (Pong-style), bricks in the playfield, colorful particles, and an exciting soundtrack. First to get the ball past the other player's goal line scores the round.

## One-line pitch

Top-down Pong meets brick breaker: break bricks, defend your goal, and score by getting the ball past the other player's line. 2P or vs CPU, with colorful particle effects and an exciting soundtrack.

## Core loop

- **Serve/launch** the ball; it bounces off paddles and bricks.
- **Break bricks** in the playfield (power-ups and multi-ball optional for later scope).
- **Defend** your goal line with your paddle; **attack** by sending the ball toward the opponent's goal line.
- **Score:** first to get the ball past the other side's goal line wins the round; first to N points (e.g. 3 or 5) wins the match.
- **Juice:** particle bursts on brick hits and on goal; soundtrack drives the pace.

One **shared ball** (classic Pong): both players hit the same ball; whoever gets it past the opponent's goal scores. Alternative: one ball per side (two balls in play)—doc assumes shared ball for POC simplicity.

## Platform / monetization

- **Platform:** TBD (web good for 2P local; mobile / Steam possible).
- **Monetization:** TBD (premium, IAP cosmetics/soundtrack, or ad-supported).

## Scope

- **POC:** One arena, one shared ball, basic bricks, two paddles, goal lines, round scoring (first past goal wins round). Minimal particles and one track or placeholder music. 2P local (vs CPU optional for POC).
- **MVP:** Polish particles and soundtrack, vs CPU if not in POC, round/match rules (e.g. first to 3), simple menus and win screen.
- **Full:** Extra arenas, power-ups, multiple tracks, optional online or more modes.

## Risks / open questions

- **Ball ownership:** This doc recommends one shared ball for POC; one ball per side is a valid variant and would need ownership and scoring rules clarified.
- **Brick layout:** Shared middle vs each half has its own bricks—affects level design and readability.
- **Art/audio:** Lock particle style (chunky, neon, etc.) and genre of "exciting" soundtrack (synth, rock, EDM) for consistency.
- **Shared assets:** Use `assets/` for shared art, audio, and fonts when starting the POC.

## References

Classic Pong (goal-line scoring, paddle defense); brick breaker / Arkanoid (bricks, bounces). See [assets/](../assets/) for shared assets when building the POC.
