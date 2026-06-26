// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let timerInterval; // Will store the countdown timer
let score = 0; // Tracks the player's points
let timeLeft = 30; // Countdown time in seconds
let dropCount = 0; // Tracks how many drops have spawned

const gameContainer = document.getElementById("game-container");

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);
gameContainer.addEventListener("pointerdown", handleDropHit);

function updateScore() {
  document.getElementById("score").textContent = score;
}

function updateTimer() {
  document.getElementById("time").textContent = timeLeft;
}

function handleDropHit(event) {
  const drop = event.target.closest(".water-drop");

  if (!drop || !gameRunning) return;

  if (drop.classList.contains("bad-drop")) {
    score -= 2;
  } else {
    score += 1;
  }

  updateScore();
  drop.remove();
}

function showResultPopup() {
  const popup = document.getElementById("result-popup");
  const title = document.getElementById("result-title");
  const message = document.getElementById("result-message");

  if (score > 40) {
    title.textContent = "Good Job!";
    message.textContent = "You collected enough water to complete Charity Water's mission!";
  } else {
    title.textContent = "Mission failed!";
    message.textContent = "You did not collect enough water.";
  }

  popup.classList.remove("hidden");
}

function endGame() {
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  gameRunning = false;

  const gameContainer = document.getElementById("game-container");
  gameContainer.querySelectorAll(".water-drop").forEach((drop) => drop.remove());

  showResultPopup();
  document.getElementById("start-btn").textContent = "Start Game";
}

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  score = 0;
  timeLeft = 30;
  dropCount = 0;
  updateScore();
  updateTimer();

  const gameContainer = document.getElementById("game-container");
  gameContainer.querySelectorAll(".water-drop").forEach((drop) => drop.remove());

  gameRunning = true;
  document.getElementById("result-popup").classList.add("hidden");
  document.getElementById("start-btn").textContent = "Playing...";

  // Create new drops every 400 milliseconds
  dropMaker = setInterval(createDrop, 400);

  // Count down the timer once per second
  timerInterval = setInterval(() => {
    timeLeft -= 1;
    updateTimer();

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function createDrop() {
  dropCount += 1;

  // Water drops
  const drop = document.createElement("div");
  drop.className = "water-drop";

  if (dropCount % 10 === 0) {
    drop.classList.add("bad-drop");
  }

  // Make drops different sizes for visual variety
  const initialSize = 30; // Base size in pixels
  const sizeMultiplier = Math.random() * 1.8 + 0.6;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 6 seconds
  drop.style.animationDuration = "6s";

  // Add the new drop to the game screen
  gameContainer.appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}

updateScore();
updateTimer();
