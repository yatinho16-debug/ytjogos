// Acessa os elementos HTML
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const gameContent = document.getElementById('game-content');
const startScreen = document.getElementById('start-screen');
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreValue = document.getElementById('score-value');
const easyButton = document.getElementById('easy');
const mediumButton = document.getElementById('medium');
const hardButton = document.getElementById('hard');

// Variáveis do jogo
const tileSize = 20;
let score = 0;
let snake = [{x: 10, y: 10}];
let food = {};
let dx = 0;
let dy = 0;
let isGameOver = false;
let gameLoop;
let gameSpeed = 150; // Velocidade inicial do jogo em milissegundos

// Funções do jogo

// Reinicia o jogo para o estado inicial
function resetGame() {
    score = 0;
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    isGameOver = false;
    scoreValue.textContent = score;
    gameContent.style.display = 'block';
    startScreen.style.display = 'none';
    restartButton.style.display = 'none';
    generateFood();
    clearInterval(gameLoop);
    gameLoop = setInterval(update, gameSpeed);
}

// Gera a posição da comida em um local aleatório
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / tileSize)),
        y: Math.floor(Math.random() * (canvas.height / tileSize))
    };
}

// Desenha a cobra e a comida no canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha a comida
    ctx.fillStyle = '#e74c3c'; // Vermelho vibrante
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

    // Desenha a cobra
    snake.forEach((segment, index) => {
        // Usa uma cor diferente para a cabeça
        ctx.fillStyle = (index === 0) ? '#2ecc71' : '#27ae60';
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });
}

// Atualiza a posição da cobra a cada frame
function update() {
    if (isGameOver) {
        clearInterval(gameLoop);
        return;
    }

    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    // Colisão com as bordas
    if (head.x < 0 || head.x >= canvas.width / tileSize || head.y < 0 || head.y >= canvas.height / tileSize) {
        endGame();
        return;
    }

    // Colisão com o próprio corpo
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
            return;
        }
    }

    snake.unshift(head);

    // Verifica se a cobra comeu a comida
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreValue.textContent = score;
        generateFood();
        
        // Aumenta a velocidade do jogo a cada 5 pontos
        if (score % 5 === 0 && gameSpeed > 50) {
            gameSpeed -= 5;
            clearInterval(gameLoop);
            gameLoop = setInterval(update, gameSpeed);
        }
    } else {
        snake.pop();
    }

    draw();
}

// Lógica de Fim de Jogo
function endGame() {
    isGameOver = true;
    alert("Fim de Jogo! Pontuação: " + score);
    restartButton.style.display = 'block';
}

// Controla o movimento da cobra
document.addEventListener('keydown', e => {
    switch(e.key) {
        case 'ArrowUp':
            if (dy === 1) return;
            dx = 0;
            dy = -1;
            break;
        case 'ArrowDown':
            if (dy === -1) return;
            dx = 0;
            dy = 1;
            break;
        case 'ArrowLeft':
            if (dx === 1) return;
            dx = -1;
            dy = 0;
            break;
        case 'ArrowRight':
            if (dx === -1) return;
            dx = 1;
            dy = 0;
            break;
    }
});

// Eventos dos botões
easyButton.addEventListener('click', () => startGame(250)); // Velocidade mais lenta
mediumButton.addEventListener('click', () => startGame(150)); // Velocidade média
hardButton.addEventListener('click', () => startGame(70)); // Velocidade mais rápida
startButton.addEventListener('click', () => resetGame());
restartButton.addEventListener('click', () => resetGame());

// Inicia o jogo com a velocidade escolhida
function startGame(speed) {
    gameSpeed = speed;
    startScreen.style.display = 'none';
    gameContent.style.display = 'block';
    generateFood();
    gameLoop = setInterval(update, gameSpeed);
}
// Acessa os elementos HTML do jogo
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');

// --- Configurações do Jogo e do Jogador ---
const player = {
    x: 50,
    y: canvas.height - 50,
    width: 40,
    height: 40,
    vy: 0,
    gravity: 0.5,
    jumpStrength: -10,
    isJumping: false
};

let obstacles = [];
let gameSpeed = 6;
let obstacleSpawnRate = 2000;

// --- Sistema de Pontuação e Dificuldade ---
let score = 0;
let scoreInterval;
let difficultyInterval;
let obstacleSpawnInterval;

// --- Funções de Desenho ---
function drawPlayer() {
    ctx.fillStyle = '#50b3a2';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Pontos: ${score}`, 10, 30);
}

// --- Lógica do Jogo ---
function update() {
    player.vy += player.gravity;
    player.y += player.vy;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.isJumping = false;
        player.vy = 0;
    }

    obstacles.forEach(obstacle => {
        obstacle.x -= gameSpeed;
    });

    if (obstacles.length > 0 && obstacles[0].x < -obstacles[0].width) {
        obstacles.shift();
    }
}

// --- Detecção de Colisão ---
function checkCollision() {
    obstacles.forEach(obstacle => {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            console.log("Game Over!");
            alert(`Game Over! Sua pontuação final foi: ${score}`);
            document.location.reload();
        }
    });
}

// --- Loop Principal do Jogo ---
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    update();
    checkCollision();

    drawPlayer();
    drawObstacles();
    drawScore();

    requestAnimationFrame(gameLoop);
}

// --- Funções de Dificuldade ---
function increaseDifficulty() {
    gameSpeed += 0.5;

    if (obstacleSpawnRate > 500) {
        obstacleSpawnRate -= 200;
        clearInterval(obstacleSpawnInterval);
        obstacleSpawnInterval = setInterval(createObstacles, obstacleSpawnRate);
    }

    console.log(`Dificuldade aumentada! Velocidade: ${gameSpeed.toFixed(1)}, Tempo de spawn: ${obstacleSpawnRate}ms`);
}

// --- Geração de Obstáculos ---
function createObstacles() {
    const numObstacles = Math.floor(Math.random() * 3) + 1;
    let lastObstacleX = canvas.width + 100;

    for (let i = 0; i < numObstacles; i++) {
        const distance = Math.random() * 300 + 200;
        const obstacleX = lastObstacleX + distance;

        const obstacle = {
            x: obstacleX,
            y: canvas.height - 40,
            width: 40,
            height: 40
        };
        obstacles.push(obstacle);
        lastObstacleX = obstacleX;
    }
}

// --- Evento de Pulo com Tecla ---
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !player.isJumping) {
        player.vy = player.jumpStrength;
        player.isJumping = true;
    }
});

// --- Evento do Botão de Reiniciar ---
restartButton.addEventListener('click', () => {
    document.location.reload();
});

// --- Iniciar o Jogo e a Contagem de Pontos ---
function startGame() {
    gameLoop();
    scoreInterval = setInterval(() => {
        score++;
    }, 1000);

    difficultyInterval = setInterval(increaseDifficulty, 10000);
    obstacleSpawnInterval = setInterval(createObstacles, obstacleSpawnRate);
}

// Inicia o jogo
startGame();
// Exemplo de código para o 'endGame'
function endGame() {
  isGameOver = true;
  clearInterval(gameLoop);

  // Exibe a tela de fim de jogo
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#e5e5e5';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Fim de Jogo!', canvas.width / 2, canvas.height / 2 - 30);
  ctx.fillText(`Pontuação: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
  restartButton.style.display = 'block';
}
