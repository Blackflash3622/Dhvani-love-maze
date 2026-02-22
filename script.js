let character = document.getElementById("character");
let jumpBtn = document.getElementById("jumpBtn");

let hearts = document.querySelectorAll(".heart");
let ring = document.querySelector(".ring");

let positions = [10,100,190,270,350,430,510,590];
let step = 0;

jumpBtn.addEventListener("click", function(){

    if(step >= positions.length-1) return;

    step++;

    // Move character
    character.style.left = positions[step] + "px";

    // Play sprite animation
    character.classList.remove("animate");
    void character.offsetWidth;
    character.classList.add("animate");

    // Jump motion
    character.classList.add("jump");

    setTimeout(()=>{
        character.classList.remove("jump");

        // Heart collect
        hearts.forEach(h=>{
            if(Math.abs(h.offsetLeft - character.offsetLeft) < 30){
                h.style.display = "none";
            }
        });

        // Ring collect
        if(Math.abs(ring.offsetLeft - character.offsetLeft) < 30){
            ring.style.display = "none";
            setTimeout(()=>{
                alert("Level 1 Complete ❤️");
            },300);
        }

    },500);

});
