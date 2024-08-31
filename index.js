let player1 = { name: "", score: 0 };
let player2 = { name: "", score: 0 };
let fetchedCategory = [];
let categories = "";
let categoryItem = "";
let categoriesId = [];
let currentPlayer = player1;
const difficulty = ["easy", "easy", "medium", "medium", "hard", "hard"];
let currentDifficultyIndex = 0;
let winner = "";
const playerInfo = () => {
  player1.name = document.getElementById("player1-name").value;
  player2.name = document.getElementById("player2-name").value;
  console.log(player1.name);
  console.log(player2.name);

  document.getElementById("start-game").style.display = "none";
  document.getElementById("select-category").style.display = "block";
};

async function fetchCategory() {
  const response = await fetch("https://the-trivia-api.com/api/categories");
  fetchedCategory = await response.json();

  if (!fetchedCategory) {
    document.getElementById("error").style.display = "block";
    document.getElementById("error").innerHTML = "failed to fetch data";
    console.error("NA");
  }

  categories = document.getElementById("list");
  Object.keys(fetchedCategory).forEach((item) => {
    const list = document.createElement("li");
    list.style.listStyleType = "none";
    list.innerHTML = item;
    categories.appendChild(list);
    list.addEventListener("click", () => {
      categoryItem = item;
      fetchQuestion(currentPlayer, "easy");
      console.log(categoryItem);
      document.getElementById("select-category").style.display = "none";
      document.getElementById("start-quiz").style.display = "block";
    });
  });
}

const startGame = async () => {
  playerInfo();
  await fetchCategory();
};

async function fetchQuestion() {
  if (currentDifficultyIndex >= difficulty.length) {
    return endGame();
  } else {
    document.getElementById("currentPlayer").innerText = currentPlayer.name;
    document.getElementById("currentLevel").innerText =
      difficulty[currentDifficultyIndex];
    const response = await fetch(
      `https://the-trivia-api.com/v2/questions?difficulties=${difficulty[currentDifficultyIndex]}&categories=${encodeURIComponent(categoryItem)}&limit=1`
    );
    const question = await response.json();
    let answers = [];
    question.forEach((que) => {
      console.log(que);
      document.getElementById("question").innerHTML = que.question.text;
      que.incorrectAnswers.forEach((ans) => {
        answers.push(ans);
      });
      answers.push(que.correctAnswer);
      answers.sort();
      const options = document.getElementById("answer");
      options.innerHTML = "";
      answers.forEach((ans) => {
        const option = document.createElement("button");
        option.innerHTML = ans;
        option.value = ans;
        options.appendChild(option);
        option.addEventListener("click", () => {
          console.log(ans);

          if (que.correctAnswer === ans) {
            if (difficulty[currentDifficultyIndex] === "easy") {
              currentPlayer.score += 10;
            } else if (difficulty[currentDifficultyIndex] === "medium") {
              currentPlayer.score += 15;
            } else {
              currentPlayer.score += 20;
            }
          }

          console.log(currentPlayer);

          currentPlayer = currentPlayer === player1 ? player2 : player1;
          currentDifficultyIndex++;
          fetchQuestion();

          // console.log(`${currentPlayer.name}'s score:`, currentPlayer.score);
        });
      });
    });

    console.log("currentPlayer", currentPlayer.name);
    console.log("currentindex", currentDifficultyIndex);
    console.log("currentlevel", difficulty[currentDifficultyIndex]);
  }

  // if (currentDifficultyIndex === difficulty.length-1) {
  //   fetchQuestion(difficulty[currentDifficultyIndex]);
  // }
}

const result = () => {
  if (player1.score > player2.score) {
    winner = player1.name;
  } else if (player2.score > player1.score) {
    winner = player2.name;
  } else winner = "Tie";
  const result = document.getElementById("score");
  result.innerHTML = `${player1.name}'s score:${player1.score} | ${player2.name}'s score:${player2.score}`;
  document.getElementById("winner").innerHTML = `${winner} won game`;
};

const endGame = () => {
  document.getElementById("start-quiz").style.display = "none";
  document.getElementById("result-div").style.display = "block"
  console.log("GameOver");
  
  result();
  const value = document.getElementById('next').style.display = "block";
  continueGame();

};

const continueGame = () => {
  document.getElementById("restart").addEventListener("click",()=>{
location.reload()
  })
  
  // fetchedCategory = fetchedCategory.filter(item => item !== categoryItem);
  // console.log(fetchedCategory);
};



