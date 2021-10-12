
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
  
  const TICK = 60;
  
  const CELL_SIZE = 32;
  
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
  
  function clearScreen() {
    context.fillStyle = "red";
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
  
  setInterval(gameLoop, 16.66);

  function gameLoop() {
    clearScreen();
    renderMinimap();
    renderPlayerOnMinimap(); 
    //drawAngleLine(); 
    castRays();
    
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
    for (let i = 0; i < SCREEN_WIDTH; i++) {
        let angleX = player.x + Math.cos(player.angle + toRadians(i * 0.02)) * 120;
        let angleY = player.y + Math.sin(player.angle + toRadians(i * 0.02)) * 120; 
        context.beginPath();
        context.moveTo(player.x + 6, player.y + 6)
        context.lineTo(player.x + Math.cos(player.angle + toRadians(i * 0.02)) * 120, player.y + Math.sin(player.angle + toRadians(i * 0.02)) * 120);
        context.stroke();
        let ray = new Ray(angleX, angleY); // Send this to array to track rays and to "shoot" them in another function

        // let angle = toRadians(player.angle * 180 / Math.PI + i); 
        // shootRay(angle);
    }
}

class Ray {
  constructor(angleX, angleY) {
    this.angleX = angleX;
    this.angleY = angleY;
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

