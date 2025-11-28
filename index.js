const messageHeading = document.getElementById("ButtonDescription");
const mousePosDisplay = document.getElementById("mousePosDisplay");
const showTextButton = document.getElementById("showTextButton");

const squares = [];
let mouseX = null;
let mouseY = null;
let lastTime = null;
const speed = 200;

showTextButton.addEventListener("click", function () {
    if (messageHeading.textContent === "None") {
        messageHeading.textContent = "Hello from index.js!";
    } else {
        messageHeading.textContent = "None";
    }
});

document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (mousePosDisplay) {
        mousePosDisplay.textContent = `Mouse position: x ${event.clientX}, y ${event.clientY}`;
    }
});

const loop = (time) => {
    if (mouseX === null || mouseY === null) {
        requestAnimationFrame(loop);
        return;
    }

    if (lastTime === null) {
        lastTime = time;
    }

    const delta = (time - lastTime) / 1000;
    lastTime = time;

    squares.forEach((square) => moveSquareTowardMouseDelta(square, delta, squares));
    
    requestAnimationFrame(loop);
};

requestAnimationFrame(loop);

document.addEventListener("click", (event) => {
    if (event.target.closest("#showTextButton")) {
        return;
    }

    const square = document.createElement("div");
    square.className = "click-square";
    square.dataset.x = event.clientX;
    square.dataset.y = event.clientY;
    square.style.left = `${event.clientX}px`;
    square.style.top = `${event.clientY}px`;

    document.body.appendChild(square);
    squares.push(square);
});

function moveSquareTowardMouseDelta(square, delta, squares) {
    const currentX = parseFloat(square.dataset.x) || 0;
    const currentY = parseFloat(square.dataset.y) || 0;
    const dx = mouseX - currentX;
    const dy = mouseY - currentY;
    const distance = Math.hypot(dx, dy);

    if (!distance || delta <= 0) {
        return;
    }

    const step = Math.min(distance, speed * delta);
    const nextX = currentX + (dx / distance) * step;
    const nextY = currentY + (dy / distance) * step;

    square.dataset.x = nextX;
    square.dataset.y = nextY;
    square.style.left = `${nextX}px`;
    square.style.top = `${nextY}px`;

    resolveSquareCollisions(square, squares, 16);
}

function resolveSquareCollisions(squareToCheck, squares, radius) {
    squares.forEach((square) => {
        if (square === squareToCheck) {
            return;
        }

        if (!checkOverlap(squareToCheck, square, radius)) {
            return;
        }
        else {
            squareToCheckX = parseFloat(squareToCheck.dataset.x);
            squareToCheckY = parseFloat(squareToCheck.dataset.y);
            squareX = parseFloat(square.dataset.x);
            squareY = parseFloat(square.dataset.y);
            xDiff = squareToCheckX - squareX;
            yDiff = squareToCheckY - squareY;
            distance = findDistance(squareToCheckX, squareToCheckY, squareX, squareY);

            normalizeXDiff = xDiff / distance;
            normalizeYDiff = yDiff / distance;
            if (distance  > radius * 2) {
                return;
            } 
            else {
                minDistance = radius * 2;
                distanceToPush = minDistance - distance;
                xDistanceToPush = distanceToPush * normalizeXDiff; 
                yDistanceToPush = distanceToPush * normalizeYDiff;
                const newX = squareToCheckX + xDistanceToPush;
                const newY = squareToCheckY + yDistanceToPush;
                squareToCheck.dataset.x = newX;
                squareToCheck.dataset.y = newY;
                // if (Math.abs(xDiff) < radius * 2 && (Math.abs(xDiff) > Math.abs(yDiff))) {
                //     squareToCheck.dataset.x = squareX + Math.sign(xDiff) * radius * 2;
                //     return;
                // }

                // else if (Math.abs(yDiff) < radius * 2) {
                //     squareToCheck.dataset.y = squareY + Math.sign(yDiff) * radius * 2;
                //     return;
                // }
            }
        }

    });
}
function findDistance(squareX, squareY, square2X, square2Y) {
    const dist = Math.hypot(square2X - squareX, square2Y - squareY);
    return Math.abs(dist);
}

function checkOverlap(squareA, squareB, radius) {
    const x1 = parseFloat(squareA.dataset.x) || 0;
    const y1 = parseFloat(squareA.dataset.y) || 0;
    const x2 = parseFloat(squareB.dataset.x) || 0;
    const y2 = parseFloat(squareB.dataset.y) || 0;
    const dist = Math.hypot(x2 - x1, y2 - y1);

    return dist < radius * 2;
}
