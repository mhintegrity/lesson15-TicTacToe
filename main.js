// Mark Harder, Basic Tic Tac Toe, Lesson 15, MHIntegrity
// setup the inital state of the board by creating our gameState variable.
// so that we can restart a new game by reinitializing the state, use a function.
// Games can be either turn based on realtime, this game is turn based.
let gameState = {};

InitializeBoardState();

function InitializeBoardState() {
    LoadBoardState();

    // Update the screen so it is ready to go for the first turn.
    UpdateScreenState();

    // add events for when the users click on squares.
    // From homework for lesson 13, only apply to emply locatons.
    document.querySelectorAll('.sq').forEach((element) => {
        if (element.innerText === "") {
            element.addEventListener('click', MainGameLogic);
        };
    });
}

function LoadBoardState() {
    // From homework for lesson 13
    let tempGS = localStorage.getItem("Lesson14-TicTacToe");

    if (tempGS !== null) {
        gameState = JSON.parse(tempGS);
    } else {
        ResetGame();
    }
}

function ResetGame() {
    gameState = {
        board: [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ],
        Next: "X",
        Winner: ""
    };
    document.getElementById('AIPlayerMove').disabled = false;
    SaveBoardState();
    UpdateScreenState();
    // add events for when the users click on squares.
    document.querySelectorAll('.sq').forEach((element) => {
        element.addEventListener('click', MainGameLogic);
    });
}

function SaveBoardState() {
    // From homework for lesson 13
    localStorage.setItem("Lesson14-TicTacToe", JSON.stringify(gameState));
}

// Use our gameState data to update what is displayed on our app page
function UpdateScreenState() {
    // If there is a winner show it.
    if (gameState.Winner === "") {
        document.getElementById('Winner').innerText = `It is ${gameState.Next}'s turn`;
    } else {
        document.getElementById('AIPlayerMove').disabled = true;
        if (gameState.Winner == "Tie") {
            document.getElementById('Winner').innerText = `The game is a Tie`;
        } else {
            document.getElementById('Winner').innerText = `The winner is ${gameState.Winner}`;
        }
    }

    // Update each of the board squares based on gameState
    for (let row = 0; row <= 2; row++) {
        for (let col = 0; col <= 2; col++) {
            document.getElementById(row.toString() + col.toString()).innerText = gameState.board[row][col];
        }
    }
}

// Event based game loop, called when the user click/chooses a game board square.
function MainGameLogic(event) {
    // event.target.id[0] returns a string, so we need to convert it to a number.
    let row = Number(event.target.id[0]);
    let col = Number(event.target.id[1]);

    // add the next X or O
    gameState.board[row][col] = gameState.Next;
    // change the next X or O
    gameState.Next = gameState.Next === "X" ? "O" : "X";

    // remove the event from the grid so there is no new event
    event.target.removeEventListener('click', MainGameLogic);

    // Check to see if we have a winner
    if (CheckForWinner()) {
        // After we have a winner remove the events for remaining squares so they don't fire.
        for (let row = 0; row <= 2; row++) {
            for (let col = 0; col <= 2; col++) {
                if (gameState.board[row][col] === "") {
                    document.getElementById(`${row}${col}`).removeEventListener('click', MainGameLogic);
                }
            }
        }
    };

    SaveBoardState();
    UpdateScreenState();
}

