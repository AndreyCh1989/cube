class Shape {
    /**
     * Shape object
     * @param nodes {Array.<Node>}
     * @param center {Center}
     * @param color {string}
     * @param ctx
     */
    constructor(nodes, center, color = '#000') {
        this.nodes = nodes;
        this.center = center;
        this.color = color;
        this.shape = undefined;
        this.angle = 0;

        this.draw();
    }

    /**
     * Get position of node based on angle
     * @param x {int}
     * @param y {int}
     * @param angle {int}
     * @returns {{x: number, y: number}}
     */
    getP = (x, y, angle) => {
        const rads = Math.PI / 180 * angle;

        const result = {
            x: x * Math.cos(rads) + y * Math.sin(rads),
            y: -1 * x * Math.sin(rads) + y * Math.cos(rads),
        };
        //console.log(angle, rads, result);
        return result;
    }

    /**
     * Get angle based on mouse position
     * @param x {int}
     * @param y {int}
     * @returns {number}
     */
    getAngle = (x, y, down = false) => {
        let angle = 180 / Math.PI * Math.atan2(y - this.center.y, x - this.center.x) * -1;
        if (down) {
            angle -= this.angle;
        }

        //console.log(angle);
        return angle;
    };

    /**
     * Draw shape
     * @param angle {int}
     */
    draw = () => {
        this.shape = new Path2D();
        //console.log(this.angle);
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const p = this.getP(node.x, node.y, this.angle);

            if (i === 0) {
                this.shape.moveTo(this.center.x + p.x, this.center.y + p.y);
            } else {
                this.shape.lineTo(this.center.x + p.x, this.center.y + p.y);
            }
        }

        this.shape.closePath();
    }
}

class Node {
    /**
     * Node object
     * @param x {int}
     * @param y {int}
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Center {
    /**
     * Center object
     * @param x {int}
     * @param y {int}
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 * 1------2
 * |      |
 * |      |
 * 4------3
 */
const CHOICE_STYLE = '#f00';
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d');
ctx.canvas.width = canvas.clientWidth;
ctx.canvas.height = canvas.clientHeight;

const cube = new Shape([
    new Node(-60,   -60),
    new Node(60,    -60),
    new Node(60,    60),
    new Node(-60,   60)
], new Center(canvas.clientWidth/2, canvas.clientHeight/2), '#47dc10');
const cube2 = new Shape([
    new Node(-60,   -60),
    new Node(60,    -60),
    new Node(60,    60),
    new Node(-60,   60)
], new Center(canvas.clientWidth - 150, canvas.clientHeight - 150), '#10dcc4');

const figures = [cube, cube2];

const center = new Center(canvas.clientWidth/2, canvas.clientHeight/2);
ctx.fillStyle = 'green';

let downAngle = undefined;
let upAngle = undefined;
let rotateFigure = undefined;
canvas.addEventListener('mousedown', event => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    figures.forEach((figure) => {
        const path = figure.shape;
        if (ctx.isPointInPath(path, x, y)) {
            rotateFigure = figure;
            downAngle = figure.getAngle(x, y, true);
            ctx.fillStyle = CHOICE_STYLE;
            ctx.fill(path);
        } else {
            ctx.fillStyle = figure.color;
            ctx.fill(path);
        }
    });
});
canvas.addEventListener('mousemove', event => {
    if (downAngle !== undefined) {
        const x = event.clientX;
        const y = event.clientY;
        upAngle = rotateFigure.getAngle(x, y);
        rotateFigure.angle = upAngle - downAngle;
        //console.log(rotateFigure.angle, upAngle, downAngle);
        rotateFigure.draw();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        figures.forEach((figure) => {
            ctx.fillStyle = figure === rotateFigure ? CHOICE_STYLE : figure.color;
            ctx.fill(figure.shape);
        });
    }
});
canvas.addEventListener('mouseup', event => {
    rotateFigure = undefined;
    downAngle = undefined;
    upAngle = undefined;
});

figures.forEach(figure => {
    ctx.fillStyle = figure.color;
    ctx.fill(figure.shape);
});