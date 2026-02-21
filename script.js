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

let hearts = [];
let heartsCollected = 0;

for (let i = 0; i < 3; i++) {
  hearts.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 15,
    collected: false
  });
}

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

function checkCollision(obj1, obj2) {
  let dx = obj1.x - obj2.x;
  let dy = obj1.y - obj2.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  return distance < obj1.radius + obj2.radius;
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

  // Draw hearts
  hearts.forEach(heart => {
    if (!heart.collected) {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(heart.x, heart.y, heart.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Draw player
  ctx.fillStyle = "pink";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw counter
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Hearts: " + heartsCollected + " / 3", 20, 30);

  if (heartsCollected === 3) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("All love collected 💖", canvas.width / 2 - 120, canvas.height / 2);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
