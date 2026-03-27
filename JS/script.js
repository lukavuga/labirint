const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const car = document.getElementById("car");
const timeDisplay = document.getElementById("time-val");

// JS resolucija platna ostane fiksna za logiko trkov.
canvas.width = 800;
canvas.height = 800;

/* --- GLOBALNE SPREMENLJIVKE --- */
let carX = 380;
let carY = 20;
let carAngle = 0;

let gameStarted = false; // To nam pove, ali se je igralec že premaknil
let startTime = 0;       // Tukaj bomo shranili točen čas začetka
let lastTime = 0;
let speedPerSecond = 138;
const hitboxRadiusX = 8;  
const hitboxRadiusY = 16; 

let keys = {};
let gameActive = true;
let cachedImageData = null; 

/* --- SVG PODATKI (LABIRINT) --- */
const svgData = `<svg width="800" height="800" viewBox="0 0 324 324" xmlns="http://www.w3.org/2000/svg">
<rect width="324" height="324" fill="#7f8c8d" />
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
const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
const url = URL.createObjectURL(svgBlob);

mazeImg.onload = () => {
    ctx.drawImage(mazeImg, 0, 0);
    cachedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    requestAnimationFrame(update);
};
mazeImg.src = url;

/* --- INPUT EVENTS --- */
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

/* --- PIXEL CHECK --- */
function getPixelType(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);

    if (x < 0 || x >= 800 || y < 0 || y >= 800) return "wall";
    if (!cachedImageData) return "wall"; 

    const index = (y * 800 + x) * 4;
    const r = cachedImageData[index];
    const g = cachedImageData[index + 1];
    const b = cachedImageData[index + 2];
    const a = cachedImageData[index + 3];

    if (r > 200 && g < 60 && b < 60) return "finish";
    if (r < 30 && g < 30 && b < 30 && a > 100) return "wall";

    return "road";
}

/* --- COLLISION --- */
function checkCollision(nx, ny) {
    const angleRad = carAngle * Math.PI / 180;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);
    
    const pointsToCheck = [];

    const outerPoints = 32; 
    for (let i = 0; i < outerPoints; i++) {
        let t = (i / outerPoints) * Math.PI * 2;
        pointsToCheck.push({
            x: hitboxRadiusX * Math.cos(t),
            y: hitboxRadiusY * Math.sin(t)
        });
    }

    const innerPoints = 16;
    for (let i = 0; i < innerPoints; i++) {
        let t = (i / innerPoints) * Math.PI * 2;
        pointsToCheck.push({
            x: (hitboxRadiusX * 0.5) * Math.cos(t),
            y: (hitboxRadiusY * 0.5) * Math.sin(t)
        });
    }

    pointsToCheck.push({x: 0, y: 0}); 
    pointsToCheck.push({x: 0, y: -hitboxRadiusY * 0.4}); 
    pointsToCheck.push({x: 0, y: hitboxRadiusY * 0.4});  
    pointsToCheck.push({x: 0, y: -hitboxRadiusY * 0.8}); 
    pointsToCheck.push({x: 0, y: hitboxRadiusY * 0.8});  
    pointsToCheck.push({x: -hitboxRadiusX * 0.6, y: 0}); 
    pointsToCheck.push({x: hitboxRadiusX * 0.6, y: 0});  

    for (let p of pointsToCheck) {
        let rx = p.x * cosA - p.y * sinA;
        let ry = p.x * sinA + p.y * cosA;
        
        let cx = nx + rx;
        let cy = ny + ry;
        
        const type = getPixelType(cx, cy);

        if (type === "wall") return true;

        if (type === "finish") {
            win();
            return false;
        }
    }
    return false;
}

/* --- WIN --- */
function win() {
    if (!gameActive) return;
    gameActive = false;

    setTimeout(() => {
        Swal.fire({
            title: "ZMAGA!",
            text: "Tvoj čas: " + ((Date.now() - startTime) / 1000).toFixed(1) + "s",
            icon: "success",
            background: "#2a2a35",
            color: "#fff",
            confirmButtonColor: "#2ecc71"
        }).then(() => location.reload());
    }, 100);
}

/* --- GAME LOOP --- */
function update(currentTime) {
    if (!gameActive) {
        lastTime = 0; 
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Pobriše star frame
    ctx.drawImage(mazeImg, 0, 0);                     // Nariše čist labirint
    drawSolution();

    if (!lastTime) lastTime = currentTime;
    let deltaTime = (currentTime - lastTime) / 1000; 
    lastTime = currentTime;

    if (deltaTime > 0.1) deltaTime = 0.016;

    // --- 1. DODATEK: PREVERJANJE PRVEGA PREMIKA ---
    // Če se igra še ni začela in igralec pritisne katerokoli smerno tipko:
    if (!gameStarted && (keys["w"] || keys["arrowup"] || keys["s"] || keys["arrowdown"] || 
                         keys["a"] || keys["arrowleft"] || keys["d"] || keys["arrowright"])) {
        gameStarted = true;
        startTime = Date.now(); // Shranimo točen trenutek prvega premika
    }
    // ----------------------------------------------

    let currentSpeed = speedPerSecond * deltaTime;
    let dx = 0;
    let dy = 0;

    if (keys["w"] || keys["arrowup"]) dy -= currentSpeed;
    if (keys["s"] || keys["arrowdown"]) dy += currentSpeed;
    if (keys["a"] || keys["arrowleft"]) dx -= currentSpeed;
    if (keys["d"] || keys["arrowright"]) dx += currentSpeed;

    let oldAngle = carAngle;

    if (dx !== 0 || dy !== 0) {
        let targetAngle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
        let diff = targetAngle - carAngle;

        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        carAngle += diff * 0.25;

        if (checkCollision(carX, carY)) {
            let spaceFound = false;
            let offsets = [
                {x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1},
                {x: 2, y: 0}, {x: -2, y: 0}, {x: 0, y: 2}, {x: 0, y: -2}
            ];
            
            for (let offset of offsets) {
                if (!checkCollision(carX + offset.x, carY + offset.y)) {
                    carX += offset.x;
                    carY += offset.y;
                    spaceFound = true;
                    break; 
                }
            }
            
            if (!spaceFound) {
                carAngle = oldAngle;
            }
        }
    }

    if (!checkCollision(carX + dx, carY)) {
        carX += dx;
    } else if (!checkCollision(carX + dx * 0.5, carY)) {
        carX += dx * 0.5;
    }

    if (!checkCollision(carX, carY + dy)) {
        carY += dy;
    } else if (!checkCollision(carX, carY + dy * 0.5)) {
        carY += dy * 0.5;
    }

    car.style.left = (carX / 8) + '%';
    car.style.top = (carY / 8) + '%';
    car.style.transform = "translate(-50%, -50%) rotate(" + carAngle + "deg)";

    // --- 2. POPRAVEK: ŠTOPARICA TEČE SAMO, ČE SE JE IGRA ZAČELA ---
    if (gameStarted) {
        // Dodal sem še + 's' na koncu, da lepo izpiše enoto (npr. 12.5s)
        timeDisplay.innerText = ((Date.now() - startTime) / 1000).toFixed(1) + "s";
    }
    // --------------------------------------------------------------

    requestAnimationFrame(update);
}

/* --- SISTEM ZA PRIKAZ REŠITVE (Gumb Pokaži/Skrij & Centrirana pot) --- */
const solutionBtn = document.getElementById("show-solution-btn");
let solutionPath = null;      // Tukaj bomo shranili izračunano pot
let isSolutionVisible = false; // Status, ali je črta trenutno narisana

if (solutionBtn) {
    solutionBtn.addEventListener("click", () => {
        isSolutionVisible = !isSolutionVisible; // Preklopimo status (True/False)
        
        if (isSolutionVisible) {
            solutionBtn.innerText = "SKRIJ REŠITEV";
            // Če pot še ni bila izračunana, jo izračunamo zdaj
            if (!solutionPath && cachedImageData) {
                calculateCenteredPath();
            }
        } else {
            solutionBtn.innerText = "POKAŽI REŠITEV";
        }
    });
}

function calculateCenteredPath() {
    const step = 4; // Manjši korak za bolj natančno iskanje
    const cols = Math.floor(800 / step);
    const rows = Math.floor(800 / step);

    let startX = Math.floor(380 / step);
    let startY = Math.floor(20 / step);

    let queue = [ {x: startX, y: startY} ];
    let visited = new Uint8Array(cols * rows);
    visited[startY * cols + startX] = 1;

    let parents = new Map();
    let endNode = null;

    const dirs = [
        {dx: 0, dy: -1}, {dx: 0, dy: 1},
        {dx: -1, dy: 0}, {dx: 1, dy: 0}
    ];

    // POMEMBNO: Varnostni radij. S tem algoritem prisilimo, da se drži stran od sten.
    // Če ti noče zarisati poti (ker so hodniki preozki), zmanjšaj to številko na 8 ali 9.
    const clearance = 10; 

    while(queue.length > 0) {
        let curr = queue.shift();
        let px = curr.x * step;
        let py = curr.y * step;

        if (getPixelType(px, py) === "finish") {
            endNode = curr;
            break;
        }

        for (let d of dirs) {
            let nx = curr.x + d.dx;
            let ny = curr.y + d.dy;

            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                let idx = ny * cols + nx;
                
                if (!visited[idx]) {
                    let safe = true;
                    let cx = px + d.dx * step;
                    let cy = py + d.dy * step;
                    
                    // Preverimo širši "oklep" okoli točke, da zagotovimo, da je na sredini
                    for (let offsetX = -clearance; offsetX <= clearance; offsetX += 4) {
                        for (let offsetY = -clearance; offsetY <= clearance; offsetY += 4) {
                            if (getPixelType(cx + offsetX, cy + offsetY) === "wall") {
                                safe = false;
                                break;
                            }
                        }
                        if (!safe) break;
                    }

                    if (safe) {
                        visited[idx] = 1;
                        parents.set(`${nx},${ny}`, curr);
                        queue.push({x: nx, y: ny});
                    }
                }
            }
        }
    }

    if (endNode) {
        let rawPath = [];
        let curr = endNode;
        while(curr) {
            rawPath.push({x: curr.x * step, y: curr.y * step});
            curr = parents.get(`${curr.x},${curr.y}`);
        }
        rawPath.reverse();

        // 2. GLAJENJE POTI (Smoothing) - 5 prehodov za lepe, okrogle ovinke
        let smoothedPath = rawPath;
        for (let pass = 0; pass < 5; pass++) {
            let temp = [];
            for (let i = 0; i < smoothedPath.length; i++) {
                if (i === 0 || i === smoothedPath.length - 1) {
                    temp.push(smoothedPath[i]); // Začetek in konec ostaneta na miru
                } else {
                    // Točko premaknemo na povprečje prejšnje, trenutne in naslednje
                    temp.push({
                        x: (smoothedPath[i-1].x + smoothedPath[i].x + smoothedPath[i+1].x) / 3,
                        y: (smoothedPath[i-1].y + smoothedPath[i].y + smoothedPath[i+1].y) / 3
                    });
                }
            }
            smoothedPath = temp;
        }
        
        solutionPath = smoothedPath;
    }
}

// Ta funkcija zdaj samo riše že izračunano pot
function drawSolution() {
    if (!isSolutionVisible || !solutionPath) return;

    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)"; 
    ctx.setLineDash([20, 15]); // Daljša črta za boljši občutek ceste
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let i = 0; i < solutionPath.length; i++) {
        let p = solutionPath[i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.setLineDash([]); 
}
