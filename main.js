
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
    angle: 0,
    speed: 0,
  };
  
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
      let step = 0;
      let nextRow = 0;
      for (let i = 0; i < map.length; i++) {
          for(let j = 0; j < map.length; j++) {
              if(map[i][j] == 1) {
                context.fillStyle = "blue";
                context.fillRect(CELL_SIZE * step, nextRow, CELL_SIZE, CELL_SIZE);

            }
            step++;
          }
          step = 0;
          nextRow += CELL_SIZE; 
        
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
  }



document.addEventListener("keydown", movePlayer);

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

