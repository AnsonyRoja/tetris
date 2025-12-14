const COLS = 10, ROWS = 20;
const boardEl = document.getElementById('board');
const nextEl = document.getElementById('next');
const scoreEl = document.getElementById('score');
const startBtnEl = document.getElementById('startBtn');


// crear celdas en el tablero 


const cells = [];
for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {


        const div = document.createElement('div');
        div.className = 'cell';
        console.log(div);
        boardEl.appendChild(div);
        cells.push(div);

    }

}


// crear celdas preview

const previewCells = [];

for (let i = 0; i < 16; i++) {

    const d = document.createElement('div');
    d.className = 'cell';
    nextEl.appendChild(d);
    previewCells.push(d);

}


// Piezas tetrominoes como matrices 4 * 4

const SHAPES = {

    I: [
        [
            0, 0, 0, 0,
            1, 1, 1, 1,
            0, 0, 0, 0,
            0, 0, 0, 0
        ],
        [
            0, 0, 1, 0,
            0, 0, 1, 0,
            0, 0, 1, 0,
            0, 0, 1, 0,
        ],


    ],

    J: [
        [
            1, 0, 0, 0,
            1, 1, 1, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ],
        [
            0, 1, 1, 0,
            0, 1, 0, 0,
            0, 1, 0, 0,
            0, 0, 0, 0
        ],
        [
            0, 0, 0, 0,
            1, 1, 1, 0,
            0, 0, 1, 0,
            0, 0, 0, 0

        ],
        [
            0, 1, 0, 0,
            0, 1, 0, 0,
            1, 1, 0, 0,
            0, 0, 0, 0
        ]



    ],

    L: [
        [
            0, 0, 1, 0,
            1, 1, 1, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ],
        [
            0, 1, 0, 0,
            0, 1, 0, 0,
            0, 1, 1, 0,
            0, 0, 0, 0
        ],
        [
            0, 0, 0, 0,
            1, 1, 1, 0,
            1, 0, 0, 0,
            0, 0, 0, 0,

        ],
        [
            1, 1, 0, 0,
            0, 1, 0, 0,
            0, 1, 0, 0,
            0, 0, 0, 0,
        ]



    ],

    O: [
        [
            0, 1, 1, 0,
            0, 1, 1, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ],

    ],
    S: [
        [0, 1, 1, 0,
            1, 1, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,],
        [
            0, 1, 0, 0,
            0, 1, 1, 0,
            0, 0, 1, 0,
            0, 0, 0, 0,
        ]
    ],

    T: [
        [
            0, 1, 0, 0,
            1, 1, 1, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ],
        [
            0, 1, 0, 0,
            0, 1, 1, 0,
            0, 1, 0, 0,
            0, 0, 0, 0
        ],
        [
            0, 0, 0, 0,
            1, 1, 1, 0,
            0, 1, 0, 0,
            0, 0, 0, 0,
        ],
        [
            0, 1, 0, 0,
            1, 1, 0, 0,
            0, 1, 0, 0,
            0, 0, 0, 0,
        ],

    ],
    Z: [
        [
            1, 1, 0, 0,
            0, 1, 1, 0,
            0, 0, 0, 0,
            0, 0, 0, 0

        ],
        [
            0, 0, 1, 0,
            0, 1, 1, 0,
            0, 1, 0, 0,
            0, 0, 0, 0
        ]
    ]

}


const COLORS = {

    I: 'c-I', J: 'c-J', L: 'c-L', O: 'c-O',
    S: 'c-S', T: 'c-T', Z: 'c-Z'
};

const PIECES = Object.keys(SHAPES);


let grid = null;
let current = null;
let nextPiece = null;
let dropInterval = 700;// ms
let dropTimer = null;
let score = 0;
let running = false;


function resetGrid() {
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill(''));
}

function draw() {

    //Limpiamos


    for (let r = 0; r < ROWS; r++) {

        for (let c = 0; c < COLS; c++) {

            const idx = r * COLS + c;
            cells[idx].className = 'cell';
            if (grid[r][c]) cells[idx].classList.add('filled', grid[r][c]);

        }

    }
    //dibujar pieza actual

    if (current) {
        const shape = getShapeMatrix(current.type, current.rotation);
        for (let i = 0; i < 16; i++) {

            if (shape[i]) {
                const sr = Math.floor(i / 4), sc = i % 4;
                const r = current.y + sr, c = current.x + sc;
                if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
                    const idx = r * COLS + c;
                    cells[idx].className = 'cell filled ' + COLORS[current.type];
                }
            }

        }
    }

}

