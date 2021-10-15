const map = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
];

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

const TICK = 30;

const CELL_SIZE = 32;
const SIGHT_DISTANCE = 120;

const COLORS = {
  floor: "#d52b1e", // "#ff6361"
  ceiling: "#ffffff", // "#012975",
  wall: "#013aa6", // "#58508d"
  wallDark: "#012975", // "#003f5c"
  rays: "#ffa600",
};

const player = {
  x: CELL_SIZE * 1.5,
  y: CELL_SIZE * 2,
  angle: toRadians(0),
};

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

const canvas = document.createElement("canvas");
canvas.setAttribute("width", SCREEN_WIDTH);
canvas.setAttribute("height", SCREEN_HEIGHT);
document.body.appendChild(canvas);

const context = canvas.getContext("2d");

function clearScreen() {
  context.fillStyle = "grey";
  context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

function renderMinimap() {
  context.fillStyle = "white";
  context.fillRect(0, 0, 224, 224);
  let step = 0;
  let row = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map.length; j++) {
      if (map[i][j] == 1) {
        context.fillStyle = "blue";
        context.fillRect(CELL_SIZE * step, row, CELL_SIZE - 1, CELL_SIZE - 1);
      }
      step++;
    }
    step = 0;
    row += CELL_SIZE;
  }
}

setInterval(gameLoop, 1000 / TICK);

function gameLoop() {
  clearScreen();
  //drawAngleLine();
  renderMinimap();
  castRays();
  renderPlayerOnMinimap()
  displayFPS();

  context.beginPath(); // For testing
  context.moveTo(300, 600);
  context.lineTo(700, 1300);
  context.stroke();
  context.beginPath(); // For testing
  context.moveTo(50, 400);
  context.lineTo(200, 670);
  context.stroke();
  context.beginPath(); // For testing
  context.moveTo(200, 900);
  context.lineTo(900, 800);
  context.stroke();
  context.beginPath(); // For testing
  context.moveTo(200, 600);
  context.lineTo(700, 500);
  context.stroke();
}

function moveAngle(e) {
  player.angle += toRadians(e.movementX / 3);
}

function drawAngleLine() {
  context.beginPath();
  context.moveTo(player.x + 6, player.y + 6);
  context.lineTo(
    player.x + Math.cos(player.angle) * 20,
    player.y + Math.sin(player.angle) * 20
  );
  context.stroke();
}

function renderPlayerOnMinimap() {
  context.fillStyle = "green";
  context.fillRect(player.x, player.y, 12, 12);
}

function castRays() {
  // One loop for each pixel of screen resolution width
  for (let i = 0; i < SCREEN_WIDTH; i++) {
    let angleX =
      player.x + Math.cos(player.angle + toRadians(i * 0.05)) * SIGHT_DISTANCE;
    let angleY =
      player.y + Math.sin(player.angle + toRadians(i * 0.05)) * SIGHT_DISTANCE;
    context.beginPath();
    context.strokeStyle = "black";
    context.moveTo(player.x + 6, player.y + 6);
    context.lineTo(
      angleX,
      angleY
    );
    context.stroke();
    let collision = lineLineCollision(
      player.x + 6,
      player.y + 6,
      angleX,
      angleY,
      150,
      600,
      700,
      1300
    );
    renderScene(collision, i);
  }
}

function renderScene(collisionObj, drawPoint) {
  if (collisionObj != null) {  // Ray hits wall
    context.fillStyle = "blue";
    context.fillRect(drawPoint, 0, 1, 300); // Rendering of scene starts here
  }
}

let lastLoop = new Date();
function displayFPS() {
  let thisLoop = new Date();
  let fps = Math.round(1000 / (thisLoop - lastLoop));
  lastLoop = thisLoop;
  context.font = "30px Arial";
  context.fillStyle = "green";
  context.fillText("FPS: " + fps, SCREEN_WIDTH - 250, 50);
}

function movePlayer(key) {
  // if(key.repeat) return;
  console.log(key.code);
  if (key.code == "KeyD") {
    player.x += 6;
  } else if (key.code == "KeyA") {
    player.x -= 6;
  } else if (key.code == "KeyW") {
    player.y -= 6;
  } else if (key.code == "KeyS") {
    player.y += 6;
  }
}

// EVENTS
document.addEventListener("keydown", movePlayer);

document.addEventListener("mousemove", moveAngle);
