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
let mapLines = [];

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

let MouseX;
let MouseY;

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

const canvas = document.createElement("canvas");
canvas.setAttribute("width", SCREEN_WIDTH);
canvas.setAttribute("height", SCREEN_HEIGHT);
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d", { alpha: false });

createWall(300, 600, 700, 1300); // For testing
createWall(50, 400, 200, 670);
createWall(200, 900, 900, 800);
createWall(200, 600, 700, 500);

function clearScreen() {
  ctx.fillStyle = "purple";
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

function renderMinimap() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 224, 224);
  let step = 0;
  let row = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map.length; j++) {
      if (map[i][j] == 1) {
        ctx.fillStyle = "blue";
        ctx.fillRect(CELL_SIZE * step, row, CELL_SIZE - 1, CELL_SIZE - 1);
      }
      step++;
    }
    step = 0;
    row += CELL_SIZE;
  }
}

//setInterval(gameLoop, 1000 / TICK); 
requestAnimationFrame(gameLoop);  

function gameLoop() {
  clearScreen();
  //drawAngleLine();
  renderMinimap();
  castRays();
  renderPlayerOnMinimap();
  displayFPS();
  requestAnimationFrame(gameLoop);
}

function moveAngle(e) {
  player.angle += toRadians(e.movementX / 3);
}

function drawAngleLine() {
  ctx.beginPath();
  ctx.moveTo(player.x + 6, player.y + 6);
  ctx.lineTo(
    Math.floor(player.x + Math.cos(player.angle) * 20),
    Math.floor(player.y + Math.sin(player.angle) * 20)
  );
  ctx.stroke();
}

function renderPlayerOnMinimap() {
  ctx.fillStyle = "green";
  ctx.fillRect(player.x, player.y, 12, 12);
}

function castRays() {
  // One loop for each pixel of screen resolution width
  ctx.beginPath();
  ctx.strokeStyle = "black";
  for (let i = 0; i < SCREEN_WIDTH; i++) {
    let angleX = Math.round(
      player.x + Math.cos(player.angle + toRadians(i * 0.05)) * SIGHT_DISTANCE
    );
    let angleY = Math.round(
      player.y + Math.sin(player.angle + toRadians(i * 0.05)) * SIGHT_DISTANCE
    );

    ctx.moveTo(player.x + 6, player.y + 6);
    ctx.lineTo(angleX, angleY);

    // let angleDeg = (player.angle * 180) / Math.PI;

    for (let j = 0; j < mapLines.length; j++) {
      renderSceneSlice(
        lineLineCollision(
          player.x + 6,
          player.y + 6,
          angleX,
          angleY,
          mapLines[j].moveToX,
          mapLines[j].moveToY,
          mapLines[j].lineToX,
          mapLines[j].lineToY
        ),
        i
      );
    }
  }
  ctx.stroke();
}

// Rendering of scene starts here
function renderSceneSlice(collisionPoint, drawPoint, angle) { // Fix fish eye effect!!!
  if (collisionPoint) {
    // Ray hits wall
    ctx.fillStyle = "blue";
    let colDist = getDistance(player.x, player.y, collisionPoint.x, collisionPoint.y);
    // colDist = colDist * Math.cos(angle);
    let sliceVerticalOffset = colDist / 2; 
    ctx.fillRect(drawPoint, sliceVerticalOffset, 1, 600 - colDist); 
  }
}

let lastLoop = new Date();
function displayFPS() {
  let thisLoop = new Date();
  let fps = Math.round(1000 / (thisLoop - lastLoop));
  lastLoop = thisLoop;
  ctx.font = "30px Arial";
  ctx.fillStyle = "green";
  ctx.fillText("FPS: " + fps, SCREEN_WIDTH - 250, 50);
}

function createWall(moveToX, moveToY, lineToX, lineToY) {
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.moveTo(moveToX, moveToY);
  ctx.lineTo(lineToX, lineToY);
  ctx.stroke();
  let newWall = {
    moveToX: moveToX,
    moveToY: moveToY,
    lineToX: lineToX,
    lineToY: lineToY,
  };
  mapLines.push(newWall);
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
  } else if(key.code == "Space") {
    initilizeMapMaker();
  }
}

let mmConfirm = 0; 
let oldMouseX, oldMouseY;
function initilizeMapMaker() {
  if(mmConfirm == 0) {
    oldMouseX = MouseX;
    oldMouseY = MouseY;
  }
  mmConfirm++;
  if(mmConfirm == 1) {
    ctx.beginPath();
    ctx.moveTo(MouseX, MouseY);
    ctx.lineTo(MouseX, MouseY);
    ctx.stroke(); 

    requestAnimationFrame(initilizeMapMaker)
  } else if(mmConfirm == 2) {
    mmConfirm = 0;
    createWall(oldMouseX, oldMouseY, MouseX, MouseY); 
  }
  
}

function updateMousePosition(e) {
  MouseX = e.clientX;
  MouseY = e.clientY;
}

canvas.onclick = () => {
  canvas.requestPointerLock();
}

// EVENTS
document.addEventListener("keydown", movePlayer);

document.addEventListener("mousemove", moveAngle);

document.addEventListener("mousemove", updateMousePosition);
