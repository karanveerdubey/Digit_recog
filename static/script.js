const canvas = document.getElementById('handwriting-canvas');

const ctx = canvas.getContext('2d');
let isDrawing = false;
let history = [];
let current = []

ctx.lineWidth = 10;
ctx.fillStyle = 'white';
ctx.fillRect(0,0, canvas.width, canvas.height);



function resetCanvas() {
    ctx.fillStyle = 'white';  // Set the color to white
    ctx.fillRect(0, 0, canvas.width, canvas.height);  // Fill the entire canvas with white
    history = [];  // Reset history
    history.push(canvas.toDataURL());  // Save the initial state with the white background
}

function saveState(){
    history.push(canvas.toDataURL());
    if (history.length > 9) history.shift();
}

function startDrawing(e) {
    isDrawing = true;
    ctx.beginPath();
    // For touch events, get the touch position
    if (e.touches) e = e.touches[0];
    ctx.moveTo(e.offsetX || e.clientX - canvas.offsetLeft, 
               e.offsetY || e.clientY - canvas.offsetTop);
}

function draw(e) {
    if (!isDrawing) return;
    // For touch events, get the touch position
    if (e.touches) e = e.touches[0];
    ctx.lineTo(e.offsetX || e.clientX - canvas.offsetLeft, 
               e.offsetY || e.clientY - canvas.offsetTop);
    ctx.stroke();
}

function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
    }
}

canvas.addEventListener('mousedown', (e) => {
    saveState();
    startDrawing(e);
});
canvas.addEventListener('mousemove', draw);
window.addEventListener('mouseup', stopDrawing);

// Touch events
canvas.addEventListener('touchstart', (e) => {
    saveState();
    startDrawing(e);
});
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

// Prevent scrolling when touching the canvas
function preventScrolling(e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
}

document.body.addEventListener("touchstart", preventScrolling, { passive: false });
document.body.addEventListener("touchend", preventScrolling, { passive: false });
document.body.addEventListener("touchmove", preventScrolling, { passive: false });

// Undo Functionality

function undo() {
    if (history.length > 0) {
        const previousState = history.pop();
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = previousState;
    }
}

document.getElementById('undo-button').addEventListener('click', undo);

// Listen for keyboard events
window.addEventListener('keydown', function(event) {
    // Check if Ctrl or Command (for Mac) is pressed along with Z
    if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();  // Prevent the default action of the keypress
        undo();  // Call the undo function
    }
});

window.addEventListener('keypress', function(event){
    if(event.key =='Enter'){
        event.preventDefault();
        this.document.getElementById('submit-button').click();
    }
})

// Clear Functionality
document.getElementById('clear-button').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    history = []; // Clear history on clearing canvas
    resetCanvas();
});

document.getElementById('submit-button').addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');

    // document.getElementById('debug-image').src = dataURL;

    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: dataURL })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('prediction-result').innerText = 'Recognized Digit: ' + data.prediction;
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('prediction-result').innerText = 'Error in analysis';
    });
});

// script.js
document.addEventListener("DOMContentLoaded", function() {
    const starContainer = document.getElementById('stars-container');
    const numberOfStars = 100;

    for (let i = 0; i < numberOfStars; i++) {
        let star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDuration = `${Math.random() * 3 + 5}s`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        starContainer.appendChild(star);
    }
});
