window.addEventListener('DOMContentLoaded', () => {
    boardGenerator();
    initialPlay();
    beginScoreBoardValues();
});

document.addEventListener('keyup', (target) => {
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
        alert("Game Over");
    }
});

document.getElementById("new-game").addEventListener("click", startsANewGame);