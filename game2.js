// Mendapatkan elemen canvas dan context
const canvas = document.getElementById("Game_Canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 768;

// Variabel untuk karakter utama (pemain)
const player = {
  x: 50,
  y: canvas.height / 2,
  size: 50,
  speed: 10,
  color: "blue"
};

// Variabel untuk musuh (segilima, bergerak horizontal)
const enemies = [
  { x: canvas.width - 40, y: 72, size: 40, speedX: 3, alive: true },
  { x: canvas.width - 80, y: 144, size: 10, speedX: 5, alive: true },
  { x: canvas.width - 120, y: 216, size: 40, speedX: 1, alive: true },
  { x: canvas.width - 160, y: 288, size: 10, speedX: 5, alive: true },
  { x: canvas.width - 200, y: 360, size: 40, speedX: 2, alive: true },
  { x: canvas.width - 240, y: 432, size: 10, speedX: 5, alive: true },
  { x: canvas.width - 280, y: 504, size: 40, speedX: 1, alive: true },
  { x: canvas.width - 320, y: 578, size: 10, speedX: 5, alive: true },
  { x: canvas.width - 360, y: 650, size: 40, speedX: 3, alive: true }
];

// Variabel permainan
let bullets = [];
let score = 0;
let keys = {};
const targetScore = 10;
let gameOver = false;

// Event listener untuk pergerakan dan menembak
document.addEventListener("keydown", (event) => {
  keys[event.code] = true;
  if (event.code === "Space") {
    bullets.push({ x: player.x + player.size, y: player.y, radius: 5, speed: 5 });
  }
});

document.addEventListener("keyup", (event) => {
  keys[event.code] = false;
});

// Fungsi menggambar karakter utama (segitiga)
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.moveTo(player.x, player.y);
  ctx.lineTo(player.x - player.size, player.y - player.size);
  ctx.lineTo(player.x - player.size, player.y + player.size);
  ctx.closePath();
  ctx.fill();
}

// Fungsi menggambar musuh (segilima, warna ungu)
function drawEnemies() {
  enemies.forEach(enemy => {
    if (!enemy.alive) return;

    ctx.fillStyle = "purple";
    ctx.beginPath();

    for (let i = 0; i < 5; i++) {
      let angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      let x = enemy.x + enemy.size * Math.cos(angle);
      let y = enemy.y + enemy.size * Math.sin(angle);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.closePath();
    ctx.fill();
  });
}

// Fungsi menggambar peluru
function drawBullets() {
  ctx.fillStyle = "red";

  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];

    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fill();
    bullet.x += bullet.speed;

    // Periksa tabrakan dengan musuh
    enemies.forEach(enemy => {
      if (
        bullet.x + bullet.radius >= enemy.x - enemy.size / 2 &&
        bullet.x - bullet.radius <= enemy.x + enemy.size / 2 &&
        bullet.y + bullet.radius >= enemy.y - enemy.size / 2 &&
        bullet.y - bullet.radius <= enemy.y + enemy.size / 2 &&
        enemy.alive
      ) {
        bullets.splice(i, 1);
        enemy.alive = false;
        score++;
        checkWinner();
        setTimeout(() => respawnEnemy(enemy), 500);
      }
    });

    // Hapus peluru yang keluar dari canvas
    if (bullet.x > canvas.width + bullet.radius) {
      bullets.splice(i, 1);
    }
  }
}

// Fungsi menggambar skor
function drawScore() {
  ctx.fillStyle = "yellow";
  ctx.font = "35px Times New Roman";
  ctx.fillText("Score : " + score, 30, 50);
}

// Fungsi untuk memeriksa apakah pemain menang
function checkWinner() {
  if (score >= targetScore) {
    declareWinner();
  }
}

// Update posisi karakter utama
function updatePlayer() {
  if (keys["ArrowUp"] && player.y > player.size) {
    player.y -= player.speed;
  }
  if (keys["ArrowDown"] && player.y < canvas.height - player.size) {
    player.y += player.speed;
  }
}

// Fungsi untuk menggerakkan musuh hanya secara horizontal
function updateEnemies() {
  enemies.forEach(enemy => {
    if (!enemy.alive) return;

    enemy.x += enemy.speedX;

    // Jika musuh mencapai batas canvas, ubah arah
    if (enemy.x <= enemy.size / 2 || enemy.x >= canvas.width - enemy.size / 2) {
      enemy.speedX *= -1;
    }

    // Periksa tabrakan dengan pemain
    checkCollision(enemy);
  });
}

// Fungsi untuk mengecek tabrakan antara pemain dan musuh
function checkCollision(enemy) {
  let dx = player.x - enemy.x;
  let dy = player.y - enemy.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < player.size / 2 + enemy.size / 2) {
    gameOver = true;
    alert("Game Over! Musuh mengenai Anda.");
    resetGame();
  }
}

// Fungsi untuk respawn musuh setelah ditembak
function respawnEnemy(enemy) {
  enemy.x = Math.random() * (canvas.width - 100) + 50;
  enemy.alive = true;
}

// Fungsi menampilkan pesan kemenangan
function declareWinner() {
  alert("Congratulations! You are the winner! 🎉");
  resetGame();
}

// Fungsi reset game
function resetGame() {
  score = 0;
  enemies.forEach(enemy => {
    enemy.alive = true;
    enemy.x = Math.random() * (canvas.width - 100) + 50;
  });
  bullets = [];
  gameOver = false;
}

// Loop utama game
function gameLoop() {
  if (gameOver) return; // Hentikan game jika pemain kalah

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawEnemies();
  drawBullets();
  drawScore();
  updatePlayer();
  updateEnemies();

  requestAnimationFrame(gameLoop);
}

gameLoop();
