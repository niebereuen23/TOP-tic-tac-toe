// Building the Gameboard
const gameboard = ( function() {
    const board = [
        [ null, null, null],
        [ null, null, null],
        [ null, null, null]
    ];
    let boardMarks = 0;
    let hasAWinner = false;

    const getBoardMarks = () => boardMarks;

    const getWinner = () => hasAWinner;
    
    const setMarker = (name, playerMarker) => {
        do {
            do {
                var row = +prompt(`${name}, which row do you want to mark?`);
                if (isNaN(row) || row < 0 || row > 2) {
                    alert('Value should be an integer between 0 and 2');
                }
            } while (isNaN(row) || row < 0 || row > 2);

            do {
                var column = +prompt(`${name}, which column do you want to mark?`);
                if (isNaN(column) || column < 0 || column > 2) {
                    alert('Value should be an integer between 0 and 2');
                }
            } while (isNaN(column) || column < 0 || column > 2);
            
            if (board[row][column] !== null) {
                console.log('Already marked, pick another location!');
            }
        } while (board[row][column] !== null)

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
        console.log(row);

        if ((row *-1) + 2 === column) {
            for (let i = 0; i < 3; i++) {
                if (board[2 - i][i]) {
                    diagonalMarks2++;
                }
            }
        }

        if (rowMarks === 3 || columnMarks === 3 || diagonalMarks1 === 3 || diagonalMarks2 === 3) {
            hasAWinner = true;
        }
    }

    return { setMarker, getBoardMarks, getWinner }; //I should not return/expose 'board' since I don't want this variable to be freely accessible
}) ();


// Building the Player function factory
function createPlayer() {
    const name = prompt('What is your name?');
    const marker = prompt('Set your marker (letter)'); // TODO: add validation to avoid same marker symbols. Should be a string, only 1 character.
    let isWinner = false;

    const getWinner = () => isWinner;

    const playRound = () => {
        gameboard.setMarker(name, marker);
        if (gameboard.getWinner()) {
            isWinner = true;
        }
    }
    return {
        name,
        marker,
        getWinner,
        playRound
    }
}

// Game object
const game = ( function() {
    const player1 = createPlayer();
    const player2 = createPlayer();
    let isGameOver = false;

    const players = [player1, player2];

    const start = () => {
        let i = 0;
        while (!isGameOver) {
            players[i % 2].playRound();
            
            if (players[i % 2].getWinner()) {
                isGameOver = true;
                console.log(`${players[i % 2].name} won!`);
            } else if (gameboard.getBoardMarks() === 9) {
                isGameOver = true;
                console.log('Game over! You both suck and tied!');
            }           
            i++;
        }
    }

    return {
        start,
    }
}) ();