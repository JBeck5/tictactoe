
/*=========     function GameBoard()     ==========*/
//initialize gameboard, setting 3x3 grid and each box to value 0
//and handles gameboard mechanics
function GameBoard() {
    const board = [];
    const rows = 3;
    const columns = 3;

    for(i = 0; i < rows; i++) {
        board[i] = [];
        for(j = 0; j < columns; j++) {
            board[i].push(Square());
        }
    }
    
    //display board to console
    const printBoard = () => {
        boardWithSquareValues = board.map((row) => row.map((square) => square));
        console.log(boardWithSquareValues);
    }

    const addValueToSquare = (row, column, player) => {
        const selectedSquare = board[row][column];
        if (selectedSquare.getValue() != "") {
            throw new Error("Invalid Space. Pick an Empty Square.");
        }
        selectedSquare.addToken(player);
    }

    const getBoard = () => board;

    const resetSquares = () => {
        board.forEach((row) => row.forEach((square) => square.reset()));
    }

    return {
        printBoard,
        addValueToSquare,
        getBoard,
        resetSquares
    }
}

function Square() {
    let value = "";

    const addToken = (player) => {
        console.log(`Square() with ${player.token} and value = "${value}"`);
        value = player.token;
        console.log(`Square() now value = ${value}`);
    }

    const getValue = () => value;

    const reset = () => {
        value = "";
    }

    return {
        addToken,
        getValue,
        reset
    }
}

function Players() {

    const players = [
        {
            name: "Player O",
            token: "O"
        },
        {
            name: "Player X",
            token: "X"
        }
    ];
    return {
        players
    }
}

function GameController() {
    const board = GameBoard();
    const players = Players();

    let activePlayer = players.players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players.players[0] ? players.players[1] : players.players[0];
    };

    const getActivePlayer = () => activePlayer();

    const playTurn = (row, column) => {
        board.addValueToSquare(row, column, activePlayer);
        if(checkWin()) {
            console.log(`${activePlayer.name} Wins!`);
            board.printBoard();
        } else if (checkSquares()) {
            console.log("Draw.");
            board.printBoard();
        } else {
            switchActivePlayer();
            board.printBoard();
        }
    }

    //checks for empty squares
    const checkSquares = () => {
        const gameboard = board.getBoard();
        const isFull = gameboard.every(row => row.every(square => square.getValue() != 0));
        return isFull;
    }

    //checks for any met winning conditions
    const checkWin = () => {
        const gameboard = board.getBoard();
        //Check for Row Win
        for (row = 0; row < 3; row++) {
            if (gameboard[row][0].getValue() === gameboard[row][1].getValue() && 
                gameboard[row][0].getValue() === gameboard[row][2].getValue() && 
                gameboard[row][0].getValue() !== "") {
                    console.log("Row Win");
                    return true;
            }
        }

        //Check for Column Win
        for (column = 0; column < 3; column++) {
            if (gameboard[0][column].getValue() === gameboard[1][column].getValue() &&
                gameboard[0][column].getValue() === gameboard[2][column].getValue() &&
                gameboard[0][column].getValue() !== "") {
                    console.log("Column Win");
                    return true;
            }
        }
        //Check For Diagonal Win
        const diagonalA = [[0, 0], [1, 1], [2, 2]]; //diagonal from top left to bottom right
        const diagonalB = [[2, 0], [1, 1], [0, 2]]; //diagonal from bottom left to top right
    
        if (gameboard[0][0].getValue() == gameboard[1][1].getValue() && 
            gameboard[0][0].getValue() == gameboard[2][2].getValue() && 
            gameboard[0][0].getValue() !== "") {
            console.log("Diagonal A Win");
            return true;
        } else if  (gameboard[2][0].getValue() == gameboard[1][1].getValue() && 
                    gameboard[2][0].getValue() == gameboard[0][2].getValue() && 
                    gameboard[2][0].getValue() !== "") 
                    {
                        console.log("Diagonal B Win");
                        return true;
                    }
        return false;
    }

    const resetGame = () => {
        board.resetSquares();
        activePlayer = players.players[0];
    }

    return {
        switchActivePlayer,
        getActivePlayer,
        playTurn,
        checkWin,
        checkSquares,
        getBoard: board.getBoard,
        resetGame
    }
}

function DisplayController() {
    const gameController = GameController();

    function clickHandler(e) {
        if (gameController.checkWin() || gameController.checkSquares()) {
            throw new Error("Game is Over.");
        }

        const row = e.target.dataset.row;
        const column = e.target.dataset.column;
        gameController.playTurn(row, column);
        screenUpdate();
    }
    function resetHandler() {
        gameController.resetGame();
        screenUpdate();
        console.log("Game Reset.");
    }

    const screenUpdate = () => {
        const board = gameController.getBoard();
        const boardDiv = document.querySelector(".gameboard");
        const infoDiv = document.querySelector(".info");
        const scoreDiv = document.querySelector(".scoreBoard");

        boardDiv.innerText = "";
        infoDiv.innerText = "";

        for (let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                const square = document.createElement("button");
                square.classList.add("square");
                boardDiv.appendChild(square);
                square.dataset.row = i;
                square.dataset.column = j;
                square.textContent = board[i][j].getValue();
                square.addEventListener("click", clickHandler);
            }
        }

        const gameButton = document.createElement("button");
        gameButton.classList.add("game-btn");
        infoDiv.appendChild(gameButton);
        gameButton.textContent = "Reset";
        gameButton.addEventListener("click", resetHandler);

        if (gameController.checkWin() || gameController.checkSquares()) {
            gameButton.textContent = "Play Again?";
            gameButton.addEventListener("click", resetHandler);
        }
    }

    screenUpdate();

    return {
        screenUpdate
    }
}

const display = DisplayController();

/* let game = GameController();

game.playTurn(0, 0);
game.playTurn(1, 0);
game.playTurn(0, 1);
game.playTurn(1, 2);
game.playTurn(0, 2);
game.playTurn(0, 0);
*/
