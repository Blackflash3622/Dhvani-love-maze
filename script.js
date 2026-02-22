let character = document.getElementById("character");
let jumpBtn = document.getElementById("jumpBtn");

let hearts = document.querySelectorAll(".heart");
let ring = document.querySelector(".ring");

let positions = [20, 100, 180, 260, 330, 410, 480, 560, 600];
let step = 0;

jumpBtn.addEventListener("click", function(){

    if(step >= positions.length-1) return;

    step++;

    character.classList.add("jump");

    setTimeout(()=>{
        character.classList.remove("jump");
        character.style.left = positions[step] + "px";

        // Heart collect
        hearts.forEach(h=>{
            if(Math.abs(h.offsetLeft - character.offsetLeft) < 20){
                h.style.display = "none";
            }
        });

        // Ring collect
        if(Math.abs(ring.offsetLeft - character.offsetLeft) < 20){
            ring.style.display = "none";
            setTimeout(()=>{
                alert("Level 1 Complete ❤️");
            },300);
        }

    },200);

});
