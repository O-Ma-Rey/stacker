// PREPARATION - select element to interact with from HTML
// full stop helps it to know it's looking for a class
const grid = document.querySelector('.grid');
const stackBtn = document.querySelector('.stack');
const scoreCounter = document.querySelector('.score-counter');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameTxt = document.querySelector('.end-game-text');
const playAgainBtn = document.querySelector('.play-again');

// GRID MATRIX
const gridMatrix = [
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [1,1,1,0,0,0]
];

// VARIABLES TO KEEP TRACK OF
let currentRowIndex = gridMatrix.length - 1;
let barDirection = 'right';
let barSize = 3;
let gameOver = false;
let score = 0;

// FUNCTIONS
function draw() {
  // always reset first
  grid.innerHTML = '';

  gridMatrix.forEach(function(rowContent) {
    rowContent.forEach(function(cellContent) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      if (cellContent === 1) {
        cell.classList.add('bar');
      }

      grid.appendChild(cell);
    });

  });
}

// GAME LOGIC
function endGame(victory) {
  if (victory) {
    endGameTxt.innerHTML = 'YOU<br>WON';
    endGameScreen.classList.add('win');
  }

  endGameScreen.classList.remove('hidden');
}

function checkWin() {
  if (currentRowIndex === 0 && !gameOver) {
    gameOver = true;
    clearInterval(gameInterval);
    endGame(true);
  }
}

function checkLost() {
  const currentRow = gridMatrix[currentRowIndex];
  const prevRow = gridMatrix[currentRowIndex + 1];

  if (!prevRow) return;

  for (let i = 0; i < currentRow.length; i++) {
    if (currentRow[i] === 1 && prevRow[i] === 0) {
      currentRow[i] = 0;
      barSize--;
    }
    if (barSize === 0) {
      gameOver = true;
      clearInterval(gameInterval);
      endGame(false);
    }
  }
}

function updateScore() {
  score += barSize;
  scoreCounter.innerText = score.toString().padStart(5,0);
}

function onStack() {
  checkWin();
  checkLost();
  updateScore();

  if (gameOver) return;

  currentRowIndex--;
  barDirection = 'right';

  for (let i = 0; i< barSize; i++) {
    gridMatrix[currentRowIndex][i] = 1;
  }

  draw();
}

function moveRight(currentRow) {
  currentRow.pop();
  currentRow.unshift(0);
}

function moveLeft(currentRow) {
  currentRow.shift();
  currentRow.push(0);
}

function moveBar() {
  const currentRow = gridMatrix[currentRowIndex];
  
  if (barDirection === 'right') {
    moveRight(currentRow);
    const last = currentRow[currentRow.length - 1];
    if (last === 1) {
      barDirection = 'left';
    }
  }
  else if (barDirection === 'left') {
    moveLeft(currentRow);
    const first = currentRow[0];
    if (first === 1) {
      barDirection = 'right';
    }

  }

}

function onPlayAgain() {
  location.reload();
}

draw();

function main() {
  moveBar();
  draw();
}

// EVENTS
stackBtn.addEventListener('click', onStack);
const gameInterval = setInterval(main, 600);
playAgainBtn.addEventListener('click', onPlayAgain);