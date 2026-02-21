const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let level = 1;
let heartsCollected = 0;
let health = 3;
let timer = 30;
let gameOver = false;

let player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  speed: 4
};

let targetX = player.x;
let targetY = player.y;

let hearts = [
  { x: 100, y: 200, r: 15, collected: false },
  { x: 300, y: 400, r: 15, collected: false },
  { x: 200, y: 600, r: 15, collected: false }
];

let enemies = [
  { x: 150, y: 150, r: 20 },
  { x: 350, y: 300, r: 20 },
  { x: 250, y: 500, r: 20 }
];

let obstacles = [];

for (let i = 0; i < 5; i++) {
  obstacles.push({
    x: Math.random() * canvas.width,
    y: -Math.random() * 500,
    size: 40
  });
}

canvas.addEventListener("touchstart", moveTouch);
canvas.addEventListener("touchmove", moveTouch);

function moveTouch(e) {
  const touch = e.touches[0];
  targetX = touch.clientX;
  targetY = touch.clientY;
}

function collide(a, b) {
  let dx = a.x - b.x;
  let dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy) < a.radius + b.r;
}

function update() {

  let dx = targetX - player.x;
  let dy = targetY - player.y;
  let dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > 1) {
    player.x += dx / dist * player.speed;
    player.y += dy / dist * player.speed;
  }

  if (level === 1) {
    hearts.forEach(h => {
      if (!h.collected && collide(player, {x:h.x,y:h.y,r:h.r})) {
        h.collected = true;
        heartsCollected++;
      }
    });

    if (heartsCollected === 3) {
      level = 2;
      player.x = 50;
      player.y = 50;
    }
  }

  if (level === 2) {
    enemies.forEach(e => {
      if (collide(player, e)) {
        health--;
        player.x = 50;
        player.y = 50;
      }
    });

    if (player.x > canvas.width - 50 && player.y > canvas.height - 50) {
      level = 3;
    }

    if (health <= 0) {
      gameOver = true;
    }
  }

  if (level === 3) {
    obstacles.forEach(o => {
      o.y += 4;
      if (o.y > canvas.height) {
        o.y = -50;
      }
      if (player.x < o.x + o.size &&
          player.x + 20 > o.x &&
          player.y < o.y + o.size &&
          player.y + 20 > o.y) {
        gameOver = true;
      }
    });

    timer -= 1/60;
    if (timer <= 0) {
      window.location.href = "https://jaan-special.my.canva.site/";
    }
  }
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if (level === 1) {
    hearts.forEach(h => {
      if (!h.collected) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(h.x, h.y, h.r, 0, Math.PI*2);
        ctx.fill();
      }
    });
  }

  if (level === 2) {
    enemies.forEach(e => {
      ctx.fillStyle = "purple";
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI*2);
      ctx.fill();
    });

    ctx.fillStyle = "white";
    ctx.fillText("Health: " + health, 20, 30);
    ctx.fillText("Reach bottom right corner", 20, 60);
  }

  if (level === 3) {
    obstacles.forEach(o => {
      ctx.fillStyle = "yellow";
      ctx.fillRect(o.x, o.y, o.size, o.size);
    });

    ctx.fillStyle = "white";
    ctx.fillText("Survive: " + Math.ceil(timer), 20, 30);
  }

  ctx.fillStyle = "pink";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI*2);
  ctx.fill();

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over 💔", canvas.width/2 - 120, canvas.height/2);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
