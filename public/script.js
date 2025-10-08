let words = [];
let currentWord = "";
let scrambled = "";
let score = 0;
let time = 0;
let timer = null;
let currentCategory = "";

// Start game after category selection
async function startGame(category) {
  currentCategory = category;
  document.getElementById("home-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";

  const guessInput = document.getElementById("guess");
  guessInput.disabled = true;
  document.querySelector("#game-screen button").disabled = true;

  guessInput.value = "";
  document.getElementById("result").textContent = "";

  // Load words for the selected category
  const res = await fetch("words.json");
  const allWords = await res.json();
  words = allWords[category];

  score = 0;
  time = 60;
  document.getElementById("score").textContent = score;

  // 3-second countdown before game
  let countdown = 3;
  document.getElementById("timer").textContent = "Starting in: " + countdown;

  const countdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      document.getElementById("timer").textContent = "Starting in: " + countdown;
    } else {
      clearInterval(countdownInterval);
      guessInput.disabled = false;
      document.querySelector("#game-screen button").disabled = false;
      pickWord();
      document.getElementById("timer").textContent = "Time: " + time;

      // Start game timer
      clearInterval(timer);
      timer = setInterval(() => {
        time--;
        document.getElementById("timer").textContent = "Time: " + time;
        if (time <= 0) {
          clearInterval(timer);
          document.getElementById("timer").textContent = "Time: 0";
          document.getElementById("result").textContent =
            "⏰ Time's up! Final Score: " + score;
          guessInput.disabled = true;
          document.querySelector("#game-screen button").disabled = true;

          // Prompt for name and submit score
          let playerName = prompt("Enter your name for the leaderboard:");
          if (playerName) {
            fetch("/submit-score", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: playerName, score: Number(score) })
            }).then(() => showLeaderboard());
          }
        }
      }, 1000);
    }
  }, 1000);
}

// Pick a random word and scramble it
function pickWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  scrambled = scramble(currentWord);
  while (scrambled === currentWord && currentWord.length > 1)
    scrambled = scramble(currentWord);
  document.getElementById("scrambled").textContent = scrambled;
  document.getElementById("guess").value = "";
}

// Shuffle letters
function scramble(word) {
  return word.split("").sort(() => Math.random() - 0.5).join("");
}

// Check guess
function checkGuess() {
  const guess = document.getElementById("guess").value.trim().toLowerCase();
  const gameScreen = document.getElementById("game-screen");

  if (guess === currentWord.toLowerCase()) {
    score++;
    document.getElementById("score").textContent = score;
    document.getElementById("result").textContent = "✅ Correct!";

    // Flash green
    gameScreen.classList.add("flash-correct");
    setTimeout(() => gameScreen.classList.remove("flash-correct"), 600);

    pickWord();
  } else {
    document.getElementById("result").textContent = "❌ Try again!";

    // Flash red
    gameScreen.classList.add("flash-wrong");
    setTimeout(() => gameScreen.classList.remove("flash-wrong"), 600);
  }
}

// Submit guess with Enter key
document.getElementById("guess").addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkGuess();
});

// Go back to home screen
function goHome() {
  clearInterval(timer);
  document.getElementById("game-screen").style.display = "none";
  document.getElementById("home-screen").style.display = "block";
  document.getElementById("result").textContent = "";
}

// Leaderboard
function showLeaderboard() {
  document.getElementById("game-screen").style.display = "none";
  document.getElementById("home-screen").style.display = "none";
  document.getElementById("leaderboard-screen").style.display = "block";

  fetch("/leaderboard")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("leaderboard-list");
      tbody.innerHTML = "";

      if (data.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 3;
        td.textContent = "No scores yet!";
        td.style.padding = "1rem";
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
      }

      data.forEach((player, index) => {
        const tr = document.createElement("tr");

        const rankTd = document.createElement("td");
        let medal = "";
        if (index === 0) medal = "🥇";
        else if (index === 1) medal = "🥈";
        else if (index === 2) medal = "🥉";
        rankTd.textContent = medal || index + 1;

        const nameTd = document.createElement("td");
        nameTd.textContent = player.name;

        const scoreTd = document.createElement("td");
        scoreTd.textContent = player.score;

        tr.appendChild(rankTd);
        tr.appendChild(nameTd);
        tr.appendChild(scoreTd);

        tbody.appendChild(tr);
      });
    });
}

// Back from leaderboard to home
function goHomeFromLeaderboard() {
  document.getElementById("leaderboard-screen").style.display = "none";
  document.getElementById("home-screen").style.display = "block";
}
