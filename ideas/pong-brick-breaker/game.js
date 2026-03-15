(function () {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const scoreP1El = document.getElementById('score-p1');
  const scoreP2El = document.getElementById('score-p2');

  const PADDLE_WIDTH = 100;
  const PADDLE_HEIGHT = 12;
  const PADDLE_MARGIN = 24;
  const BALL_RADIUS = 8;
  const BRICK_COLS = 10;
  const BRICK_ROWS = 8;
  const BRICK_PADDING = 4;
  const WIN_SCORE = 3;
  const BASE_BALL_SPEED = 5;
  const MAX_BALL_SPEED = 10;
  const PADDLE_BOOST_FACTOR = 1.06;

  const TRAIL_LENGTH = 28;
  function makeBall() {
    return { x: 0, y: 0, vx: 0, vy: 0, radius: BALL_RADIUS, trail: [] };
  }
  let ball1 = makeBall();
  let ball2 = makeBall();
  let paddle1 = { x: 0, y: 0, w: PADDLE_WIDTH, h: PADDLE_HEIGHT };
  let paddle2 = { x: 0, y: 0, w: PADDLE_WIDTH, h: PADDLE_HEIGHT };
  let bricks = [];
  let scoreP1 = 0;
  let scoreP2 = 0;
  let combo1 = 0;
  let combo2 = 0;
  let state = 'serve'; // 'serve' | 'play' | 'matchover'
  let serveTimer = 1200;
  let winner = null;
  let particles = [];
  let keys = { a: false, d: false, ArrowLeft: false, ArrowRight: false };

  let audioCtx = null;
  function getAudioContext() {
    if (audioCtx) return audioCtx;
    if (typeof window.AudioContext === 'undefined' && typeof window.webkitAudioContext === 'undefined') return null;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function playBrickTwinkle() {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const freq1 = 880;
    const freq2 = 1318;
    const freq3 = 1760;
    const gain = 0.12;
    const decay = 0.08;
    [freq1, freq2, freq3].forEach(function (freq, i) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(gain, now + i * 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + decay);
      osc.start(now + i * 0.03);
      osc.stop(now + i * 0.03 + decay + 0.01);
    });
  }

  function layout() {
    const cw = canvas.width;
    const ch = canvas.height;
    paddle1.y = ch - PADDLE_MARGIN - PADDLE_HEIGHT;
    paddle1.x = (cw - paddle1.w) / 2;
    paddle2.y = PADDLE_MARGIN;
    paddle2.x = (cw - paddle2.w) / 2;
    ball1.x = cw / 2 - 24;
    ball1.y = paddle1.y - PADDLE_MARGIN - BALL_RADIUS * 2;
    ball2.x = cw / 2 + 24;
    ball2.y = paddle2.y + paddle2.h + PADDLE_MARGIN + BALL_RADIUS * 2;
    ball1.trail = [];
    ball2.trail = [];
  }

  function buildBricks() {
    const cw = canvas.width;
    const ch = canvas.height;
    const zoneTop = paddle2.y + paddle2.h + 20;
    const zoneBottom = paddle1.y - 20;
    const zoneH = zoneBottom - zoneTop;
    const zoneCenterY = (zoneTop + zoneBottom) / 2;
    const brickW = (cw - (BRICK_PADDING * (BRICK_COLS + 1))) / BRICK_COLS;
    const brickH = Math.min(20, (zoneH - (BRICK_PADDING * (BRICK_ROWS + 1))) / BRICK_ROWS);
    const totalBrickH = BRICK_ROWS * brickH + (BRICK_ROWS - 1) * BRICK_PADDING;
    const startY = zoneCenterY - totalBrickH / 2;
    bricks = [];
    const colors = ['#e94560', '#0f3460', '#533483', '#00b894'];
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks.push({
          x: BRICK_PADDING + col * (brickW + BRICK_PADDING),
          y: startY + row * (brickH + BRICK_PADDING),
          w: brickW,
          h: brickH,
          color: colors[row % colors.length],
          hit: false
        });
      }
    }
  }

  function spawnParticles(x, y, color, count, options) {
    options = options || {};
    const sizeMin = options.sizeMin ?? (options.size ?? 4);
    const sizeMax = options.sizeMax ?? sizeMin;
    const lifeMin = options.lifeMin ?? 0.4;
    const lifeMax = options.lifeMax ?? 0.7;
    const speedMin = options.speedMin ?? 2;
    const speedMax = options.speedMax ?? 5;
    for (let i = 0; i < count; i++) {
      const a = Math.PI * 2 * Math.random();
      const v = speedMin + Math.random() * (speedMax - speedMin);
      particles.push({
        x, y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        life: lifeMin + Math.random() * (lifeMax - lifeMin),
        color: color || '#fff',
        size: sizeMin + Math.random() * (sizeMax - sizeMin)
      });
    }
  }

  function startRound() {
    state = 'serve';
    serveTimer = 1200;
    combo1 = 0;
    combo2 = 0;
    layout();
    buildBricks();
    ball1.vx = 0;
    ball1.vy = 0;
    ball2.vx = 0;
    ball2.vy = 0;
  }

  function setBallSpeed(ball, vx, vy, speed) {
    const len = Math.hypot(vx, vy) || 1;
    ball.vx = (vx / len) * speed;
    ball.vy = (vy / len) * speed;
  }

  function serveBalls() {
    setBallSpeed(ball1, (Math.random() - 0.5) * 4, -3 - Math.random() * 2, BASE_BALL_SPEED);
    setBallSpeed(ball2, (Math.random() - 0.5) * 4, 3 + Math.random() * 2, BASE_BALL_SPEED);
    state = 'play';
  }

  function respawnBall1() {
    const cw = canvas.width;
    ball1.x = cw / 2 + (Math.random() - 0.5) * 80;
    ball1.y = paddle1.y - PADDLE_MARGIN - BALL_RADIUS * 2;
    ball1.trail = [];
    combo1 = 0;
    setBallSpeed(ball1, (Math.random() - 0.5) * 4, -3 - Math.random() * 2, BASE_BALL_SPEED);
  }

  function respawnBall2() {
    const cw = canvas.width;
    ball2.x = cw / 2 + (Math.random() - 0.5) * 80;
    ball2.y = paddle2.y + paddle2.h + PADDLE_MARGIN + BALL_RADIUS * 2;
    ball2.trail = [];
    combo2 = 0;
    setBallSpeed(ball2, (Math.random() - 0.5) * 4, 3 + Math.random() * 2, BASE_BALL_SPEED);
  }

  function goal(scorer, ballX, ballY) {
    if (scorer === 1) scoreP1++;
    else scoreP2++;
    spawnParticles(ballX, ballY, '#ffd93d', 16);
    if (scoreP1 >= WIN_SCORE || scoreP2 >= WIN_SCORE) {
      winner = scoreP1 >= WIN_SCORE ? 1 : 2;
      state = 'matchover';
      return;
    }
    startRound();
  }

  function clampPaddle(p) {
    p.x = Math.max(0, Math.min(canvas.width - p.w, p.x));
  }

  function update(dt) {
    const cw = canvas.width;
    const ch = canvas.height;

    if (state === 'matchover') {
      if (particles.length === 0) return;
    }

    if (state === 'serve') {
      serveTimer -= dt;
      paddle1.x += (keys.d ? 8 : 0) - (keys.a ? 8 : 0);
      paddle2.x += (keys.ArrowRight ? 8 : 0) - (keys.ArrowLeft ? 8 : 0);
      clampPaddle(paddle1);
      clampPaddle(paddle2);
      if (serveTimer <= 0) serveBalls();
    }

    if (state === 'play') {
      paddle1.x += (keys.d ? 8 : 0) - (keys.a ? 8 : 0);
      paddle2.x += (keys.ArrowRight ? 8 : 0) - (keys.ArrowLeft ? 8 : 0);
      clampPaddle(paddle1);
      clampPaddle(paddle2);

      for (const ball of [ball1, ball2]) {
        ball.trail.push({ x: ball.x, y: ball.y });
        if (ball.trail.length > TRAIL_LENGTH) ball.trail.shift();
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= cw) {
          ball.vx *= -1;
          ball.x = Math.max(ball.radius, Math.min(cw - ball.radius, ball.x));
        }

        if (ball.y - ball.radius <= paddle2.y + paddle2.h && ball.vy < 0) {
          if (ball.x >= paddle2.x && ball.x <= paddle2.x + paddle2.w) {
            ball.vy *= -1;
            ball.y = paddle2.y + paddle2.h + ball.radius;
            const hit = (ball.x - (paddle2.x + paddle2.w / 2)) / (paddle2.w / 2);
            ball.vx += hit * 1.5;
            if (ball === ball2) {
              combo2 = Math.min(10, combo2 + 1);
              const len = Math.hypot(ball.vx, ball.vy);
              const newLen = Math.min(MAX_BALL_SPEED, len * PADDLE_BOOST_FACTOR);
              if (len > 0) { ball.vx = (ball.vx / len) * newLen; ball.vy = (ball.vy / len) * newLen; }
            }
          }
        }
        if (ball.y + ball.radius >= paddle1.y && ball.vy > 0) {
          if (ball.x >= paddle1.x && ball.x <= paddle1.x + paddle1.w) {
            ball.vy *= -1;
            ball.y = paddle1.y - ball.radius;
            const hit = (ball.x - (paddle1.x + paddle1.w / 2)) / (paddle1.w / 2);
            ball.vx += hit * 1.5;
            if (ball === ball1) {
              combo1 = Math.min(10, combo1 + 1);
              const len = Math.hypot(ball.vx, ball.vy);
              const newLen = Math.min(MAX_BALL_SPEED, len * PADDLE_BOOST_FACTOR);
              if (len > 0) { ball.vx = (ball.vx / len) * newLen; ball.vy = (ball.vy / len) * newLen; }
            }
          }
        }

        for (const b of bricks) {
          if (b.hit) continue;
          if (ball.x + ball.radius >= b.x && ball.x - ball.radius <= b.x + b.w &&
              ball.y + ball.radius >= b.y && ball.y - ball.radius <= b.y + b.h) {
            b.hit = true;
            playBrickTwinkle();
            var bx = b.x + b.w / 2;
            var by = b.y + b.h / 2;
            spawnParticles(bx, by, b.color, 14, {
              sizeMin: 3,
              sizeMax: 7,
              lifeMin: 0.5,
              lifeMax: 0.9,
              speedMin: 2,
              speedMax: 6
            });
            spawnParticles(bx, by, '#fff', 4, {
              sizeMin: 2,
              sizeMax: 3,
              lifeMin: 0.3,
              lifeMax: 0.5,
              speedMin: 3,
              speedMax: 7
            });
            if (ball.x < b.x || ball.x > b.x + b.w) ball.vx *= -1;
            else ball.vy *= -1;
            break;
          }
        }
      }

      if (ball1.y - ball1.radius <= 0) {
        goal(1, ball1.x, ball1.y);
        return;
      }
      if (ball1.y + ball1.radius >= ch) {
        respawnBall1();
      }
      if (ball2.y + ball2.radius >= ch) {
        goal(2, ball2.x, ball2.y);
        return;
      }
      if (ball2.y - ball2.radius <= 0) {
        respawnBall2();
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= dt / 1000;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function draw() {
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, paddle2.y + paddle2.h);
    ctx.fillRect(0, paddle1.y, canvas.width, canvas.height - paddle1.y);

    ctx.fillStyle = '#e94560';
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.w, paddle1.h);
    ctx.fillStyle = '#0f3460';
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.w, paddle2.h);

    for (const b of bricks) {
      if (b.hit) continue;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }

    function drawBallTrail(ball, color) {
      var n = ball.trail.length;
      for (var i = 0; i < n; i++) {
        var t = ball.trail[i];
        var alpha = (i + 1) / (n + 1);
        var r = ball.radius * (0.3 + 0.7 * alpha);
        ctx.globalAlpha = alpha * alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    drawBallTrail(ball1, '#e94560');
    drawBallTrail(ball2, '#4a9eff');
    ctx.fillStyle = '#e94560';
    ctx.beginPath();
    ctx.arc(ball1.x, ball1.y, ball1.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4a9eff';
    ctx.beginPath();
    ctx.arc(ball2.x, ball2.y, ball2.radius, 0, Math.PI * 2);
    ctx.fill();

    for (const p of particles) {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      const s = p.size ?? 4;
      ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;

    scoreP1El.textContent = scoreP1;
    scoreP2El.textContent = scoreP2;

    function comboStyle(combo) {
      var colors = ['#666', '#5cdb95', '#7bed9f', '#ffeaa7', '#fdcb6e', '#fab1a0', '#ff7675', '#e17055', '#d63031', '#e84393', '#ffd93d'];
      var size = 14 + combo * 5;
      return { color: colors[Math.min(combo, 10)], size: size };
    }
    function drawCombo(combo, x, y) {
      if (combo <= 0) return;
      var s = comboStyle(combo);
      ctx.fillStyle = s.color;
      ctx.font = 'bold ' + s.size + 'px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('+' + (combo * 100) + ' speed', x, y);
    }
    drawCombo(combo1, canvas.width / 2, paddle1.y - 28);
    drawCombo(combo2, canvas.width / 2, paddle2.y + paddle2.h + 28);

    if (state === 'serve') {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '20px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Get ready...', canvas.width / 2, canvas.height / 2);
    }

    if (state === 'matchover') {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffd93d';
      ctx.font = '28px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Player ' + winner + ' wins!', canvas.width / 2, canvas.height / 2 - 10);
      ctx.fillStyle = '#ccc';
      ctx.font = '16px system-ui';
      ctx.fillText('Press SPACE to play again', canvas.width / 2, canvas.height / 2 + 20);
    }
  }

  document.addEventListener('keydown', function (e) {
    var ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') ctx.resume();
    if (e.key === 'a') keys.a = true;
    if (e.key === 'd') keys.d = true;
    if (e.key === 'ArrowLeft') { keys.ArrowLeft = true; e.preventDefault(); }
    if (e.key === 'ArrowRight') { keys.ArrowRight = true; e.preventDefault(); }
    if (e.key === ' ' && state === 'matchover') {
      e.preventDefault();
      scoreP1 = 0;
      scoreP2 = 0;
      winner = null;
      startRound();
    }
  });
  document.addEventListener('keyup', function (e) {
    if (e.key === 'a') keys.a = false;
    if (e.key === 'd') keys.d = false;
    if (e.key === 'ArrowLeft') keys.ArrowLeft = false;
    if (e.key === 'ArrowRight') keys.ArrowRight = false;
  });

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(now - last, 50);
    last = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  startRound();
  requestAnimationFrame(loop);
})();
