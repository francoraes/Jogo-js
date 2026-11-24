
/* =================================
   ELEMENTOS DO HTML
================================= */

const game = document.querySelector(".game");

const steve = document.getElementById("steve");
const creeper = document.getElementById("creeper");

const scoreElement = document.getElementById("score");
const speedElement = document.getElementById("speed");

const gameOverScreen = document.getElementById("game-over-screen");
const finalScoreElement = document.getElementById("final-score");

const timerBar = document.getElementById("timer-bar");
const timerCount = document.getElementById("timer-count");
const timerText = document.getElementById("timer-text");

const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");

const quizSection = document.getElementById("quiz-section");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const feedbackElement = document.getElementById("feedback");

const resultSection = document.getElementById("result-section");
const resultScore = document.getElementById("result-score");
const restartButton = document.getElementById("restart-button");


/* =================================
   VARIÁVEIS DO JOGO
================================= */

let gameOver = false;
let gameStarted = false;
let isJumping = false;

let score = 0;
let startTime = 0;
let elapsedTime = 0;

let speedMultiplier = 1;

let spawnTimeout;
let scoreInterval;
let timerInterval;
let retryTimeout;
let resumeTimeout;

let questionIndex = 0;
let currentQuestion = null;

const TIMER_DURATION = 10000;


/* =================================
   BANCO DE PERGUNTAS
================================= */

const questions = [

    {
        question: "Qual é a capital do Brasil?",
        answers: ["São Paulo", "Brasília", "Rio de Janeiro"],
        correct: 1
    },

    {
        question: "Quantos planetas existem no Sistema Solar?",
        answers: ["7", "8", "9"],
        correct: 1
    },

    {
        question: "Qual é o maior planeta do Sistema Solar?",
        answers: ["Terra", "Saturno", "Júpiter"],
        correct: 2
    },

    {
        question: "Quanto é 7 x 8?",
        answers: ["54", "56", "64"],
        correct: 1
    },

    {
        question: "Qual animal é conhecido como rei da selva?",
        answers: ["Leão", "Tigre", "Elefante"],
        correct: 0
    },

    {
        question: "Qual é o maior oceano do mundo?",
        answers: ["Atlântico", "Índico", "Pacífico"],
        correct: 2
    },

    {
        question: "Quem pintou a Mona Lisa?",
        answers: ["Pablo Picasso", "Leonardo da Vinci", "Van Gogh"],
        correct: 1
    },

    {
        question: "Quantos lados tem um hexágono?",
        answers: ["5", "6", "8"],
        correct: 1
    },

    {
        question: "Qual é o planeta conhecido como planeta vermelho?",
        answers: ["Marte", "Vênus", "Mercúrio"],
        correct: 0
    },

    {
        question: "Qual é o maior animal do mundo?",
        answers: ["Elefante africano", "Baleia-azul", "Tubarão-branco"],
        correct: 1
    },

    {
        question: "Em qual continente fica o Egito?",
        answers: ["Ásia", "Europa", "África"],
        correct: 2
    },

    {
        question: "Quantos minutos tem uma hora?",
        answers: ["60", "100", "30"],
        correct: 0
    },

    {
        question: "Qual é a fórmula química da água?",
        answers: ["CO2", "H2O", "O2"],
        correct: 1
    },

    {
        question: "Qual é o idioma oficial do Brasil?",
        answers: ["Espanhol", "Inglês", "Português"],
        correct: 2
    },

    {
        question: "Qual é o satélite natural da Terra?",
        answers: ["Lua", "Sol", "Marte"],
        correct: 0
    }

];


/* =================================
   EMBARALHAR PERGUNTAS
================================= */

function shuffleQuestions() {

    for (let i = questions.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [questions[i], questions[j]] =
            [questions[j], questions[i]];

    }

}

shuffleQuestions();


/* =================================
   INICIAR O JOGO
================================= */

function startGame() {

    clearTimeout(spawnTimeout);
    clearTimeout(retryTimeout);
    clearTimeout(resumeTimeout);

    clearInterval(scoreInterval);
    clearInterval(timerInterval);

    gameOver = false;
    gameStarted = true;
    isJumping = false;

    score = 0;
    elapsedTime = 0;
    speedMultiplier = 1;

    questionIndex = 0;

    shuffleQuestions();

    steve.classList.remove("jump");
    creeper.classList.remove("creeper-run");

    startScreen.style.display = "none";
    gameOverScreen.style.display = "none";

    quizSection.style.display = "none";
    resultSection.style.display = "none";

    creeper.style.left = "580px";

    updateScore();

    // Inicia o cronômetro de pontuação

    startTime = Date.now();

    scoreInterval = setInterval(updateScore, 100);

    // Primeiro Creeper aparece após 1 segundo

    spawnTimeout = setTimeout(startCreeper, 1000);

}


