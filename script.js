const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  speed: 4
};

let targetX = player.x;
let targetY = player.y;

let heartsCollected = 0;

let hearts = [
  { x: 100, y: 150, radius: 15, collected: false },
  { x: 300, y: 300, radius: 15, collected: false },
  { x: 200, y: 500, radius: 15, collected: false }
];

canvas.addEventListener("touchstart", function(e) {
  const touch = e.touches[0];
  targetX = touch.clientX;
  targetY = touch.clientY;
});

canvas.addEventListener("touchmove", function(e) {
  const touch = e.touches[0];
  targetX = touch.clientX;
  targetY = touch.clientY;
});

function checkCollision(a, b) {
  let dx = a.x - b.x;
  let dy = a.y - b.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  return distance < a.radius + b.radius;
}

function update() {
  let dx = targetX - player.x;
  let dy = targetY - player.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 1) {
    player.x += dx / distance * player.speed;
    player.y += dy / distance * player.speed;
  }

  hearts.forEach(heart => {
    if (!heart.collected && checkCollision(player, heart)) {
      heart.collected = true;
      heartsCollected++;
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Hearts
  hearts.forEach(heart => {
    if (!heart.collected) {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(heart.x, heart.y, heart.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Draw Player
  ctx.fillStyle = "pink";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw Counter
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Hearts: " + heartsCollected + " / 3", 20, 30);

  if (heartsCollected === 3) {
    ctx.font = "30px Arial";
    ctx.fillText("All Love Collected 💖", canvas.width / 2 - 140, canvas.height / 2);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
