const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  speed: 5
};

let targetX = player.x;
let targetY = player.y;

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

function update() {
  let dx = targetX - player.x;
  let dy = targetY - player.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 1) {
    player.x += dx / distance * player.speed;
    player.y += dy / distance * player.speed;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "pink";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();