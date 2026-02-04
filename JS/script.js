const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const car = document.getElementById('car');
const timeDisplay = document.getElementById('time-val');

canvas.width = 800;
canvas.height = 800;

// --- POPRAVLJENE ZAČETNE KOORDINATE ZA VARNOST ---
let carX = 380; // Sredina belega prehoda na vrhu
let carY = 20;  // Višje zgoraj, da se ne dotika prve vodoravne črte
const speed = 1.5; 
let keys = {};
let startTime = Date.now();
let gameActive = true;

// Celoten labirint
const svgData = `<svg width="800" height="800" viewBox="0 0 324 324" xmlns="http://www.w3.org/2000/svg">
<rect width="324" height="324" fill="#7db154" />
<g fill="none" stroke="#000000" stroke-width="2" stroke-linecap="square">
<line x1="2" y1="2" x2="146" y2="2" /> <line x1="162" y1="2" x2="322" y2="2" />
<line x1="34" y1="18" x2="50" y2="18" /> <line x1="66" y1="18" x2="146" y2="18" />
<line x1="178" y1="18" x2="194" y2="18" /> <line x1="226" y1="18" x2="242" y2="18" />
<line x1="18" y1="34" x2="34" y2="34" /> <line x1="82" y1="34" x2="146" y2="34" />
<line x1="162" y1="34" x2="178" y2="34" /> <line x1="242" y1="34" x2="258" y2="34" />
<line x1="274" y1="34" x2="306" y2="34" /> <line x1="2" y1="50" x2="34" y2="50" />
<line x1="50" y1="50" x2="66" y2="50" /> <line x1="98" y1="50" x2="130" y2="50" />
<line x1="146" y1="50" x2="226" y2="50" /> <line x1="258" y1="50" x2="274" y2="50" />
<line x1="290" y1="50" x2="322" y2="50" /> <line x1="66" y1="66" x2="98" y2="66" />
<line x1="130" y1="66" x2="162" y2="66" /> <line x1="178" y1="66" x2="210" y2="66" />
<line x1="226" y1="66" x2="242" y2="66" /> <line x1="274" y1="66" x2="290" y2="66" />
<line x1="34" y1="82" x2="130" y2="82" /> <line x1="162" y1="82" x2="178" y2="82" />
<line x1="194" y1="82" x2="226" y2="82" /> <line x1="258" y1="82" x2="306" y2="82" />
<line x1="18" y1="98" x2="34" y2="98" /> <line x1="82" y1="98" x2="146" y2="98" />
<line x1="178" y1="98" x2="210" y2="98" /> <line x1="258" y1="98" x2="274" y2="98" />
<line x1="290" y1="98" x2="322" y2="98" /> <line x1="50" y1="114" x2="114" y2="114" />
<line x1="130" y1="114" x2="178" y2="114" /> <line x1="210" y1="114" x2="226" y2="114" />
<line x1="242" y1="114" x2="306" y2="114" /> <line x1="34" y1="130" x2="50" y2="130" />
<line x1="66" y1="130" x2="82" y2="130" /> <line x1="98" y1="130" x2="130" y2="130" />
<line x1="146" y1="130" x2="162" y2="130" /> <line x1="178" y1="130" x2="210" y2="130" />
<line x1="226" y1="130" x2="258" y2="130" /> <line x1="290" y1="130" x2="322" y2="130" />
<line x1="18" y1="146" x2="66" y2="146" /> <line x1="114" y1="146" x2="146" y2="146" />
<line x1="194" y1="146" x2="226" y2="146" /> <line x1="242" y1="146" x2="274" y2="146" />
<line x1="306" y1="146" x2="322" y2="146" /> <line x1="50" y1="162" x2="66" y2="162" />
<line x1="114" y1="162" x2="162" y2="162" /> <line x1="178" y1="162" x2="194" y2="162" />
<line x1="210" y1="162" x2="226" y2="162" /> <line x1="274" y1="162" x2="306" y2="162" />
<line x1="2" y1="178" x2="18" y2="178" /> <line x1="34" y1="178" x2="50" y2="178" />
<line x1="66" y1="178" x2="82" y2="178" /> <line x1="130" y1="178" x2="162" y2="178" />
<line x1="194" y1="178" x2="210" y2="178" /> <line x1="226" y1="178" x2="258" y2="178" />
<line x1="290" y1="178" x2="322" y2="178" /> <line x1="50" y1="194" x2="66" y2="194" />
<line x1="114" y1="194" x2="130" y2="194" /> <line x1="162" y1="194" x2="194" y2="194" />
<line x1="210" y1="194" x2="226" y2="194" /> <line x1="258" y1="194" x2="290" y2="194" />
<line x1="18" y1="210" x2="66" y2="210" /> <line x1="82" y1="210" x2="146" y2="210" />
<line x1="162" y1="210" x2="194" y2="210" /> <line x1="226" y1="210" x2="242" y2="210" />
<line x1="274" y1="210" x2="306" y2="210" /> <line x1="2" y1="226" x2="50" y2="226" />
<line x1="66" y1="226" x2="98" y2="226" /> <line x1="146" y1="226" x2="162" y2="226" />
<line x1="178" y1="226" x2="210" y2="226" /> <line x1="242" y1="226" x2="306" y2="226" />
<line x1="50" y1="242" x2="66" y2="242" /> <line x1="98" y1="242" x2="114" y2="242" />
<line x1="146" y1="242" x2="194" y2="242" /> <line x1="210" y1="242" x2="226" y2="242" />
<line x1="242" y1="242" x2="258" y2="242" /> <line x1="274" y1="242" x2="290" y2="242" />
<line x1="18" y1="258" x2="50" y2="258" /> <line x1="82" y1="258" x2="98" y2="258" />
<line x1="130" y1="258" x2="146" y2="258" /> <line x1="194" y1="258" x2="210" y2="258" />
<line x1="258" y1="258" x2="274" y2="258" /> <line x1="18" y1="274" x2="50" y2="274" />
<line x1="82" y1="274" x2="98" y2="274" /> <line x1="146" y1="274" x2="162" y2="274" />
<line x1="210" y1="274" x2="226" y2="274" /> <line x1="274" y1="274" x2="322" y2="274" />
<line x1="2" y1="290" x2="34" y2="290" /> <line x1="98" y1="290" x2="114" y2="290" />
<line x1="130" y1="290" x2="178" y2="290" /> <line x1="194" y1="290" x2="210" y2="290" />
<line x1="242" y1="290" x2="306" y2="290" /> <line x1="34" y1="306" x2="66" y2="306" />
<line x1="114" y1="306" x2="130" y2="306" /> <line x1="226" y1="306" x2="258" y2="306" />
<line x1="274" y1="306" x2="290" y2="306" /> <line x1="2" y1="322" x2="162" y2="322" />
<line x1="178" y1="322" x2="322" y2="322" />
<line x1="2" y1="2" x2="2" y2="322" /> 
<line x1="322" y1="2" x2="322" y2="322" />
<line x1="18" y1="18" x2="18" y2="34" />
<line x1="18" y1="66" x2="18" y2="162" /> <line x1="18" y1="178" x2="18" y2="194" />
<line x1="18" y1="226" x2="18" y2="242" /> <line x1="18" y1="290" x2="18" y2="306" />
<line x1="34" y1="2" x2="34" y2="18" /> <line x1="34" y1="34" x2="34" y2="82" />
<line x1="34" y1="114" x2="34" y2="130" /> <line x1="34" y1="146" x2="34" y2="210" />
<line x1="34" y1="242" x2="34" y2="258" /> <line x1="50" y1="18" x2="50" y2="66" />
<line x1="50" y1="82" x2="50" y2="98" /> <line x1="50" y1="114" x2="50" y2="130" />
<line x1="50" y1="226" x2="50" y2="242" /> <line x1="50" y1="258" x2="50" y2="306" />
<line x1="66" y1="18" x2="66" y2="50" /> <line x1="66" y1="98" x2="66" y2="114" />
<line x1="66" y1="130" x2="66" y2="146" /> <line x1="66" y1="162" x2="66" y2="178" />
<line x1="66" y1="194" x2="66" y2="226" /> <line x1="66" y1="242" x2="66" y2="306" />
<line x1="82" y1="34" x2="82" y2="50" /> <line x1="82" y1="82" x2="82" y2="98" />
<line x1="82" y1="130" x2="82" y2="210" /> <line x1="82" y1="242" x2="82" y2="322" />
<line x1="98" y1="50" x2="98" y2="66" /> <line x1="98" y1="114" x2="98" y2="194" />
<line x1="98" y1="290" x2="98" y2="306" /> <line x1="114" y1="66" x2="114" y2="82" />
<line x1="114" y1="178" x2="114" y2="306" /> <line x1="130" y1="50" x2="130" y2="66" />
<line x1="130" y1="114" x2="130" y2="130" /> <line x1="130" y1="226" x2="130" y2="290" />
<line x1="130" y1="306" x2="130" y2="322" /> <line x1="146" y1="34" x2="146" y2="50" />
<line x1="146" y1="66" x2="146" y2="98" /> <line x1="146" y1="130" x2="146" y2="146" />
<line x1="146" y1="178" x2="146" y2="242" /> <line x1="146" y1="258" x2="146" y2="274" />
<line x1="146" y1="290" x2="146" y2="306" /> <line x1="162" y1="2" x2="162" y2="34" />
<line x1="162" y1="50" x2="162" y2="66" /> <line x1="162" y1="82" x2="162" y2="114" />
<line x1="162" y1="130" x2="162" y2="178" /> <line x1="162" y1="194" x2="162" y2="210" />
<line x1="162" y1="242" x2="162" y2="258" /> <line x1="162" y1="306" x2="162" y2="322" />
<line x1="178" y1="66" x2="178" y2="98" /> <line x1="178" y1="114" x2="178" y2="194" />
<line x1="178" y1="210" x2="178" y2="226" /> <line x1="178" y1="258" x2="178" y2="322" />
<line x1="194" y1="18" x2="194" y2="50" /> <line x1="194" y1="98" x2="194" y2="114" />
<line x1="194" y1="162" x2="194" y2="178" /> <line x1="194" y1="242" x2="194" y2="290" />
<line x1="194" y1="306" x2="194" y2="322" /> <line x1="210" y1="2" x2="210" y2="34" />
<line x1="210" y1="66" x2="210" y2="82" /> <line x1="210" y1="114" x2="210" y2="130" />
<line x1="210" y1="210" x2="210" y2="242" /> <line x1="210" y1="290" x2="210" y2="306" />
<line x1="226" y1="18" x2="226" y2="66" /> <line x1="226" y1="82" x2="226" y2="98" />
<line x1="226" y1="114" x2="226" y2="146" /> <line x1="226" y1="162" x2="226" y2="210" />
<line x1="226" y1="226" x2="226" y2="322" /> <line x1="242" y1="34" x2="242" y2="50" />
<line x1="242" y1="66" x2="242" y2="114" /> <line x1="242" y1="146" x2="242" y2="162" />
<line x1="242" y1="194" x2="242" y2="210" /> <line x1="242" y1="226" x2="242" y2="290" />
<line x1="258" y1="2" x2="258" y2="82" /> <line x1="258" y1="130" x2="258" y2="146" />
<line x1="258" y1="162" x2="258" y2="194" /> <line x1="258" y1="210" x2="258" y2="226" />
<line x1="258" y1="258" x2="258" y2="274" /> <line x1="274" y1="18" x2="274" y2="34" />
<line x1="274" y1="98" x2="274" y2="130" /> <line x1="274" y1="146" x2="274" y2="178" />
<line x1="274" y1="194" x2="274" y2="210" /> <line x1="274" y1="226" x2="274" y2="258" />
<line x1="274" y1="274" x2="274" y2="290" /> <line x1="290" y1="2" x2="290" y2="18" />
<line x1="290" y1="34" x2="290" y2="66" /> <line x1="290" y1="130" x2="290" y2="146" />
<line x1="290" y1="178" x2="290" y2="194" /> <line x1="290" y1="258" x2="290" y2="274" />
<line x1="290" y1="306" x2="290" y2="322" /> <line x1="306" y1="18" x2="306" y2="34" />
<line x1="306" y1="66" x2="306" y2="82" /> <line x1="306" y1="194" x2="306" y2="210" />
<line x1="306" y1="226" x2="306" y2="258" /> <line x1="306" y1="290" x2="306" y2="306" />
</g>
<rect x="162" y="318" width="16" height="6" fill="#ff0000" />
</svg>`;