/* =================================
   SISTEMA DE PONTUAÇÃO
================================= */

function updateScore() {

    if (gameOver || !gameStarted) {
        return;
    }

    elapsedTime = (Date.now() - startTime) / 1000;

    // 10 pontos por segundo

    score = Math.floor(elapsedTime * 10);

    scoreElement.textContent = "Pontos: " + score;

    // A cada 10 segundos o jogo fica mais rápido

    const difficultyLevel = Math.floor(elapsedTime / 10);

    speedMultiplier = Math.min(
        2.5,
        1 + difficultyLevel * 0.15
    );

    speedElement.textContent =
        "Velocidade: " + speedMultiplier.toFixed(2) + "x";

}


/* =================================
   SISTEMA DE PULO
================================= */

function jump() {

    if (gameOver || !gameStarted || isJumping) {
        return;
    }

    isJumping = true;

    steve.classList.add("jump");

}


steve.addEventListener("animationend", function(event) {

    if (event.animationName === "jump") {

        steve.classList.remove("jump");

        isJumping = false;

    }

});


/* =================================
   MOVIMENTAÇÃO DO CREEPER
================================= */

function startCreeper() {

    if (gameOver || !gameStarted) {
        return;
    }

    creeper.classList.remove("creeper-run");

    // Posição inicial aleatória

    const startPosition =
        game.clientWidth + Math.floor(Math.random() * 101);

    // Velocidade base aleatória

    const baseDuration = Math.random() * 1.5 + 3.5;

    // Quanto maior a dificuldade, menor a duração

    const duration = Math.max(
        1.4,
        baseDuration / speedMultiplier
    );

    creeper.style.setProperty(
        "--start-left",
        startPosition + "px"
    );

    creeper.style.setProperty(
        "--duration",
        duration + "s"
    );

    creeper.style.left = startPosition + "px";

    // Reinicia a animação

    void creeper.offsetWidth;

    creeper.classList.add("creeper-run");

}


/* =================================
   FINAL DA ANIMAÇÃO DO CREEPER
================================= */

creeper.addEventListener("animationend", function(event) {

    if (event.animationName !== "block") {
        return;
    }

    creeper.classList.remove("creeper-run");

    if (!gameOver && gameStarted) {

        const delay = Math.random() * 1000 + 400;

        spawnTimeout = setTimeout(startCreeper, delay);

    }

});


/* =================================
   DETECTAR COLISÃO
================================= */

function checkCollision() {

    if (gameOver || !gameStarted) {
        return;
    }

    if (!creeper.classList.contains("creeper-run")) {
        return;
    }

    const steveRect = steve.getBoundingClientRect();

    const creeperRect = creeper.getBoundingClientRect();

    const collision =

        steveRect.right > creeperRect.left + 5 &&
        steveRect.left < creeperRect.right - 5 &&
        steveRect.bottom > creeperRect.top + 5 &&
        steveRect.top < creeperRect.bottom - 5;

    if (collision) {

        die();

    }

}


/* =================================
   GAME OVER
================================= */

function die() {

    if (gameOver) {
        return;
    }

    gameOver = true;

    // Para o cronômetro de pontos

    clearInterval(scoreInterval);

    // Para o aparecimento dos Creepers

    clearTimeout(spawnTimeout);

    // Interrompe animações

    creeper.classList.remove("creeper-run");

    steve.classList.remove("jump");

    isJumping = false;

    // Mostra pontuação final

    finalScoreElement.textContent =
        "Pontuação: " + score;

    // Mostra tela de Game Over

    gameOverScreen.style.display = "flex";

    // Abre o questionário

    showQuestion();

    // Inicia o tempo para responder

    startTimer();

}


/* =================================
   CRONÔMETRO PARA CONTINUAR
================================= */

function startTimer() {

    let remainingTime = TIMER_DURATION;

    timerBar.style.width = "100%";

    timerCount.textContent = "10 segundos";

    timerText.textContent =
        "Responda antes que o tempo acabe!";

    clearInterval(timerInterval);

    timerInterval = setInterval(function() {

        remainingTime -= 100;

        const percentage =
            (remainingTime / TIMER_DURATION) * 100;

        timerBar.style.width = percentage + "%";

        timerCount.textContent =
            Math.ceil(remainingTime / 1000) + " segundos";

        // Muda a cor conforme o tempo acaba

        if (remainingTime <= 3000) {

            timerBar.style.background = "#e53935";

        } else if (remainingTime <= 6000) {

            timerBar.style.background = "#ff9800";

        }

        if (remainingTime <= 0) {

            clearInterval(timerInterval);

            finishGame();

        }

    }, 100);

}