function draNext() {

    previewCells.forEach(d => {
        d.className = 'cell'
    });
    const shape = getShapeMatrix(nextPiece.type, 0);
    // centramos la preview 4 x 4 en el contenedor Proxima

    for (let i = 0; i < 16; i++) {
        if (shape[i])
            previewCells[i].className = 'cell filled' +
                COLORS[nextPiece.type];

    }

}


function getShapeMatrix(type, rotation) {

    const array = SHAPES[type];
    // rotacion por cada modulo disponible

    const mat = array[rotation % array.length];
    return mat;


}

function spawnPiece() {
    if (!nextPiece) nextPiece = randomPiece();
    current = { type: nextPiece.type, rotation: 0, x: 3, y: -1 };
    nextPiece = randomPiece();

    if (collides(current.x, current.y, current.rotation)) {
        running = false;
        clearInterval(dropTimer);
        alert("Game Over");
        return;
    }
    draNext();

    draw();

}


function randomPiece() {

    const t = PIECES[Math.floor(Math.random() * PIECES.length)];
    return { type: t };

}


function collides(x, y, rotation) {
    const shape = getShapeMatrix(current.type, rotation);
    for (let i = 0; i < 16; i++) {
        if (!shape[i]) continue;
        const sr = Math.floor(i / 4), sc = i % 4;
        const r = y + sr, c = x + sc;
        if (c < 0 || c >= COLS) return true;
        if (r >= ROWS) return true;
        if (r >= 0 && grid[r][c]) return true;
    }
    return false;
}

function lockPiece() {

    const shape = getShapeMatrix(current.type, current.rotation);

    for (let i = 0; i < 16; i++) {
        if (!shape[i]) continue;
        const sr = Math.floor(i / 4), sc = i % 4;
        const r = current.y + sr, c = current.x + sc;

        if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
            grid[r][c] = COLORS[current.type];
        }
    }

    clearLines();
    current = null;
}



function clearLines() {
    let lines = 0;

    const incompleteRows = [];

    for (let r = 0; r < ROWS; r++) {

        if (grid[r].some(cell => cell === '')) {
            incompleteRows.push(grid[r]);
        } else {
            lines++;
        }
    }


    const newEmptyRowsCount = ROWS - incompleteRows.length;
    const newEmptyRows = Array.from({ length: newEmptyRowsCount }, () => Array(COLS).fill(''));

    grid = newEmptyRows.concat(incompleteRows);


    if (lines > 0) {
        score += [0, 40, 100, 300, 1200][lines] || lines * 100;
        scoreEl.textContent = score;
        dropInterval = Math.max(100, dropInterval - lines * 10);
        restarTimer();
    }
}

function restarTimer() {

    if (dropTimer) {

        clearInterval(dropTimer);
    }

    if (running) dropTimer = setInterval(() => tick(), dropInterval)
}




function tick() {
    if (!running) return;
    if (!move(0, 1)) {
        // no pudo bajar -> fijar
        lockPiece();
        spawnPiece();
    }
    draw();
}


function move(dx, dy) {
    const nx = current.x + dx, ny = current.y + dy;
    if (!collides(nx, ny, current.rotation)) {
        current.x = nx; current.y = ny; return true;
    }
    return false;
}


function rotate(dir = 1) {

    const kicks = [0, -1, 1, -2, 2];
    for (const k of kicks) {
        if (!collides(current.x + k, current.y, current.rotation + dir)) {

            current.x += k;
            current.rotation += dir;
            current.rotation %= SHAPES[current.type].length;
            return true;

        }
    }

    return false

}



document.addEventListener('keydown', e => {
    if (e.code === "Space" || e.code === "Escape") {
        e.preventDefault();
    }
    if (!running) return;

    if (e.key === "ArrowLeft") {
        move(-1, 0);
    } else if (e.key === "ArrowRight") {
        move(1, 0);
    } else if (e.key === 'ArrowDown') {
        move(0, 1);
    } else if (e.key === 'ArrowUp') {
        rotate(1);
    } else if (e.code === "Space") {

        while (move(0, 1)) { };
        lockPiece();
        spawnPiece();;
    }
    draw();
})


function initGame() {
    resetGrid()
    score = 0;
    scoreEl.textContent = 0;
    dropInterval = 700;
    nextPiece = randomPiece();
    running = true;
    spawnPiece();
    if (dropTimer) clearInterval(dropTimer);
    dropTimer = setInterval(() => tick(), dropInterval);
}



startBtnEl.addEventListener('click', () => {
    initGame();
})