// Break out the test for a specific player win.
// Return 'X' or 'O' of the winner, 'Tie' for a full board, '' for no current winner.
// Changed in lesson 14
function TestForWin(TestBoard) {
    // Setup the variable we are going to return.
    let Winner = '';
   
    // Here is the simplest logic for checking every possibility for win.
    let row1 = TestBoard[0][0] + TestBoard[0][1] + TestBoard[0][2];
    let row2 = TestBoard[1][0] + TestBoard[1][1] + TestBoard[1][2];
    let row3 = TestBoard[2][0] + TestBoard[2][1] + TestBoard[2][2];
    
    // first check to see of the board is full
    if (row1.length + row2.length + row3.length === 9) {
        Winner = "Tie";
    }
    
    // check rows for win
    if (row1 === "XXX" || row2 === "XXX" || row3 === "XXX") {
        Winner = "X";
    }
    if (row1 === "OOO" || row2 === "OOO" || row3 === "OOO") {
        Winner = "O";
    }

    // check cols for win
    let col1 = TestBoard[0][0] + TestBoard[1][0] + TestBoard[2][0];
    let col2 = TestBoard[0][1] + TestBoard[1][1] + TestBoard[2][1];
    let col3 = TestBoard[0][2] + TestBoard[1][2] + TestBoard[2][2];    
    if (col1 === "XXX" || col2 === "XXX" || col3 === "XXX") {
        Winner = "X";
    }
    if (col1 === "OOO" || col2 === "OOO" || col3 === "OOO") {
        Winner = "O";
    }

    // check diagonal for win
    let x1 = TestBoard[0][0] + TestBoard[1][1] + TestBoard[2][2];
    let x2 = TestBoard[0][2] + TestBoard[1][1] + TestBoard[2][0];
    if (x1 === "XXX" || x2 === "XXX") {
        Winner = "X";
    }
    if (x1 === "OOO" || x2 === "OOO") {
        Winner = "O";
    }

    return Winner;
}

function CheckForWinner() {
    let Winner = TestForWin(gameState.board);
    gameState.Winner = Winner;
    if (Winner === "X") {
        gameState.XWinCount ++;
    }
    if (Winner === "O") {
        gameState.OWinCount ++;
    }
    if (Winner === "Tie") {
        gameState.TieWins ++;
    }

    // Return true if the a winner has been found.
    return (gameState.Winner.length > 0);
}

// Play the next players move
function AIPlayerMove() {
    let PlayLocations = [];
    let PlayLocation = { row: null, col: null };
    let NextPlayer = gameState.Next;

    // Strategy Steps - assumption  of all steps is that we test only empty locations

    // 1. Look for a winning location, by testing for a win.

    // 2. Look for a blocking move, by testing as other players for a win.

    // 3. If the center location is available, choose it.
    if (PlayLocations.length === 0 && gameState.board[1][1] === "") {
        PlayLocations.push({ row: 1, col: 1 });
    };

    // 4. Setup for a double potential win.

    // 5. randomly select a location
    if (PlayLocations.length === 0) {
        PlayLocations = gameState.board.reduce((accumulator, rowArray, rowIndex) => {
            // Call map on the rowArray to add any empty location to an array we are returning.
            return rowArray.reduce( (cellAccumulator, cell, colIndex) => {
                return (cell === "") ? cellAccumulator.concat( { row: rowIndex, col: colIndex} ) : cellAccumulator;
            }, accumulator );
        }, []);
    }
    if (PlayLocations.length > 0) {
        // randomly choose a location from your choices
        let index = Math.floor(Math.random() * PlayLocations.length);
        PlayLocation = { row: PlayLocations[index].row, col: PlayLocations[index].col };

        // asign the ai location
        gameState.board[PlayLocation.row][PlayLocation.col] = NextPlayer;
        // change the next X or O
        gameState.Next = gameState.Next === "X" ? "O" : "X";
        // remove the event from the grid so there is no new event
        document.getElementById(`${PlayLocation.row}${PlayLocation.col}`).removeEventListener('click', MainGameLogic);
        // Check to see if we have a winner
        if (CheckForWinner()) {
            // After we have a winner remove the events for remaining squares so they don't fire.
            for (let row = 0; row <= 2; row++) {
                for (let col = 0; col <= 2; col++) {
                    if (gameState.board[row][col] === "") {
                        document.getElementById(`${row}${col}`).removeEventListener('click', MainGameLogic);
                    }
                }
            }
        };
        SaveBoardState();
    };
    UpdateScreenState();
}
