class Node {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

/**
 * Bottom
 * 1------2
 * |      |
 * |      |
 * 3------4
 *
 * Top
 * 5------6
 * |      |
 * |      |
 * 7------8
 */
const cube = [
    new Node(0, 0,  0),     // 1
    new Node(50,0,  0),     // 2
    new Node(0, 50, 0),     // 3
    new Node(50,50, 0),     // 4
    new Node(0, 0,  50),    // 5
    new Node(50,0,  50),    // 6
    new Node(0, 50, 50),    // 7
    new Node(50,50, 50),    // 8
]

const getD = (x, y, angle) => {
    const rads = Math.PI / 180 * angle;

    const result = {
        x: x * Math.cos(rads) + y * Math.sin(rads),
        y: -1 * x * Math.sin(rads) + y * Math.cos(rads),
    };
    //console.log(angle, rads, result);
    return result;
}

const drawCube = (center, angle = 0) => {
    const d1 = getD(-60, -60, angle);
    const d2 = getD(60,-60, angle);
    const d3 = getD(60, 60, angle);
    const d4 = getD(-60, 60, angle);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    ctx.beginPath();
    ctx.strokeStyle = '#f00';
    ctx.moveTo(center.x + d1.x, center.y + d1.y);
    ctx.lineTo(center.x + d2.x, center.y + d2.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#ffd500';
    ctx.moveTo(center.x + d2.x, center.y + d2.y);
    ctx.lineTo(center.x + d3.x, center.y + d3.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#b300ff';
    ctx.moveTo(center.x + d3.x, center.y + d3.y);
    ctx.lineTo(center.x + d4.x, center.y + d4.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#00ffb7';
    ctx.moveTo(center.x + d4.x, center.y + d4.y);
    ctx.lineTo(center.x + d1.x, center.y + d1.y);
    ctx.stroke();

    ctx.closePath();
    ctx.stroke();
};

const getAngle = (x, y) => {
    const startX = y > canvas.clientHeight/2 ? -50 : 50;

    const dotProduct = startX * (x - canvas.clientWidth/2);
    const lv1 = Math.pow(startX, 2);
    const lv2 = Math.pow(x - canvas.clientWidth/2, 2) + Math.pow(y - canvas.clientHeight/2, 2);
    let angle = 180 / Math.PI * Math.acos(dotProduct / Math.sqrt(lv1 * lv2));

    //console.log(angle);
    return angle;
};

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d');
ctx.canvas.width = canvas.clientWidth;
ctx.canvas.height = canvas.clientHeight;

const center = {x: canvas.clientWidth/2, y: canvas.clientHeight/2};
ctx.fillStyle = 'green';

let downAngle = undefined;
let upAngle = undefined;
let curAngle = 0;
canvas.addEventListener('mousedown', event => {
  const downX = event.offsetX;
  const downY = event.offsetY;
  downAngle = getAngle(downX, downY);
});
canvas.addEventListener('mousemove', event => {
  if (downAngle !== undefined) {
      const x = event.offsetX;
      const y = event.offsetY;
      upAngle = getAngle(x, y);
      drawCube(center, curAngle + upAngle - downAngle);
  }
});
canvas.addEventListener('mouseup', event => {
  curAngle = upAngle - downAngle;

  downAngle = undefined;
  upAngle = undefined;
});

drawCube(center);