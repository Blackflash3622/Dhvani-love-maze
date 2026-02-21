const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameState = "level1";

const bgImage = new Image();
bgImage.src = "levelonebg.jpg";

let fenceCount = 6;
let fencePositions = [];

let imageDrawData = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
};

function setupFences() {
  fencePositions = [];
  let spacing = imageDrawData.width / (fenceCount + 1);

  for (let i = 0; i < fenceCount; i++) {
    fencePositions.push({
      x: imageDrawData.x + spacing * (i + 1),
      reward: null,
      collected: false
    });
  }

  fencePositions[1].reward = "❤️";
  fencePositions[2].reward = "❤️";
  fencePositions[3].reward = "❤️";
  fencePositions[4].reward = "💍";
  fencePositions[5].reward = "😘";
}

let playerIndex = 0;
let playerY = 0;

let jumping = false;
let jumpStartX = 0;
let jumpEndX = 0;
let jumpProgress = 0;

let popupMessage = "";
let popupTimer = 0;

canvas.addEventListener("touchstart", (e) => {
  let t = e.touches[0];

  if (t.clientX > canvas.width - 130 && t.clientY > canvas.height - 130) {
    startJump();
  }
});

function startJump() {
  if (jumping) return;
  if (playerIndex >= fenceCount - 1) return;

  jumping = true;
  jumpStartX = fencePositions[playerIndex].x;
  playerIndex++;
  jumpEndX = fencePositions[playerIndex].x;
  jumpProgress = 0;
}

function updateJump() {
  if (!jumping) return;

  jumpProgress += 0.04;

  if (jumpProgress >= 1) {
    jumping = false;
    playerY = getFenceY();
    handleReward();
  }
}

function handleReward() {
  let fence = fencePositions[playerIndex];

  if (fence.reward && !fence.collected) {
    fence.collected = true;

    if (fence.reward === "💍") {
      popupMessage = "Thank you, my Queen, for guiding me to our ring 💍";
      popupTimer = 120;
    }

    if (fence.reward === "😘") {
      popupMessage = "Muuuaaahhh 💋";
      popupTimer = 120;
    }
  }

  if (playerIndex === fenceCount - 1) {
    gameState = "win";
  }
}

function getFenceY() {
  return imageDrawData.y + imageDrawData.height * 0.60;
}

function drawBackground() {
  let ratio = Math.min(
    canvas.width / bgImage.width,
    canvas.height / bgImage.height
  );

  let newWidth = bgImage.width * ratio;
  let newHeight = bgImage.height * ratio;

  let x = (canvas.width - newWidth) / 2;
  let y = (canvas.height - newHeight) / 2;

  imageDrawData = { x, y, width: newWidth, height: newHeight };

  ctx.drawImage(bgImage, x, y, newWidth, newHeight);
}

function drawRewards() {
  let time = Date.now() * 0.005;
  ctx.font = "35px Arial";

  fencePositions.forEach((f, i) => {
    if (f.reward && !f.collected) {
      let pulse = Math.sin(time + i) * 5;
      ctx.fillText(f.reward, f.x - 15, getFenceY() - 40 + pulse);
    }
  });
}

function drawPlayer() {
  ctx.font = "40px Arial";

  let x = fencePositions[playerIndex].x;
  let y = getFenceY();

  if (jumping) {
    let t = jumpProgress;
    x = jumpStartX + (jumpEndX - jumpStartX) * t;

    // Arc jump (Ulta U)
    let height = 120;
    y = getFenceY() - Math.sin(t * Math.PI) * height;
  }

  ctx.fillText("🫅🏼", x - 18, y);
}

function drawJumpButton() {
  ctx.fillStyle = "#ff69b4";
  ctx.beginPath();
  ctx.arc(canvas.width - 80, canvas.height - 80, 50, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("🦘", canvas.width - 95, canvas.height - 65);
}

function drawPopup() {
  if (popupTimer > 0) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, 100);

    ctx.fillStyle = "white";
    ctx.font = "22px Arial";
    ctx.fillText(popupMessage, 20, 60);

    popupTimer--;
  }
}

function drawWin() {
  ctx.fillStyle = "pink";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.fillText("You reached your Queen 👰🏻‍♀️💖", canvas.width/2 - 220, canvas.height/2);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!bgImage.complete) {
    requestAnimationFrame(gameLoop);
    return;
  }

  if (gameState === "level1") {
    drawBackground();
    setupFences();
    updateJump();
    drawRewards();
    drawPlayer();
    drawJumpButton();
    drawPopup();
  }

  if (gameState === "win") {
    drawWin();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
