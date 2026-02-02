const apiUrl = "https://rpslsgame-gycwb0ctbbhveab9.westus3-01.azurewebsites.net/Game/GetCpuChoice";

let gameMode = 'cpu';
let winsNeeded = 1;
let p1Score = 0;
let p2Score = 0;

let currentPlayer = 1;
let p1Choice = "";

function goHome() {
    resetScores();
    showScreen('homePage');
}

function goToModeSelect(mode) {
    gameMode = mode;
    showScreen('roundPage');
}

function startGame(rounds) {
    winsNeeded = rounds;
    resetScores();
    currentPlayer = 1;

    document.getElementById('targetScore').innerText = winsNeeded;

    if (gameMode === 'cpu') {
        document.getElementById('cpuName').innerHTML = "CPU: <span id='player2Score'>0</span>";
        document.getElementById('cpuLabel').innerText = "CPU";
        updateInstruction("Choose your move:");
    } else {
        document.getElementById('cpuName').innerHTML = "P2: <span id='player2Score'>0</span>";
        document.getElementById('cpuLabel').innerText = "Player 2";
        updateInstruction("Player 1's Turn - Choose your move:");
    }

    showScreen('gamePage');
}

function showScreen(pageId) {
    document.querySelectorAll('.page').forEach(function (p) {
        p.classList.remove('show');
        p.classList.add('hide');
    });

    const target = document.getElementById(pageId);
    if (target) {
        target.classList.remove('hide');
        target.classList.add('show');
    }
}

function updateInstruction(text) {
    document.getElementById('instructionText').innerText = text;
}

function handleMove(choice) {
    if (gameMode === 'cpu') {
        playCpuRound(choice);
    } else {
        playPvPRound(choice);
    }
}

async function playCpuRound(userChoice) {
    try {
        const response = await fetch(apiUrl);
        let cpuChoice = await response.text();
        cpuChoice = cpuChoice.replace(/"/g, '').trim();

        const result = checkWinner(userChoice, cpuChoice);

        if (result.winner === 'user') p1Score++;
        if (result.winner === 'cpu') p2Score++;

        displayResult(userChoice, cpuChoice, result);
    } catch (error) {
        const choices = ['Rock', 'Paper', 'Scissors', 'Lizard', 'Spock'];
        const random = choices[Math.floor(Math.random() * choices.length)];
        const result = checkWinner(userChoice, random);
        displayResult(userChoice, random, result);
    }
}

function playPvPRound(choice) {
    if (currentPlayer === 1) {
        p1Choice = choice;
        currentPlayer = 2;

        document.getElementById('nextPlayerName').innerText = "Player 2";
        showScreen('switchPage');
    } else {
        const p2Choice = choice;
        const result = checkWinner(p1Choice, p2Choice);

        if (result.winner === 'user') p1Score++;
        if (result.winner === 'cpu') p2Score++;

        displayResult(p1Choice, p2Choice, result);
    }
}

function startTurn() {
    updateInstruction("Player " + currentPlayer + "'s Turn - Choose your move:");
    showScreen('gamePage');
}

function displayResult(p1Move, p2Move, resultData) {
    document.getElementById("winText").innerText = resultData.title;
    document.getElementById("whyText").innerText = resultData.message;
    document.getElementById("player1Score").innerText = p1Score;
    document.getElementById("player2Score").innerText = p2Score;

    showScreen("resultPage");
}

function nextRound() {
    if (p1Score >= winsNeeded) {
        const winnerName = (gameMode === 'cpu') ? "You" : "Player 1";
        alert("CONGRATULATIONS! " + winnerName + " won the match!");
        goHome();
    } else if (p2Score >= winsNeeded) {
        const winnerName = (gameMode === 'cpu') ? "CPU" : "Player 2";
        alert("GAME OVER! " + winnerName + " won the match!");
        goHome();
    } else {
        currentPlayer = 1;
        if (gameMode === 'pvp') {
            updateInstruction("Player 1's Turn - Choose your move:");
        } else {
            updateInstruction("Choose your move:");
        }
        showScreen("gamePage");
    }
}

function resetScores() {
    p1Score = 0;
    p2Score = 0;
    currentPlayer = 1;
    document.getElementById("player1Score").innerText = 0;
    document.getElementById("player2Score").innerText = 0;
}

function checkWinner(p1, p2) {
    p1 = p1.toLowerCase();
    p2 = p2.toLowerCase();

    if (p1 === p2) {
        return { title: "It's a Tie!", message: "Great minds think alike.", winner: 'draw' };
    }

    if (
        (p1 === "rock" && (p2 === "scissors" || p2 === "lizard")) ||
        (p1 === "paper" && (p2 === "rock" || p2 === "spock")) ||
        (p1 === "scissors" && (p2 === "paper" || p2 === "lizard")) ||
        (p1 === "lizard" && (p2 === "spock" || p2 === "paper")) ||
        (p1 === "spock" && (p2 === "scissors" || p2 === "rock"))
    ) {
        return { title: "Player 1 Wins!", message: capitalize(p1) + " beats " + capitalize(p2), winner: 'user' };
    }

    const p2Name = (gameMode === 'cpu') ? "CPU" : "Player 2";
    return { title: p2Name + " Wins!", message: capitalize(p2) + " beats " + capitalize(p1), winner: 'cpu' };
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

// BUTTON LISTENERS
document.getElementById('cpuBtn').addEventListener('click', function () { goToModeSelect('cpu'); });
document.getElementById('pvpBtn').addEventListener('click', function () { goToModeSelect('pvp'); });
document.getElementById('rulesBtn').addEventListener('click', function () { showScreen('rulesPage'); });
document.getElementById('homeFromRulesBtn').addEventListener('click', function () { goHome(); });
document.getElementById('round1Btn').addEventListener('click', function () { startGame(1); });
document.getElementById('round3Btn').addEventListener('click', function () { startGame(3); });
document.getElementById('round4Btn').addEventListener('click', function () { startGame(4); });
document.getElementById('backBtn').addEventListener('click', function () { goHome(); });
document.getElementById('readyBtn').addEventListener('click', function () { startTurn(); });

document.getElementById('rockBtn').addEventListener('click', function () { handleMove('Rock'); });
document.getElementById('paperBtn').addEventListener('click', function () { handleMove('Paper'); });
document.getElementById('scissorsBtn').addEventListener('click', function () { handleMove('Scissors'); });
document.getElementById('lizardBtn').addEventListener('click', function () { handleMove('Lizard'); });
document.getElementById('spockBtn').addEventListener('click', function () { handleMove('Spock'); });

document.getElementById('nextRoundBtn').addEventListener('click', function () { nextRound(); });
document.getElementById('quitBtn').addEventListener('click', function () { goHome(); });
