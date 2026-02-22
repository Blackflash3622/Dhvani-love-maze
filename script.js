let character = document.getElementById("character");
let sticks = document.querySelectorAll(".stick");
let jumpBtn = document.getElementById("jumpBtn");

let currentStick = 0;

jumpBtn.addEventListener("click", function(){

    if(currentStick >= sticks.length-1){
        return;
    }

    currentStick++;

    let targetStick = sticks[currentStick];

    let leftPos = targetStick.offsetLeft;

    character.style.left = leftPos - 20 + "px";

    // Collect heart
    let heart = targetStick.querySelector(".heart");
    if(heart){
        heart.style.display = "none";
    }

    // Collect ring and finish
    let ring = targetStick.querySelector(".ring");
    if(ring){
        ring.style.display = "none";
        setTimeout(function(){
            alert("Level 1 Complete ❤️");
        },400);
    }

});
