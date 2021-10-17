// GIVES DISTANCE BETWEEN TWO POINTS
function getDistance(x1, y1, x2, y2){
    let y = x2 - x1;
    let x = y2 - y1;
    return Math.sqrt(x * x + y * y);
  }
  
//   COLLISION BETWEEN RECTANGLES
  function RectsColliding(r1,r2){
    return !(r1.x>r2.x+r2.w || r1.x+r1.w<r2.x || r1.y>r2.y+r2.h || r1.y+r1.h<r2.y);
  }

  // LINE/LINE INTERSECTION
  function lineLineCollision(x1, y1, x2, y2, x3, y3, x4, y4) {
  
    // calculate the distance to intersection point
    let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  
    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
  
      // optionally, draw a circle where the lines meet
      let intersectionX = x1 + (uA * (x2-x1));
      let intersectionY = y1 + (uA * (y2-y1));
      // ctx.beginPath();
      // ctx.strokeStyle = "orange";
      // ctx.arc(intersectionX,intersectionY, 2, 0, 2 * Math.PI);
      // ctx.stroke();
  
      return collisionPoint = {x: intersectionX, y: intersectionY};  // Use these values to determine projection slice height
    }
    return null;
  }