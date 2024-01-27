// Building the Gameboard
const gameboard = ( function() {
    let board = [
        [ "", "", ""],
        [ "", "", ""],
        [ "", "", ""]
    ];

    let boardMarks = 0;
    let hasAWinner = false;

    const isCellAvailable = (row, column) => {
        if (board[row][column] === "") {
            return true;
        } else return false; // Should always use return keyword
    }

    const getBoardArr = () => board;

    const getBoardMarks = () => boardMarks;

    const getWinner = () => hasAWinner;
    
    const setMarker = (playerMarker, row, column) => {
        
        board[row][column] = playerMarker;
        boardMarks++;
        console.table(board);

        // winning rules are: complete 1 row, complete 1 column, complete 1 diagonal
        // Marks counter. Means a player won the game if any counter reaches to 3.
        let rowMarks = 0;
        let columnMarks = 0;
        let diagonalMarks1 = 0;
        let diagonalMarks2 = 0;

        // row win
        for (let j = 0; j < 3; j++) {
            if (board[row][j] === playerMarker) {
                rowMarks++;
            }
        }
        // column win
        for (let i = 0; i < 3; i++) {
            if (board[i][column] === playerMarker) {
                columnMarks++;
            }
        }
        // diagonal win
        if (row === column) {
            for (let i = 0; i < 3; i++) {
                if (board[i][i] === playerMarker) {
                    diagonalMarks1++;
                }
            }
        }
        console.log(row);
        console.log(column);

        if ((row *-1) + 2 === column) {
            for (let i = 0; i < 3; i++) {
                if (board[2 - i][i] === playerMarker) {
                    diagonalMarks2++;
                }
            }
        }

        if (rowMarks === 3 || columnMarks === 3 || diagonalMarks1 === 3 || diagonalMarks2 === 3) {
            hasAWinner = true;
        }

        // Update board UI
        displayController.displayUpdatedMarkInBoard(board);
    }

    const reset = () => {
        board = [
            [ "", "", ""],
            [ "", "", ""],
            [ "", "", ""]
        ];
        boardMarks = 0;
        hasAWinner = false;
    }
    
    return { isCellAvailable, getBoardArr, setMarker, getBoardMarks, getWinner, reset }; //I should not return/expose 'board' since I don't want this variable to be freely accessible
}) ();


// Building the Player function factory
function createPlayer() {
    const name = prompt('What is your name?');
    const marker = prompt('Set your marker (letter)'); // TODO: add validation to avoid same marker symbols. Should be a string, only 1 character.
    let isWinner = false;

    const getWinner = () => isWinner;

    const playOneRound = (marker, row, column) => {
        
        gameboard.setMarker(marker, row, column);
        if (gameboard.getWinner()) {
            isWinner = true;
        }
    }

    return {
        name,
        marker,
        getWinner,
        playOneRound
    }
}


// Game Flow-Logic object
const game = ( function() {

    let isGameOver = false;
    let isGameReset = true;
    let players = [];
    let turnCounter = 0;

    const start = () => {
        isGameReset = false;
        players.push(createPlayer(), createPlayer());

        displayController.logPlayerTurn(players[turnCounter % 2].name);
    }

    const getPlayers = () => players;

    const getTurnCounter = () => turnCounter;
    
    const roundTurn = (row, column) => {
        players[turnCounter % 2].playOneRound(players[turnCounter % 2].marker, row, column);

        if (players[turnCounter % 2].getWinner()) {
            isGameOver = true;
            displayController.logWinGameOver(players[turnCounter % 2].name);
        } else if (gameboard.getBoardMarks() === 9) {
            displayController.logTieGameOver();
        }

        turnCounter++;
        if (!isGameOver) displayController.logPlayerTurn(players[turnCounter % 2].name);
        
    }

    const getIsGameOver = () => isGameOver;
    const getIsGameReset = () => isGameReset;

    const reset = () => {
        gameboard.reset();
        players = [];
        isGameReset = true;
        isGameOver = false;
        turnCounter = 0;
        displayController.displayUpdatedMarkInBoard(gameboard.getBoardArr());
        displayController.clearLogger();
    }

    return {
        getPlayers,
        getTurnCounter,
        getIsGameReset,
        getIsGameOver,
        start,
        roundTurn,
        reset
    }
}) ();


// Controller to handle display/DOM logic. Should this Module work similar as console.log work?
const displayController = (function () {
    const logger = document.querySelector('#logger');
    const board = document.querySelectorAll('#gameboard > div');

    logger.textContent = 'Press "Start" brother ...'

    const logBasicText = (text) => {
        logger.textContent = text;
    }

    const clearLogger = () => {
        logger.textContent = '';
    }

    const logWinGameOver = (name) => {
        logger.textContent = `${name} won!`;
    }

    const logTieGameOver = () => {
        logger.textContent = 'Game over! You both suck and tied!';
    }

    const logPlayerTurn = (name) => {
        logger.textContent = `It's ${name}'s turn.`
    }

    const displayUpdatedMarkInBoard = (boardArr) => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[(3 * i) + j].textContent = `${boardArr[i][j]}`;
            }
        }
    }

    // Adding event listeners to each cell in the gameboard immediately after being created
    const boardCells = document.querySelectorAll('#gameboard > div');
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                boardCells[(3 * i) + j].addEventListener('click', () => {
                    if (game.getIsGameReset() || game.getIsGameOver()) return; // Flag
                    if (!gameboard.isCellAvailable(i, j)) {
                        displayController.logBasicText('Already marked, pick another location! ...');
                        setTimeout(() => {
                            displayController.logPlayerTurn(game.getPlayers()[game.getTurnCounter() % 2].name)
                        }, 2000); //TODO: bug, when player selects already marked cell, quickly selects another and win, turn of other player gets displayed in logger.
                    }   else {
                        game.roundTurn(i, j);
                    }
                });
            }
        }


    // Start button
    const startButton = document.querySelector('#start');
    startButton.addEventListener('click', (e) => {
        game.start();
        // TODO: as game started, start button should remain disabled until "reset" button is pressed

        e.target.disabled = true;
    });

    // Reset
    const resetButton = document.querySelector('#reset');
    resetButton.addEventListener('click', () => {
        game.reset();
        startButton.disabled = false;
        displayController.logBasicText('Press "Start" ...')
    });

    return {
        logBasicText,
        clearLogger,
        logPlayerTurn,
        displayUpdatedMarkInBoard,
        logTieGameOver,
        logWinGameOver
    }
}) ();