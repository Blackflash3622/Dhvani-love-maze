const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameState = "level1";
let heartsCollected = 0;

// Player (King)
let player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 25,
  speed: 3
};

// Hearts
let hearts = [
  { x: 120, y: 200, r: 18, collected: false },
  { x: 300, y: 450, r: 18, collected: false },
  { x: 220, y: 650, r: 18, collected: false }
];

// 🎮 JOYSTICK
let joystick = {
  active: false,
  startX: 0,
  startY: 0,
  dx: 0,
  dy: 0,
  radius: 40
};

canvas.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  joystick.active = true;
  joystick.startX = t.clientX;
  joystick.startY = t.clientY;
});

canvas.addEventListener("touchmove", (e) => {
  if (!joystick.active) return;
  const t = e.touches[0];
  joystick.dx = t.clientX - joystick.startX;
  joystick.dy = t.clientY - joystick.startY;
});

canvas.addEventListener("touchend", () => {
  joystick.active = false;
  joystick.dx = 0;
  joystick.dy = 0;
});

function checkCollision(a, b) {
  let dx = a.x - b.x;
  let dy = a.y - b.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  return dist < a.radius + b.r;
}

function updateLevel1() {

  if (joystick.active) {
    player.x += joystick.dx * 0.05;
    player.y += joystick.dy * 0.05;
  }

  // Screen bounds
  player.x = Math.max(20, Math.min(canvas.width - 20, player.x));
  player.y = Math.max(20, Math.min(canvas.height - 20, player.y));

  hearts.forEach(h => {
    if (!h.collected && checkCollision(player, h)) {
      h.collected = true;
      heartsCollected++;
    }
  });

  if (heartsCollected === 3) {
    setTimeout(() => {
      gameState = "win";
    }, 1500);
  }
}

function drawGardenBackground() {

  // Sky gradient
  let sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, "#87CEEB");
  sky.addColorStop(1, "#2e8b57");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grass
  ctx.fillStyle = "#228B22";
  ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);

  // Flowers
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = "pink";
    ctx.beginPath();
    ctx.arc(Math.random() * canvas.width, canvas.height * 0.6 + Math.random() * 200, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawJoystick() {
  if (!joystick.active) return;

  ctx.beginPath();
  ctx.arc(joystick.startX, joystick.startY, joystick.radius, 0, Math.PI * 2);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(
    joystick.startX + joystick.dx * 0.3,
    joystick.startY + joystick.dy * 0.3,
    20,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = "white";
  ctx.fill();
}

function drawLevel1() {

  drawGardenBackground();

  // Hearts
  hearts.forEach(h => {
    if (!h.collected) {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // King
  ctx.font = "35px Arial";
  ctx.fillText("🫅🏼", player.x - 15, player.y + 10);

  ctx.fillStyle = "white";
  ctx.font = "22px Arial";
  ctx.fillText("Queen give me 3 hearts ❤️ so I can reach you 👰🏻‍♀️", 20, 40);
  ctx.fillText("Hearts: " + heartsCollected + "/3", 20, 75);

  if (heartsCollected === 3) {
    ctx.font = "30px Arial";
    ctx.fillText("I am coming my Queen 💖", canvas.width / 2 - 150, canvas.height / 2);
  }

  drawJoystick();
}

function drawWinScreen() {
  ctx.fillStyle = "pink";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "40px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Together Forever 💍💖", canvas.width/2 - 200, canvas.height/2);
}

function gameLoop() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState === "level1") {
    updateLevel1();
    drawLevel1();
  }

  if (gameState === "win") {
    drawWinScreen();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
