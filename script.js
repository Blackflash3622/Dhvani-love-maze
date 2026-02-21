const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameState = "level1";
let heartsCollected = 0;

let player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 25,
  speed: 4
};

let targetX = player.x;
let targetY = player.y;

let hearts = [
  { x: 120, y: 200, r: 18, collected: false },
  { x: 300, y: 400, r: 18, collected: false },
  { x: 220, y: 600, r: 18, collected: false }
];

canvas.addEventListener("touchstart", moveTouch);
canvas.addEventListener("touchmove", moveTouch);

function moveTouch(e) {
  const touch = e.touches[0];
  targetX = touch.clientX;
  targetY = touch.clientY;
}

function checkCollision(a, b) {
  let dx = a.x - b.x;
  let dy = a.y - b.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  return dist < a.radius + b.r;
}

function updateLevel1() {

  let dx = targetX - player.x;
  let dy = targetY - player.y;
  let dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > 1) {
    player.x += dx / dist * player.speed;
    player.y += dy / dist * player.speed;
  }

  hearts.forEach(h => {
    if (!h.collected && checkCollision(player, h)) {
      h.collected = true;
      heartsCollected++;
    }
  });

  if (heartsCollected === 3) {
    setTimeout(() => {
      gameState = "level2";
    }, 1500);
  }
}

function drawLevel1() {

  // Garden Background
  ctx.fillStyle = "#2e8b57";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Flowers
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = "pink";
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 4, 4);
  }

  // Hearts
  hearts.forEach(h => {
    if (!h.collected) {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // King Player
  ctx.font = "35px Arial";
  ctx.fillText("🫅🏼", player.x - 15, player.y + 10);

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Collect 3 Hearts for Your Queen 👰🏼", 20, 40);
  ctx.fillText("Hearts: " + heartsCollected + "/3", 20, 70);

  if (heartsCollected === 3) {
    ctx.font = "30px Arial";
    ctx.fillText("Love Collected 💖", canvas.width / 2 - 120, canvas.height / 2);
  }
}

function drawLevel2() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Level 2 Coming Soon... 🧩", canvas.width/2 - 160, canvas.height/2);
}

function gameLoop() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState === "level1") {
    updateLevel1();
    drawLevel1();
  }

  if (gameState === "level2") {
    drawLevel2();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
