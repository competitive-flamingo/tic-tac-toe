const gameboard = (function() {
    let board = ["", "", "", "", "", "", "", "", ""];
    const getBoard = () => board;
    const makeMove = (index, playerMarker) => {
        if(board[index] === "") {
            board[index] = playerMarker;
            return true;
        }
        return false;
    };
    const resetBoard = () => {
        board = board.map(() => "");
    };
    return {
        getBoard,
        makeMove,
        resetBoard,
    };
})();


function player(marker) {
    const getMarker = () => marker;
    return {
        getMarker,
    }
}

const player1 = player("X");
const player2 = player("O");

const gameflow = (function() {
    let currentPlayer = player1;
    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1? player2 : player1;
    };
    const checkWin = () => {
        const board = gameboard.getBoard();
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],    //rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],    //columns
            [0, 4, 8], [2, 4, 6]                //diagonals
        ];

        return winConditions.some(condition => {
            return board[condition[0]] !== "" 
            && board[condition[0]] === board[condition[1]] 
            && board[condition[1]] === board[condition[2]];
        });
    };


    const checkTie = () => {
        const board = gameboard.getBoard();
        return board.every(cell => cell !== "");
    }

    const playRound = (index) => {
        if(gameboard.makeMove(index, currentPlayer.getMarker())) {
            if(checkWin()) {
                console.log(`${currentPlayer.getMarker()} wins!`);
                gameboard.resetBoard();
                currentPlayer = player1; 
            }
            else if(checkTie()) {
                console.log("DRAW!");
                gameboard.resetBoard();
                currentPlayer = player1;
            }
            else {
                switchPlayer();
            }
        }
        else {
            console.log("Cell already taken. Try again!");
        }
    }
    return {
        playRound
    };
})();

gameflow.playRound(0);
gameflow.playRound(1);
gameflow.playRound(2);
gameflow.playRound(4);
gameflow.playRound(3);
gameflow.playRound(5);
gameflow.playRound(7);
gameflow.playRound(6);
gameflow.playRound(8);

console.log(gameboard.getBoard());