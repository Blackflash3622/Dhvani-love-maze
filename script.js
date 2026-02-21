const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameState = "level1";

// Background image
const bgImage = new Image();
bgImage.src = "levelonebg.jpg";

// Fence positions (6 dande)
let fencePositions = [];
let fenceCount = 6;
let fenceY = canvas.height * 0.55;

for (let i = 0; i < fenceCount; i++) {
  fencePositions.push({
    x: canvas.width * 0.15 + i * (canvas.width * 0.12),
    reward: null,
    collected: false
  });
}

// Rewards
fencePositions[1].reward = "❤️";
fencePositions[2].reward = "❤️";
fencePositions[3].reward = "❤️";
fencePositions[4].reward = "💍";
fencePositions[5].reward = "😘";

// Player
let playerIndex = 0;

// Jump button
let jumpBtn = {
  x: canvas.width - 120,
  y: canvas.height - 120,
  size: 80
};

canvas.addEventListener("touchstart", (e) => {
  const t = e.touches[0];

  if (
    t.clientX > jumpBtn.x &&
    t.clientX < jumpBtn.x + jumpBtn.size &&
    t.clientY > jumpBtn.y &&
    t.clientY < jumpBtn.y + jumpBtn.size
  ) {
    jumpForward();
  }
});

function jumpForward() {
  if (playerIndex < fenceCount - 1) {
    playerIndex++;

    let currentFence = fencePositions[playerIndex];
    if (currentFence.reward && !currentFence.collected) {
      currentFence.collected = true;
    }
  } else {
    gameState = "win";
  }
}

function drawBackground() {
  if (bgImage.complete) {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  }
}

function drawRewards() {
  ctx.font = "35px Arial";

  fencePositions.forEach((f, index) => {
    if (f.reward && !f.collected) {
      ctx.fillText(f.reward, f.x - 15, fenceY - 40);
    }
  });
}

function drawPlayer() {
  ctx.font = "40px Arial";
  let x = fencePositions[playerIndex].x;
  ctx.fillText("🫅🏼", x - 18, fenceY);
}

function drawJumpButton() {
  ctx.fillStyle = "#ff69b4";
  ctx.fillRect(jumpBtn.x, jumpBtn.y, jumpBtn.size, jumpBtn.size);

  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("🦘", jumpBtn.x + 20, jumpBtn.y + 50);
}

function drawLevel1() {
  drawBackground();
  drawRewards();
  drawPlayer();
  drawJumpButton();

  ctx.fillStyle = "white";
  ctx.font = "22px Arial";
  ctx.fillText("Jump to collect love & reach your Queen 👰🏻‍♀️", 20, 40);
}

function drawWin() {
  ctx.fillStyle = "pink";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "40px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("You reached your Queen 👰🏻‍♀️💖", canvas.width/2 - 220, canvas.height/2);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState === "level1") {
    drawLevel1();
  }

  if (gameState === "win") {
    drawWin();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
