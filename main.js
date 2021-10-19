const map = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
];

// const SCREEN_WIDTH = window.innerWidth;
// const SCREEN_HEIGHT = window.innerHeight;
const SCREEN_WIDTH = 600;
const SCREEN_HEIGHT = 600;

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
canvas.style.position = "absolute";
canvas.style.left = "650px";
canvas.style.border = "2px solid white";
canvas.setAttribute("width", SCREEN_WIDTH);
canvas.setAttribute("height", SCREEN_HEIGHT);
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

const canvasUI = document.createElement("canvas");
canvasUI.style.position = "absolute";
canvasUI.style.left = "0px";
canvasUI.style.border = "2px solid white";
canvasUI.setAttribute("width", SCREEN_WIDTH);
canvasUI.setAttribute("height", SCREEN_HEIGHT);
document.body.appendChild(canvasUI);

const ctxUI = canvasUI.getContext("2d");

createWall(300, 600, 700, 1300); // For testing
createWall(50, 400, 200, 670);
createWall(200, 900, 900, 800);
createWall(200, 600, 700, 500);

//setInterval(gameLoop, 1000 / TICK);
requestAnimationFrame(gameLoop);

function gameLoop() {
  clearScreen();
  //drawAngleLine();
  //renderMinimap();
  castRays();
  renderPlayerOnMinimap();
  displayFPS();
  displayWalls();
  //mapLines = [];
  requestAnimationFrame(gameLoop);
}

function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  ctxUI.fillStyle = "black";
  ctxUI.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

function renderMinimap() {
  ctxUI.fillStyle = "white";
  ctxUI.fillRect(0, 0, 224, 224);
  let step = 0;
  let row = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map.length; j++) {
      if (map[i][j] == 1) {
        ctxUI.fillStyle = "blue";
        ctxUI.fillRect(CELL_SIZE * step, row, CELL_SIZE - 1, CELL_SIZE - 1);
      }
      step++;
    }
    step = 0;
    row += CELL_SIZE;
  }
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
  ctxUI.fillStyle = "green";
  ctxUI.fillRect(player.x, player.y, 12, 12);
}

function castRays() {
  // One loop for each pixel of screen resolution width
  
  for (let i = 0; i < SCREEN_WIDTH; i++) {
    let angleX =
      player.x + Math.cos(player.angle + toRadians(i * 0.05)) * SIGHT_DISTANCE;
    let angleY =
      player.y + Math.sin(player.angle + toRadians(i * 0.05)) * SIGHT_DISTANCE;
    ctxUI.beginPath();
    ctxUI.strokeStyle = "white";
    ctxUI.moveTo(player.x + 6, player.y + 6);
    ctxUI.lineTo(angleX, angleY);
    ctxUI.stroke();
    ctxUI.closePath();
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
  
}

// Rendering of scene starts here
function renderSceneSlice(collisionPoint, drawPoint, angle) {
  // Fix fish eye effect!!!
  if (collisionPoint) {
    // Ray hits wall
    let colDist = getDistance(
      player.x,
      player.y,
      collisionPoint.x,
      collisionPoint.y
    ) * 3;
    let colorShade = 255 - colDist / 2; // Gives slice darker color the further away the wall is
    ctx.fillStyle = "rgb(" + colorShade + ", " + colorShade + ", " + colorShade + ")";
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
  ctx.fillText("FPS: " + fps, SCREEN_WIDTH - 150, 50);
}

function createWall(moveToX, moveToY, lineToX, lineToY) {
  ctxUI.beginPath();
  ctxUI.strokeStyle = "black";
  ctxUI.moveTo(moveToX, moveToY);
  ctxUI.lineTo(lineToX, lineToY);
  ctxUI.stroke();
  ctxUI.closePath();
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
  } else if (key.code == "Space") {
    // if(key.repeat) return;

    initializeMapMaker();
  }
}

function displayWalls() {
  for (let i = 0; i < mapLines.length; i++) {
    ctxUI.beginPath();
    ctxUI.strokeStyle = "white";
    ctxUI.moveTo(mapLines[i].moveToX, mapLines[i].moveToY);
    ctxUI.lineTo(mapLines[i].lineToX, mapLines[i].lineToY);
    ctxUI.stroke();
    ctxUI.closePath();
  }
}

let mmConfirm = 0;
let oldMouseX, oldMouseY;
function initializeMapMaker() {
  mmConfirm++;
  if (mmConfirm == 1) {
    oldMouseX = MouseX;
    oldMouseY = MouseY;
    requestAnimationFrame(previewWall);
    console.log("step 1");
  } else if (mmConfirm == 2) {
    createWall(oldMouseX, oldMouseY, MouseX, MouseY);
    console.log("step 2");
    mmConfirm = 0;
  }
}

function previewWall() {
  if (mmConfirm == 1) {
    ctxUI.beginPath();
    ctxUI.moveTo(oldMouseX, oldMouseY);
    ctxUI.lineTo(MouseX, MouseY);
    ctxUI.stroke();
    requestAnimationFrame(previewWall);
  }
}

function updateMousePosition(e) {
  MouseX = e.clientX;
  MouseY = e.clientY;
}

// Locks mouse pointer to window
canvas.onclick = () => {
  canvas.requestPointerLock();
};

// EVENTS
document.addEventListener("keydown", movePlayer);

document.addEventListener("mousemove", moveAngle);

document.addEventListener("mousemove", updateMousePosition);
