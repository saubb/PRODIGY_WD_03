const board = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
let gameActive = true;
// let singlePlayer = true;

const modeToggle = document.getElementById('modeToggle');

const restartButton = document.getElementById('restartButton');
let currentPlayer = 'X';
let gameState = Array(9).fill('');
const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

let singlePlayer = true; // You can toggle mode

function handleCellClick(e) {
  const idx = [...board].indexOf(e.target);
  if (gameState[idx] || checkWinner() || !gameActive) return;

  playerMove(idx);
}

function playerMove(idx) {
  gameState[idx] = currentPlayer;
  board[idx].textContent = currentPlayer;
  board[idx].classList.add(currentPlayer === 'X' ? 'x-move' : 'o-move');
  evaluateAfterMove();
}

function evaluateAfterMove() {
  let winner = checkWinner();
  if (winner) return endGame(winner);
  if (!gameState.includes('')) return endGame('draw');

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDisplay.textContent = `${currentPlayer}'s turn`;

  if (singlePlayer && currentPlayer === 'O') {
    const move = bestMove();
    playerMove(move);
  }
}

// Minimax AI
function bestMove() {
  return minimax(gameState, 'O').index;
}

function minimax(newState, player) {
  const avail = newState.reduce((arr, v, i) => !v ? arr.concat(i) : arr, []);
  if (checkStaticWin(newState, 'X')) return {score: -10};
  if (checkStaticWin(newState, 'O')) return {score: 10};
  if (!avail.length) return {score: 0};

  const moves = [];
  for (let i of avail) {
    let move = {index: i};
    newState[i] = player;
    let res = minimax(newState, player === 'O' ? 'X' : 'O');
    move.score = res.score;
    newState[i] = '';
    moves.push(move);
  }

  return player === 'O'
    ? moves.reduce((a,b) => a.score > b.score ? a : b)
    : moves.reduce((a,b) => a.score < b.score ? a : b);
}

function checkStaticWin(state, p) {
  return winPatterns.some(([a,b,c]) =>
    state[a] === p && state[b] === p && state[c] === p
  );
}

function checkWinner() {
  const winner = winPatterns.find(([a,b,c]) =>
    gameState[a] && gameState[a] === gameState[b] && gameState[b] === gameState[c]
  );
  if (winner) return gameState[winner[0]];
  return null;
}

function endGame(winner) {
  gameActive = false;
  if (winner === 'draw') {
    statusDisplay.textContent = "It's a draw!";
  } else {
    statusDisplay.textContent = `Hurray! ${winner} wins!`;
    highlightWin(winner);
    celebrateWinner();
  }
}

function highlightWin(p) {
  for (let [a,b,c] of winPatterns) {
    if (gameState[a] === p && gameState[b] === p && gameState[c] === p) {
      board[a].classList.add('win');
      board[b].classList.add('win');
      board[c].classList.add('win');
    }
  }
}

function restartGame() {
  gameActive = true;
  currentPlayer = 'X';
  gameState.fill('');
  board.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('win', 'x-move', 'o-move');
  });
  statusDisplay.textContent = "X's turn";
  clearCanvas();
}

board.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
// let gameActive = true;
statusDisplay.textContent = "X's turn";

// Confetti & Canvas
function celebrateWinner() {
  // existing particle code
}

function clearCanvas() {
  const canvas = document.getElementById('confettiCanvas');  
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

modeToggle.addEventListener('click', () => {
  singlePlayer = !singlePlayer;
  restartGame(); // Restart game when mode changes
  modeToggle.textContent = singlePlayer ? 'Switch to 2‑Player' : 'Switch to 1‑Player';
  statusDisplay.textContent = "X's turn";
});

statusDisplay.textContent = singlePlayer 
  ? "You vs Computer (X's turn)" 
  : `${currentPlayer}'s turn (2P mode)`;
