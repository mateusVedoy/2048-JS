let board = recoverPrintedBoard();
let boardBlock;
let points = document.getElementById('points');
let isDone = false;
let score;
let bestScore;
let userScore = document.getElementById("points");
let userBestScore = document.getElementById("bestPlay");
let isTheEnd = false;

// verifica se há tabuleiro salvo o locastorage para recuperar
function recoverPrintedBoard() {
    let auxBoard;
    let exitBoard = [];
    let min = 0, max = 4;
    if (localStorage.getItem("savedBoardPrint") != null) {
        auxBoard = localStorage.getItem("savedBoardPrint").split(",").toString();
        for (let i = 0; i < 4; i++) {
            exitBoard.push(auxBoard.split(",").slice(min, max));
            min += 4;
            max += 4;
        }
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                exitBoard[r][c] = parseInt(exitBoard[r][c]);
            }
        }
    } else {
        exitBoard = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    }
    return exitBoard;
}

// gera o tableiro de jogo
function boardGenerator() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            boardBlock = document.createElement("div");
            boardBlock.id = `${r}-${c}`;
            let num = board[r][c];
            updateBoardBlock(boardBlock, num);
            document.getElementById("board").append(boardBlock);
        }
    }
}

//atualiza o tabuleiro
function updateBoardBlock(block, num) {
    block.innerText = "";
    block.classList.value = "";
    block.classList.add("boardBlock");
    if (num > 0) {
        block.innerText = `${num}`;
        if (num <= 4096) {
            block.classList.add(`x${num}`);
        } else {
            block.classList.add("x8192");
        }
    }
}

// realiza a jogada do tabuleiro
function boardPlay() {
    let r, c;
    isDone = false;
    do {
        r = randomIndexGen();
        c = randomIndexGen();
        if (board[r][c] == 0) {
            let indexValue = `${randomNumberGen()}`;
            board[r][c] = indexValue;
            boardBlock = document.getElementById(`${r}-${c}`);
            boardBlock.innerText = `${indexValue}`;
            boardBlock.classList.add(`x${indexValue}`);
            isDone = true;
        }
    } while (!isDone);
}

// realiza o inicio do jogo
function initialPlay() {
    let count = 0;
    if (localStorage.getItem("savedBoardPrint") == null) {
        for (let i = 0; i < 2; i++) {
            do {
                boardPlay();
                count++;
            } while (count < 1);
        }
    }
}

function randomIndexGen() {
    return Math.floor(Math.random() * (4 - 0)) + 0;
}

function randomNumberGen() {
    let rand = Math.floor(Math.random() * (10 - 1)) + 1;
    return (rand == 1) ? 4 : 2;
}

function removeZeros(row) {
    return row.filter(num => num != 0);
}

function addZeros(row) {
    while (row.length < 4) {
        row.push(0);
    }
    return row;
}

// verifica se houve alteração no tbuleiro
function isBoardChanged(original, modified) {
    return JSON.stringify(original) != JSON.stringify(modified);
}

// atualiza plcar
function updateScore(score) {
    points.innerText = `${score}`;
}

// salva no localstorage dados
function saveProgress(key, value) {
    localStorage.setItem(key, value);
}

//tenta buscar valores do locastorage, senão achar, preenche com zero
function beginScoreBoardValues() {
    score = parseInt(localStorage.getItem("userScore") || 0);
    bestScore = parseInt(localStorage.getItem("bestScore") || 0);
    userScore.innerText = `${score}`;
    userBestScore.innerText = `${bestScore}`;
}

// realiza o deslocamento das jogadas
function slide(row) {
    let original = row;
    row = removeZeros(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += parseInt(row[i]);
            saveProgress("userScore", `${score}`);
            updateScore(score);
        }
    }
    row = removeZeros(row);
    row = addZeros(row);
    let slided = row;
    let isBoardAbbleToPlay = isBoardChanged(original, slided);
    return { row, isBoardAbbleToPlay };
}

// realiza jogada para esquerda
function moveLeft() {
    let mustBoardPlay = false;
    for (let r = 0; r < 4; r++) {
        let originalRow = board[r];
        let { row, isBoardAbbleToPlay } = slide(originalRow);
        if (isBoardAbbleToPlay) {
            mustBoardPlay = true;
        }
        board[r] = row;
        for (let c = 0; c < 4; c++) {
            boardBlock = document.getElementById(`${r}-${c}`);
            let num = board[r][c];
            updateBoardBlock(boardBlock, num);
        }
    }
    if (mustBoardPlay) {
        boardPlay();
        saveProgress("savedBoardPrint", `${board}`);
        userBestScore = bestScore;
    }
}

