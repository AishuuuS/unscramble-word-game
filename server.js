const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

const LEADERBOARD_FILE = path.join(__dirname, "leaderboard.json");

// load the leaderboard from initial file
let leaderboard = [];
if (fs.existsSync(LEADERBOARD_FILE)) {
  const data = fs.readFileSync(LEADERBOARD_FILE, "utf-8");
  leaderboard = JSON.parse(data);
}

// display top 5 scores
app.get("/leaderboard", (req, res) => {
  const top5 = leaderboard
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  res.json(top5);
});


// post the score on the leaderboard
app.post("/submit-score", (req, res) => {
  const { name, score } = req.body;
  if (!name || typeof score !== "number") {
    return res.status(400).json({ error: "Invalid data" });
  }

  leaderboard.push({ name, score });
  fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(leaderboard, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
