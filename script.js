const gameboard = (function () {
    let board = ["", "", "", "", "", "", "", "", ""];
    const domBoardCells = document.querySelectorAll(".cell");
    const gameContainer = document.querySelector(".game-container");
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],    //rows
        [0, 3, 6], [1, 4 ,7], [2, 5, 8],    //columns
        [2, 4, 6], [0, 4, 8]                //diagonals
    ];
    const getBoard = () => board;
    const getWinConditions = () => winConditions;
    const makeMove = (index, playerMarker) => {
        if(board[index] == "") {
            board[index] = playerMarker;
            return true;
        }
        return false;
    }
    const handleCellClick = gameContainer.addEventListener("click", (event) => {
        if(event.target.classList[0] === "cell") {
            const cellIndex = +event.target.getAttribute("index");
            gameflow.playRound(cellIndex);
        }
    });
    const resetBoard = () => {
        board = board.map(() => "");
    }

    const renderBoard = () => {
        for(let i = 0 ; i < board.length ; i++) {
            if(board[i] !== "") {
                const playerMarkerIcon = document.createElement("img");
                playerMarkerIcon.src = `./images/${board[i].toLowerCase()}-icon.svg`;
                playerMarkerIcon.draggable = false;
                if(domBoardCells[i].childNodes.length) {
                    domBoardCells[i].replaceChild(playerMarkerIcon, domBoardCells[i].firstChild);
                }
                else {
                    domBoardCells[i].appendChild(playerMarkerIcon);
                }
            }
            else {
                if(domBoardCells[i].childNodes.length) {
                    domBoardCells[i].removeChild(domBoardCells[i].firstChild);
                }
            }
        }
    } 

    return {
        getBoard,
        getWinConditions,
        makeMove,
        resetBoard,
        renderBoard
    };
})();

const player = function(marker) {
    let score = 0;
    const domScoreContainers = document.querySelectorAll(".scores > .p");
    const getMarker = () => marker;
    const getScore = () => score;
    const increaseScore = () => {score++};
    const renderScore = () => {
        switch(getMarker()) {
            case "X": 
                domScoreContainers[0].children[1].textContent = getScore();
                break;
            case "O":
                domScoreContainers[1].children[1].textContent = getScore();
                break;
        }
    }
    const toggleTurnBorder = () => {
        for(container of domScoreContainers) {
            container.children[0].classList.toggle("turn");
        }
    }
    return {
        getMarker,
        getScore,
        increaseScore,
        renderScore,
        toggleTurnBorder
    };
}

const player1 = player("X");
const player2 = player("O");

const gameflow = (function() {
    let currentPlayer = player1;
    const domTieScore = document.querySelector(".tie .score");
    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ?
        player2 : player1;
    };
    const renderTieScore = () => {
        domTieScore.textContent = +domTieScore.textContent + 1;
    }
    const checkWin = () => {
        const board = gameboard.getBoard();
        return gameboard.getWinConditions().some(condition => {
            return board[condition[0]] !== "" &&
            board[condition[0]] === board[condition[1]] 
            && board[condition[1]] === board[condition[2]];
        });
    };
    const checkDraw = () => {
        const board = gameboard.getBoard();
        return gameboard.getWinConditions().every(condition => {
            return board[condition[0]] !== "" 
            && board[condition[1]] !== "" 
            && board[condition[2]] !== "" 
            && (board[condition[0]] !== board[condition[1]] || board[condition[0]] !== board[condition[2]]);
        });
    };

    const playRound = (index) => {
        if(gameboard.makeMove(index, currentPlayer.getMarker())) {
            currentPlayer.toggleTurnBorder();
            gameboard.renderBoard();
            if(checkWin()) {
                currentPlayer.increaseScore();
                currentPlayer.renderScore();
                gameboard.resetBoard();
                gameboard.renderBoard();
                switchPlayer();
            }
            else if(checkDraw()) {
                gameboard.resetBoard();
                gameboard.renderBoard();
                renderTieScore();
                switchPlayer();
            }
            else {
                switchPlayer();
            }
        }
    }
    return {
        playRound
    }
})();