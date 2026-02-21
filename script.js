const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameState = "level1";

const bgImage = new Image();
bgImage.src = "levelonebg.jpg";

const kingImg = new Image();
kingImg.src = "king.png";

const queenImg = new Image();
queenImg.src = "queen.png";

let fenceCount = 6;
let fencePositions = [];

let imageDrawData = { x:0,y:0,width:0,height:0 };

let collectedHearts = 0;

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

  fencePositions[1].reward = "heart";
  fencePositions[2].reward = "heart";
  fencePositions[3].reward = "heart";
  fencePositions[4].reward = "ring";
  fencePositions[5].reward = "kiss";
}

let playerIndex = 0;
let jumping = false;
let jumpStartX = 0;
let jumpEndX = 0;
let jumpProgress = 0;

let popupMessage = "";
let popupTimer = 0;

canvas.addEventListener("touchstart", (e)=>{
  let t = e.touches[0];
  if(t.clientX > canvas.width-130 && t.clientY > canvas.height-130){
    startJump();
  }
});

function startJump(){
  if(jumping) return;
  if(playerIndex >= fenceCount-1) return;

  jumping = true;
  jumpStartX = fencePositions[playerIndex].x;
  playerIndex++;
  jumpEndX = fencePositions[playerIndex].x;
  jumpProgress = 0;
}

function updateJump(){
  if(!jumping) return;

  jumpProgress += 0.04;

  if(jumpProgress >= 1){
    jumping = false;
    handleReward();
  }
}

function handleReward(){
  let fence = fencePositions[playerIndex];

  if(fence.reward && !fence.collected){

    fence.collected = true;

    if(fence.reward === "heart"){
      collectedHearts++;
    }

    if(fence.reward === "ring"){
      popupMessage = "Thank you, my Queen, for guiding me to our ring 💍";
      popupTimer = 150;
    }

    if(fence.reward === "kiss"){
      popupMessage = "Muuuaaahhh 💋";
      popupTimer = 150;
    }
  }

  if(playerIndex === fenceCount-1){
    gameState = "win";
  }
}

function getFenceY(){
  return imageDrawData.y + imageDrawData.height*0.60;
}

function drawBackground(){
  let ratio = Math.min(
    canvas.width/bgImage.width,
    canvas.height/bgImage.height
  );

  let newWidth = bgImage.width*ratio;
  let newHeight = bgImage.height*ratio;

  let x = (canvas.width-newWidth)/2;
  let y = (canvas.height-newHeight)/2;

  imageDrawData = {x,y,width:newWidth,height:newHeight};

  ctx.drawImage(bgImage,x,y,newWidth,newHeight);
}

function drawRewards(){
  let time = Date.now()*0.005;

  fencePositions.forEach((f,i)=>{
    if(f.reward && !f.collected){

      let y = getFenceY()-40 + Math.sin(time+i)*5;

      if(f.reward==="heart"){
        ctx.font="30px Arial";
        ctx.fillText("❤️",f.x-15,y);
      }

      if(f.reward==="ring"){
        ctx.font="30px Arial";
        ctx.fillText("💍",f.x-15,y);
      }

      if(f.reward==="kiss"){
        ctx.font="30px Arial";
        ctx.fillText("😘",f.x-15,y);
      }
    }
  });
}

function drawTopHearts(){
  for(let i=0;i<3;i++){
    ctx.font="30px Arial";
    if(i<collectedHearts){
      ctx.fillText("❤️",20+i*35,40);
    }else{
      ctx.fillText("🤍",20+i*35,40);
    }
  }
}

function drawPlayer(){
  let x = fencePositions[playerIndex].x;
  let y = getFenceY();

  if(jumping){
    let t = jumpProgress;
    x = jumpStartX + (jumpEndX-jumpStartX)*t;
    y = getFenceY() - Math.sin(t*Math.PI)*120;
  }

  ctx.drawImage(kingImg,x-30,y-60,60,60);
}

function drawQueen(){
  let last = fencePositions[fenceCount-1].x;
  ctx.drawImage(queenImg,last-30,getFenceY()-60,60,60);
}

function drawJumpButton(){
  ctx.fillStyle="#ff69b4";
  ctx.beginPath();
  ctx.arc(canvas.width-80,canvas.height-80,50,0,Math.PI*2);
  ctx.fill();

  ctx.font="30px Arial";
  ctx.fillStyle="white";
  ctx.fillText("🦘",canvas.width-95,canvas.height-65);
}

function drawPopup(){
  if(popupTimer>0){

    ctx.fillStyle="rgba(255,255,255,0.9)";
    ctx.beginPath();
    ctx.roundRect(20,70,canvas.width-40,80,20);
    ctx.fill();

    ctx.fillStyle="black";
    ctx.font="20px Arial";
    ctx.fillText(popupMessage,40,115);

    popupTimer--;
  }
}

function drawWin(){
  ctx.fillStyle="pink";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle="white";
  ctx.font="40px Arial";
  ctx.fillText("Forever Together 💖",canvas.width/2-180,canvas.height/2);
}

function gameLoop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if(!bgImage.complete || !kingImg.complete || !queenImg.complete){
    requestAnimationFrame(gameLoop);
    return;
  }

  if(gameState==="level1"){
    drawBackground();
    setupFences();
    updateJump();
    drawRewards();
    drawTopHearts();
    drawPlayer();
    drawQueen();
    drawJumpButton();
    drawPopup();
  }

  if(gameState==="win"){
    drawWin();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
