window.addEventListener('DOMContentLoaded', () => {
    boardGenerator();
    initialPlay();
    beginScoreBoardValues();
});

document.addEventListener('keyup', eventPLay);

document.getElementById("new-game").addEventListener("click", startsANewGame);

function eventPLay(target){
    let direction = target.keyCode;
    switch (direction) {
        case 38:
            moveTop();
            break;
        case 40:
            moveBottom();
            break;
        case 39:
            moveRight();
            break;
        case 37:
            moveLeft();
            break;
    }
    isGameWon();
    if(isGameOver()){
        Toastify({
            text: "Fim de jogo!",
            duration: -1,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #FFA07A, 	#FF6347)",
            }
          }).showToast();
        document.getElementById("board").style.opacity = "0.5";
        document.removeEventListener('keyup', eventPLay);
    }
}