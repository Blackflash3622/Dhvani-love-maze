let currentPole = 0;
let heartsCollected = 0;
let isJumping = false;

const character = document.getElementById("character");
const poles = document.querySelectorAll(".pole");
const jumpBtn = document.getElementById("jumpBtn");
const messageBox = document.getElementById("messageBox");
const uiHearts = document.querySelectorAll(".ui-heart");

const totalFrames = 5;
const frameWidth = 643 / 5;
let currentFrame = 0;

jumpBtn.addEventListener("click", () => {
    if (isJumping) return;
    if (currentPole >= poles.length - 1) return;

    isJumping = true;
    animateJump();
});

function animateJump() {

    let sequence = [0,1,2,3,4,3,2,1,0];
    let i = 0;

    let interval = setInterval(() => {
        currentFrame = sequence[i];
        character.style.backgroundPosition = `-${currentFrame * frameWidth}px 0px`;
        i++;

        if (i >= sequence.length) {
            clearInterval(interval);
            moveToNextPole();
            isJumping = false;
        }
    }, 70);
}

function moveToNextPole() {
    currentPole++;

    let polePosition = poles[currentPole].offsetLeft;
    character.style.left = polePosition - 35 + "px";

    checkPole();
}

function checkPole() {
    let pole = poles[currentPole];

    if (pole.classList.contains("heart")) {
        pole.classList.remove("heart");
        uiHearts[heartsCollected].classList.add("filled");
        heartsCollected++;
        showMessage("Heart Collected ❤️");

        if (heartsCollected === 3) {
            showMessage("All Hearts Collected 💖");
        }
    }

    if (pole.classList.contains("ring")) {
        showMessage("Level Complete 🎉");
        // Redirect removed to avoid error
    }
}

function showMessage(text) {
    messageBox.innerText = text;
    messageBox.style.display = "block";

    setTimeout(() => {
        messageBox.style.display = "none";
    }, 1500);
}