// realiza jogada para direita
function moveRight() {
    let mustBoardPlay = false;
    for (let r = 0; r < 4; r++) {
        let originalRow = board[r];
        originalRow.reverse();
        let { row, isBoardAbbleToPlay } = slide(originalRow);
        if (isBoardAbbleToPlay) {
            mustBoardPlay = true;
        }
        board[r] = row.reverse();
        for (let c = 0; c < 4; c++) {
            boardBlock = document.getElementById(`${r}-${c}`);
            let num = board[r][c];
            updateBoardBlock(boardBlock, num);
        }
    }
    if (mustBoardPlay) {
        boardPlay();
        saveProgress("savedBoardPrint", `${board}`);
        userBestScore = bestScore;
    }
}

// realiza jogada para cima
function moveTop() {
    mustBoardPlay = false;
    for (let c = 0; c < 4; c++) {
        let originalRow = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let { row, isBoardAbbleToPlay } = slide(originalRow);
        if (isBoardAbbleToPlay) {
            mustBoardPlay = true;
        }
        for (let r = 0; r < 4; r++) {
            board[r][c] = row[r];
            boardBlock = document.getElementById(`${r}-${c}`);
            let num = board[r][c];
            updateBoardBlock(boardBlock, num);
        }
    }
    if (mustBoardPlay) {
        boardPlay();
        saveProgress("savedBoardPrint", `${board}`);
        userBestScore = bestScore;
    }
}

// realiza jogada para baixo
function moveBottom() {
    let mustBoardPlay = false;
    for (let c = 0; c < 4; c++) {
        let originalRow = [board[0][c], board[1][c], board[2][c], board[3][c]];
        originalRow.reverse();
        let { row, isBoardAbbleToPlay } = slide(originalRow);
        if (isBoardAbbleToPlay) {
            mustBoardPlay = true;
        }
        row.reverse();
        for (let r = 0; r < 4; r++) {
            board[r][c] = row[r];
            boardBlock = document.getElementById(`${r}-${c}`);
            let num = board[r][c];
            updateBoardBlock(boardBlock, num);
        }
    }
    if (mustBoardPlay) {
        boardPlay();
        saveProgress("savedBoardPrint", `${board}`);
        userBestScore = bestScore;
    }
}

//verifica se o jogo acabou
// precisar verificar se:
// tabuleiro está cheio
// se não tem como movimentar as peças
function isGameOver() {
    let isOver = true;
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (board[r][c] == 0) {
            isOver = false;
            console.log(isOver)
          }
        }
    }
    for (let r = 0; r < 4 - 1; r++) {
        for (let c = 0; c < 4 - 1; c++) {
            let aux = board[r][c];
            if (aux != 0 && (aux == board[r + 1][c] || aux == board[r][c + 1])) {
                isOver = false;
                console.log(isOver)
            }
        }
    }
    for (let r = 1; r < 4; r++) {
        for (let c = 1; c < 4; c++) {
            let aux = board[r][c];
            if (aux != 0 && (aux == board[r - 1][c] || aux == board[r][c - 1])) {
                isOver = false;
                console.log(isOver)
            }
        }
    }
    changeBestScore("bestScore", score);
    return isOver;
}

// altera o placar do storage
function changeBestScore(key, score) {
    let actualBestScore = parseInt(recoverProgress(key)) || 0;
    if (actualBestScore < score) {
        saveProgress(key, score);
    }
}

//recupera o progresso do localstorage
function recoverProgress(key) {
    return localStorage.getItem(key);
}

//limpa os dados do localstorage
function resetLocalProgress(key) {
    localStorage.removeItem(key);
}

//recomeça um novo jogo
function startsANewGame() {
    isTheEnd = false;
    resetLocalProgress("userScore");
    resetLocalProgress("savedBoardPrint");
    location.reload();
}

function isGameWon() {
    if (score >= 2048) {
        alert("Você ganhou!");
        changeBestScore("bestScore", score);
    }
}