/* =================================
   MOSTRAR PERGUNTA
================================= */

function showQuestion() {

    // Reinicia o banco quando todas forem utilizadas

    if (questionIndex >= questions.length) {

        questionIndex = 0;

        shuffleQuestions();

    }

    currentQuestion = questions[questionIndex];

    questionElement.textContent = currentQuestion.question;

    answersElement.innerHTML = "";

    feedbackElement.textContent = "";

    quizSection.style.display = "block";

    // Cria os botões

    currentQuestion.answers.forEach(function(answer, index) {

        const button = document.createElement("button");

        button.textContent = answer;

        button.addEventListener("click", function() {

            checkAnswer(index);

        });

        answersElement.appendChild(button);

    });

}



/* =================================
   VERIFICAR RESPOSTA DO JOGADOR
================================= */

function checkAnswer(selected) {

    // Impede responder novamente depois da primeira tentativa
    if (!gameOver) {
        return;
    }

    // Desativa todos os botões após escolher uma resposta
    const buttons = answersElement.querySelectorAll("button");

    buttons.forEach(function(button) {
        button.disabled = true;
    });

    // Verifica se a resposta escolhida está correta
    if (selected === currentQuestion.correct) {

        feedbackElement.textContent =
            "Correto! Você pode continuar!";

        feedbackElement.style.color = "green";

        // Cancela o cronômetro de sobrevivência
        clearInterval(timerInterval);

        // Avança para a próxima pergunta
        questionIndex++;

        // Aguarda um instante antes de retornar ao jogo
        resumeTimeout = setTimeout(function() {
            resumeGame();
        }, 700);

    } else {

        // Caso erre, informa qual era a resposta correta
        feedbackElement.textContent =
            "Errado! A resposta correta era: " +
            currentQuestion.answers[currentQuestion.correct];

        feedbackElement.style.color = "red";

        // Cancela o tempo para continuar
        clearInterval(timerInterval);

        // Encerra a partida após mostrar o feedback
        resumeTimeout = setTimeout(function() {
            finishGame();
        }, 1500);

    }

}


/* =================================
   CONTINUAR O JOGO
================================= */

function resumeGame() {

    if (!gameOver) {
        return;
    }

    gameOver = false;

    gameOverScreen.style.display = "none";

    quizSection.style.display = "none";

    // Reinicia o movimento do Creeper

    creeper.classList.remove("creeper-run");

    creeper.style.left = "580px";

    // Reinicia o cronômetro de pontos sem zerar a pontuação

    startTime = Date.now() - (elapsedTime * 1000);

    scoreInterval = setInterval(updateScore, 100);

    // Dá um pequeno intervalo antes do próximo obstáculo

    spawnTimeout = setTimeout(function() {

        startCreeper();

    }, 1000);

}


/* =================================
   FIM DEFINITIVO DO JOGO
================================= */

function finishGame() {

    gameOver = true;
    gameStarted = false;

    clearInterval(scoreInterval);

    clearInterval(timerInterval);

    clearTimeout(spawnTimeout);
    clearTimeout(retryTimeout);
    clearTimeout(resumeTimeout);

    creeper.classList.remove("creeper-run");

    steve.classList.remove("jump");

    isJumping = false;

    // Informa que o tempo acabou

    timerText.textContent = "Tempo esgotado!";

    timerCount.textContent = "0 segundos";

    finalScoreElement.textContent =
        "Pontuação final: " + score;

    // Mostra resultado final

    gameOverScreen.style.display = "none";

    quizSection.style.display = "none";

    resultSection.style.display = "block";

    resultScore.textContent =
        "Você conseguiu " + score + " pontos!";

}


/* =================================
   CONTROLES DO TECLADO
================================= */

document.addEventListener("keydown", function(event) {

    if (event.code === "Space" || event.code === "ArrowUp") {

        event.preventDefault();

        if (!event.repeat) {

            jump();

        }

    }

});


/* =================================
   BOTÕES
================================= */

startButton.addEventListener("click", function() {

    startGame();

});


restartButton.addEventListener("click", function() {

    startGame();

});


/* =================================
   VERIFICAR COLISÕES
================================= */

setInterval(checkCollision, 10);