const mazeImg = new Image();
const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
const url = URL.createObjectURL(svgBlob);
mazeImg.onload = () => ctx.drawImage(mazeImg, 0, 0);
mazeImg.src = url;

window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function getPixelType(x, y) {
    if (x < 0 || x >= 800 || y < 0 || y >= 800) return "wall";
    // Uporabimo RGBA podatke piksla na platnu
    const p = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
    // Rdeča ciljna črta
    if (p[0] > 200 && p[1] < 50 && p[2] < 50) return "finish"; 
    // Črna stena (vse kar je temno in ni prosojno)
    if (p[0] < 60 && p[1] < 60 && p[2] < 60 && p[3] > 0) return "wall"; 
    return "road";
}

function checkCollision(nx, ny) {
    const radius = 10; // Zmanjšan krog za lažjo vožnjo v ozkih hodnikih
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        const cx = nx + Math.cos(angle) * radius;
        const cy = ny + Math.sin(angle) * radius;
        const type = getPixelType(cx, cy);
        if (type === "wall") return true;
        if (type === "finish") { win(); return false; }
    }
    return false;
}

function win() {
    if(!gameActive) return;
    gameActive = false;
    setTimeout(() => {
        alert("ZMAGA! Čas: " + ((Date.now() - startTime) / 1000).toFixed(1) + "s");
        location.reload();
    }, 100);
}

