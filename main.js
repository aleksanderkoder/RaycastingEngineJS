
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

//   const FOV = toRadians(60);
  
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
    speed: 0,
  };
  
  function toRadians(deg) {
    return (deg * Math.PI) / 180;
  }

  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", SCREEN_WIDTH);
  canvas.setAttribute("height", SCREEN_HEIGHT);
  document.body.appendChild(canvas);
  
  const context = canvas.getContext("2d");
  let hit = false;
  function clearScreen() {
    if(!hit)
      context.fillStyle = "red";
    else
      context.fillStyle = "green"; 

    context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  }

  function renderMinimap() {
      context.fillStyle = "white";
      context.fillRect(0, 0, 224, 224);
      let step = 0;
      let row = 0;
      for (let i = 0; i < map.length; i++) {
          for(let j = 0; j < map.length; j++) {
              if(map[i][j] == 1) {
                context.fillStyle = "blue";
                context.fillRect(CELL_SIZE * step, row, CELL_SIZE - 1, CELL_SIZE - 1);

            }
            step++;
          }
          step = 0;
          row += CELL_SIZE; 
        
      }
  }

  function renderPlayerOnMinimap() {
    context.fillStyle = "green";
    context.fillRect(player.x, player.y, 12, 12);
  }
  
  setInterval(gameLoop, 1000 / TICK);

  function gameLoop() {
    clearScreen();
    renderMinimap();
    renderPlayerOnMinimap(); 
    //drawAngleLine(); 
    castRays();
    context.beginPath();  // For testing
    context.moveTo(300, 600);
    context.lineTo(700, 1300);
    context.stroke(); 
    context.beginPath();  // For testing
    context.moveTo(50, 400);
    context.lineTo(200, 670);
    context.stroke(); 
    context.beginPath();  // For testing
    context.moveTo(200, 900);
    context.lineTo(900, 800);
    context.stroke(); 
    context.beginPath();  // For testing
    context.moveTo(200, 600);
    context.lineTo(700, 500);
    context.stroke(); 
    
  }



document.addEventListener("keydown", movePlayer);

document.addEventListener("mousemove", moveAngle);

function moveAngle(e) {
    player.angle += toRadians(e.movementX / 3); 
}

function drawAngleLine() {
    context.beginPath();
    context.moveTo(player.x + 6, player.y + 6);
    context.lineTo(player.x + Math.cos(player.angle) * 20, player.y + Math.sin(player.angle) * 20);
    context.stroke(); 
}


function castRays() {
  let rays = []; 
  let lineshit = 0;
    for (let i = 0; i < SCREEN_WIDTH; i++) {
        let angleX = player.x + Math.cos(player.angle + toRadians(i * 0.05)) * SIGHT_DISTANCE;
        let angleY = player.y + Math.sin(player.angle + toRadians(i * 0.05)) * SIGHT_DISTANCE; 
        context.beginPath();
        context.strokeStyle = "black";
        context.moveTo(player.x + 6, player.y + 6)
        context.lineTo(player.x + Math.cos(player.angle + toRadians(i * 0.05)) * SIGHT_DISTANCE, player.y + Math.sin(player.angle + toRadians(i * 0.05)) * SIGHT_DISTANCE);
        context.stroke();
        let col = lineLineCollision(player.x + 6, player.y + 6, angleX, angleY, 150, 600, 700, 1300); 
        console.log(lineshit);
        if(col != null) {
          context.fillStyle = "orange";
          context.fillRect(i, 0, 1, 300); // Rendering of screen starts here
          lineshit++;
          //alert();
          hit = true;
        } else {
          // hit = false;
        
        // let ray = new Ray(angleX, angleY); // Send this to array to track rays and to "shoot" them in another function
        // rays.push(ray);
        // let angle = toRadians(player.angle * 180 / Math.PI + i); 
       
    } 
    // shootRays(rays);
}
}

// function shootRays(rays) {
//   context.fillStyle = "orange";
//   // console.log(rays.length)
    
//       for (let i = 0; i < SIGHT_DISTANCE; i++) {
//         for(let j = 0; j < rays.length; j++) {
//           context.fillRect(rays[j].x, rays[j].y, 1, 1);
//           rays[j].x *= 1.01; 
//           rays[j].y *= 1.01;
//         }
//       }
// }

function RectsColliding(r1,r2){
  return !(r1.x>r2.x+r2.w || r1.x+r1.w<r2.x || r1.y>r2.y+r2.h || r1.y+r1.h<r2.y);
}
// LINE/LINE
function lineLineCollision(x1, y1, x2, y2, x3, y3, x4, y4) {

  // calculate the distance to intersection point
  let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {

    // optionally, draw a circle where the lines meet
    let intersectionX = x1 + (uA * (x2-x1));
    let intersectionY = y1 + (uA * (y2-y1));
    context.beginPath();
    context.strokeStyle = "orange";
    context.arc(intersectionX,intersectionY, 2, 0, 2 * Math.PI);
    context.stroke();

    return collisionObject = {intersectionDist1: uA, intersectionDist2: uB};  // Use these values to determine projection slice height
  }
  return null;
}

class Ray {
  constructor(angleX, angleY) {
    this.x = angleX;
    this.y = angleY;
  }
}

// let rays = []; 
// function shootRay(angle) {
//     context.fillStyle = "orange";
//     context.fillRect(player.x + 6, player.y + 6, 5, 5);
//     let ray = {
//         x: player.x + 6, 
//         y: player.y + 6,
//         angle: toRadians(angle)
//     }
    
//     rays.push(ray);
//     moveRays();
//     console.log(rays.length);
// }

// function moveRays() {
//     for (let i = 0; i < rays.length; i++) {
//       for(let j = 0; j < 100; j++) {
//           context.fillStyle = "orange";
//           context.fillRect(player.x + Math.cos(rays[i].angle + toRadians(i)) * j, player.y + Math.sin(rays[i].angle + toRadians(i)) * j, 2, 2);
//       }
//         // rays[i].x += player.x + Math.cos(rays[i].angle + toRadians(i)) * 1; 
//         // context.fillStyle = "orange";
//         // context.fillRect(player.x + Math.cos(rays[i].angle + toRadians(i)) * 1, player.y + Math.sin(rays[i].angle + toRadians(i)) * 1, 5, 5);
//     }
// }

function movePlayer(key) {
  // if(key.repeat) return;
    console.log(key.code);
    if(key.code == "KeyD") {
        player.x += 6; 
    } else if(key.code == "KeyA") {
        player.x -= 6;
    } else if(key.code == "KeyW") {
        player.y -= 6;
    } else if(key.code == "KeyS") {
        player.y += 6; 
    }
}

