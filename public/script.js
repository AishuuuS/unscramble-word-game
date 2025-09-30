const words = ["banana", "javascript", "computer", "apple", "school", "puzzle"];
let currentWord = "";
let scrambled = "";
let score = 0;
let time = 60;
let timer;

function startGame() {
  pickWord();
  timer = setInterval(() => {
    time--;
    document.getElementById("timer").textContent = "Time: " + time;
    if (time <= 0) {
      clearInterval(timer);
      document.getElementById("result").textContent = "⏰ Time’s up! Final Score: " + score;
    }
  }, 1000);
}

function pickWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  scrambled = scramble(currentWord);
  document.getElementById("scrambled").textContent = scrambled;
}

function scramble(word) {
  return word.split("").sort(() => Math.random() - 0.5).join("");
}

function checkGuess() {
  const guess = document.getElementById("guess").value.trim().toLowerCase();
  if (guess === currentWord) {
    score++;
    document.getElementById("score").textContent = score;
    document.getElementById("result").textContent = "✅ Correct!";
    document.getElementById("guess").value = "";
    pickWord();
  } else {
    document.getElementById("result").textContent = "❌ Try again!";
  }
}

startGame();
