//initialize gameboard, setting 3x3 grid and each box to value 0
//and handles gameboard mechanics
function Gameboard() {
    const board = [];
    const rows = 3;
    const columns = 3;

    for(i = 0; i < rows; i++) {
        board[i] = [];
        for(j = 0; j < columns; j++) {
            board[i].push(Square());
        }
    }

    const getBoard = () => board;

    const printBoard = () => {
        boardWithSquareValues = board.map((row) => row.map((square) => square.getValue()));
        console.log(boardWithSquareValues);
    };

    const addValueToSquare = (row, column, player) => {
        const selectedSquare = board[row][column];
        if (selectedSquare.getValue !== 0) {
            throw new Error("Invalid Space. Pick an empty square.");
        }
        selectedSquare.addToken(player);
    }

    const resetSquares = () => {
        board.forEach((row) => row.forEach((square) => square.reset()));
    }

    return {
        getBoard,
        printBoard,
        addValueToSquare,
        resetSquares
    };
}

//create each square space of the 3x3 grid
//and handles square mechanics
function Square() {
    let value = 0;

    const addToken = (player) => {
        value = player.token;
    };

    const getValue = () => value;

    const reset = () => {
        value = 0;
    }

    return {
        addToken,
        getValue,
        reset
    };
}

function Player() {
    const players = [
        {
            name: "Player O",
            token: 'O'
        },
        {
            name: "Player X",
            token: 'X'
        }
    ];
    return {
        players
    }
}

function GameController() {
    const board = Gameboard();
    const players = Player();

    let activePlayer = players.players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];  
    };

    const getActivePlayer = () => activePlayer();

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer.name}'s turn.`);
    }

    const playRound = (row, column, activePlayer) => {
        board.addValueToSquare(row, column, activePlayer);

        if(checkWin()) {
            console.log("Winning Condition");
        }else if (checkSquares()) {
            console.log("Draw Condition");
        }

        if(checkWin() || checkSquares()) {
            console.log("End Game.")
            board.printBoard();
            activePlayer = players.players[0];
            return;
        } else {
            switchActivePlayer();
            printNewRound();
        }
    }

    //checks for empty squares
    const checkSquares = () => {
        const gameboard = board.getBoard;
        const isFull = gameboard.every(row => row.every(square => square.getValue() != 0));
        return isFull;
    }

    //checks for any met winning conditions
    const checkWin = () => {
        const gameboard = board.getBoard();

        //Check for Row Win
        for (row = 0; row < 3; row++) {
            if  (gameboard[row][0].getValue === gameboard[row][1].getValue && 
                gameboard[row][0].getValue === gameboard[row][2].getValue && 
                gameboard[row][0].getValue !== 0) {
                return true;
            }
        }

        //Check for Column Win
        for (column = 0; column < 3; column++) {
            if  (gameboard[0][column].getValue === gameboard[1][column].getValue &&
                gameboard[0][column].getValue === gameboard[2][column].getValue &&
                gameboard[0][column].getValue !== 0) {
                return true;
            }
        }
        //Check For Diagonal Win
        const diagonalA = [[0, 0], [1, 1], [2, 2]]; //diagonal from top left to bottom right
        const diabonalB = [[2, 0], [1, 1], [0, 2]]; //diagonal from bottom left to top right

        if (diagonalA[0] == diagonalA[1] && diagonalA[0] == diagonalA[2] && diagonalA[0] !== 0) {
            return true;
        }

        if (diagonalB[0] === diagonalB[1] && diagonalB[0] === diagonalB[2] && diagonalB[0] !=0 ) {
            return true;
        }
    }

    const resetGame =() => {
        gameboard.resetSquares();
        activePlayer = players.players[0];
    }

    return {
        getActivePlayer,
        playRound,
        checkSquares,
        checkWin,
        resetGame,
    }
}

function GameDisplay() {
    const gameController = GameController();
    const squares = document.querySelectorAll(".square");

    const updateDisplay = () => {
        const board = gameController.getBoard;
        const boardDiv = document.querySelector(".gameboard");
        const info = document.querySelector(".info");

        boardDiv.innerText = "";

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const square = document.createElement("button");
                square.classList.add("square");
                boardDiv.appendChild(square);
                square.dataset.row = i;
                square.dataset.column = j;
                square.textContent = board[i][j].getValue();
                square.addEventListener("click", playEvent);
            }
        }

        renderGame();
    }

    const squareClickHandler = (event) => {
        const square = event.target;
        const row = square.dataset.row;
        const column = square.dataset.column;
        console.log(gameController.getActivePlayer());
        addTokenToSquare(row, column, gameController.getActivePlayer());
        gameController.playRound(row, column);
        updatePlayerTurn(gameController.getActivePlayer());
        displayGameWinner();
    }

    const addTokenToSquare = (row, column, activePlayer) => {
        const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

        if (square.textContent == '') {
            square.textContent = player.token;
        }
    }
    const renderGame = () => {
        squares.forEach(square => {
            square.addEventListener('click', squareClickHandler);
        });
    }
    
    const resetGame = () => {
        console.log("Game Reset");
        gameControllerC.resetGame();
        squares.forEach(square => {
            square.textContent = '';
        });
        //set up player turns
    }

    
    return {
        updateDisplay,
        squareClickHandler,
        addTokenToSquare,
        renderGame
    };
}

GameDisplay();