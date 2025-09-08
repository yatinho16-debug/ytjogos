// Acessa os elementos HTML do jogo
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const startScreen = document.getElementById('start-screen');
const gameContent = document.getElementById('game-content');
const restartButton = document.getElementById('restartButton'); // Adicionado para a função endGame

// --- Configurações do Jogo e do Jogador ---
const player = {
    x: 50,
    y: canvas.height - 50,
    width: 40,
    height: 40,
    vy: 0,
    gravity: 0.5,
    jumpStrength: -10,
    isJumping: false,
    rotation: 0
};

let obstacles = [];
let gameSpeed = 8; // Velocidade inicial aumentada
let score = 0;
let isGameOver = false;

// Variáveis para controlar o aumento de dificuldade
let difficultyIncreaseInterval = 10;
let lastDifficultyIncreaseScore = 0;
let obstacleSpawnRate = 1200; // Tempo inicial de 1.2 segundos entre grupos de obstáculos
let obstacleSpawnInterval; // Variável para o setInterval
let scoreInterval; // Adicionado para poder parar o contador de pontos

// --- Funções de Desenho ---

/**
 * Desenha o jogador (cubo) no canvas.
 */
function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.rotate(player.rotation * Math.PI / 180);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
    ctx.restore();
}

/**
 * Desenha os obstáculos (triângulos) no canvas.
 */
function drawObstacles() {
    ctx.fillStyle = '#ffffff';
    obstacles.forEach(obstacle => {
        // Desenha o obstáculo como um triângulo preenchido
        ctx.beginPath();
        ctx.moveTo(obstacle.x, obstacle.y + obstacle.height); // Canto inferior esquerdo
        ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y); // Canto superior
        ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height); // Canto inferior direito
        ctx.closePath();
        ctx.fill();
    });
}

/**
 * Desenha a pontuação na tela.
 */
function drawScore() {
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillText(`Pontos: ${score}`, 10, 30);
}

// --- Lógica do Jogo ---

/**
 * Atualiza a posição do jogador e dos obstáculos.
 */
function update() {
    // Aplica gravidade ao jogador
    player.vy += player.gravity;
    player.y += player.vy;

    // Garante que o jogador não caia abaixo do chão
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.isJumping = false;
        player.vy = 0;
        player.rotation = 0;
    }

    // Move os obstáculos para a esquerda
    obstacles.forEach(obstacle => {
        obstacle.x -= gameSpeed;
    });

    // Remove obstáculos que saíram da tela
    if (obstacles.length > 0 && obstacles[0].x < -obstacles[0].width) {
        obstacles.shift();
    }
}

/**
 * Verifica se houve colisão entre o jogador e os obstáculos.
 */
function checkCollision() {
    obstacles.forEach(obstacle => {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y + player.height > obstacle.y
        ) {
            endGame();
        }
    });
}

/**
 * Cria um grupo de 1 a 3 obstáculos juntos.
 */
function createObstaclesGroup() {
    const numObstaclesInGroup = Math.floor(Math.random() * 3) + 1; // Cria de 1 a 3 obstáculos
    let lastObstacleX = canvas.width;

    for (let i = 0; i < numObstaclesInGroup; i++) {
        const spacing = Math.random() * 200 + 150; // Espaçamento entre os obstáculos
        const newObstacleX = lastObstacleX + spacing;

        const newObstacle = {
            x: newObstacleX,
            y: canvas.height - 40,
            width: 40,
            height: 40
        };
        obstacles.push(newObstacle);
        lastObstacleX = newObstacleX;
    }
}

// --- Funções do Jogo ---

/**
 * Aumenta a velocidade do jogo e a frequência dos obstáculos.
 */
function increaseDifficulty() {
    if (score > lastDifficultyIncreaseScore && score % difficultyIncreaseInterval === 0) {
        gameSpeed += 0.8; // Aumenta a velocidade de forma mais agressiva
        lastDifficultyIncreaseScore = score;
        
        // Aumenta a frequência de geração de grupos de obstáculos
        if (obstacleSpawnRate > 400) {
            obstacleSpawnRate -= 75; // Diminui o intervalo em 75ms
            clearInterval(obstacleSpawnInterval);
            obstacleSpawnInterval = setInterval(createObstaclesGroup, obstacleSpawnRate);
        }
        
        console.log(`Dificuldade aumentada! Velocidade: ${gameSpeed}, Intervalo: ${obstacleSpawnRate}`);
    }
}

/**
 * Função principal do loop do jogo.
 */
function gameLoop() {
    if (isGameOver) return;

    // Limpa o canvas para o próximo frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rotação do jogador durante o pulo
    if (player.isJumping) {
        player.rotation += 10;
    }

    // Atualiza a lógica do jogo
    update();
    checkCollision();
    increaseDifficulty();

    // Desenha os elementos na tela
    drawPlayer();
    drawObstacles();
    drawScore();

    // Chama o próximo frame
    requestAnimationFrame(gameLoop);
}

/**
 * Inicia o jogo, esconde o menu e ativa a lógica principal.
 */
function startGame() {
    startScreen.style.display = 'none';
    gameContent.style.display = 'block';

    // Reseta o estado do jogo
    score = 0;
    obstacles = [];
    gameSpeed = 8;
    isGameOver = false;
    lastDifficultyIncreaseScore = 0;
    obstacleSpawnRate = 1200;
    
    // Inicia a geração de obstáculos e o loop principal
    obstacleSpawnInterval = setInterval(createObstaclesGroup, obstacleSpawnRate);
    scoreInterval = setInterval(() => { score++; }, 1000);
    gameLoop();
}

/**
 * Encerra o jogo e exibe a tela de Fim de Jogo.
 */
function endGame() {
    isGameOver = true;
    clearInterval(obstacleSpawnInterval);
    clearInterval(scoreInterval);

    // Fundo escuro semi-transparente
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texto de Fim de Jogo
    ctx.fillStyle = '#e5e5e5';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Fim de Jogo!', canvas.width / 2, canvas.height / 2 - 30);

    // Pontuação Final
    ctx.font = '25px Arial';
    ctx.fillText(`Pontuação: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
    
    // Botão de Reiniciar
    if (restartButton) {
        restartButton.style.display = 'block';
    }
}

// --- Eventos de Entrada do Usuário ---

/**
 * Faz o jogador pular ao pressionar a barra de espaço.
 */
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !player.isJumping) {
        player.vy = player.jumpStrength;
        player.isJumping = true;
    }
});

// Evento do botão de iniciar
if (startButton) {
    startButton.addEventListener('click', startGame);
}

// Evento do botão de reiniciar (necessário se for adicionar)
if (restartButton) {
    restartButton.addEventListener('click', () => {
        // Reinicia o jogo
        location.reload();
    });
}