function update() {
    if (!gameActive) return;

    let dx = 0, dy = 0;
    if (keys['w'] || keys['arrowup']) dy -= speed;
    if (keys['s'] || keys['arrowdown']) dy += speed;
    if (keys['a'] || keys['arrowleft']) dx -= speed;
    if (keys['d'] || keys['arrowright']) dx += speed;

    // Normalizacija diagonalnega gibanja
    if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }

    const currentlyInWall = checkCollision(carX, carY);

    // Gibanje po X osi: dovoljeno če ni trka ALI če smo v zidu in se premikamo ven
    if (dx !== 0) {
        const nextXInWall = checkCollision(carX + dx, carY);
        if (!nextXInWall || (currentlyInWall && !nextXInWall)) {
            carX += dx;
        }
    }
    
    // Gibanje po Y osi
    if (dy !== 0) {
        const nextYInWall = checkCollision(carX, carY + dy);
        if (!nextYInWall || (currentlyInWall && !nextYInWall)) {
            carY += dy;
        }
    }

    // Posodobitev vizualne pozicije
    car.style.left = carX + 'px';
    car.style.top = carY + 'px';
    
    if (dx !== 0 || dy !== 0) updateRotation(dx, dy);

    timeDisplay.innerText = ((Date.now() - startTime) / 1000).toFixed(1);
    requestAnimationFrame(update);
}

function updateRotation(dx, dy) {
    let dir = "";
    if (dy < -0.1) dir += "up"; else if (dy > 0.1) dir += "down";
    if (dx < -0.1) dir += (dir ? "Left" : "left"); else if (dx > 0.1) dir += (dir ? "Right" : "right");
    if (dir) {
        const newSrc = `../slike/${dir}.png`;
        if (car.src !== newSrc) car.src = newSrc;
    }
}

// Zagon zanke

update();
