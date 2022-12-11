const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const knots = [];
const RADIUS = 8;
const ROPE = 4*RADIUS;
const sx = canvas.offsetLeft + canvas.clientLeft;
const sy = canvas.offsetTop + canvas.clientTop;

let current = null;
let position = null;

for (let i = 0; i < 100; ++i) {
    knots.push({
        x: 69,
        y: 69,
        left: null,
        right: null,
    });

    if (i != 0) {
        knots[i].left = knots[i - 1];
        knots[i - 1].right = knots[i];
    }
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const i in knots) {
        context.beginPath();
        context.arc(knots[i].x, knots[i].y, RADIUS, 0, 2 * Math.PI);

        context.fillStyle = `hsl(${(i+1)/knots.length*30}, 100%, ${knots[i] === current ? 30 : 50}%)`;
        context.fill();

    }
}

render();

function distance(a, b) {
    return Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2);
}

function updateNeighbors(knot) {
    let updated = 0;

    for (const direction of ['left', 'right']) {
        let parent = knot;

        while (parent[direction] != null) {
            const child = parent[direction];
            const d = distance(parent, child);

            if (d > ROPE) {
                const coefficient = (d-ROPE)/d;
                child.x += coefficient * (parent.x - child.x);
                child.y += coefficient * (parent.y - child.y);
            } else {
                break;
            }

            updated += 1;
            parent = parent[direction];
        }
    }

    document.getElementById('updated').innerText = 'Updated: ' + updated;
}

canvas.addEventListener('mousedown', ({ x, y }) => {
    x -= sx;
    y -= sy;

    for (const knot of knots) {
        if (distance(knot, { x, y }) <= RADIUS) {
            position = { x, y };
            current = knot;
            break;
        }
    }

    render();
});

canvas.addEventListener('mousemove', ({ x, y }) => {
    x -= sx;
    y -= sy;

    if (current != null) {
        current.x += (x - position.x);
        current.y += (y - position.y);

        updateNeighbors(current);
        render();

        position = { x, y };
    }
});

window.addEventListener('mouseup', () => {
    current = null;
    render();
});