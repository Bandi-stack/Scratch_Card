
// Define the items, their probabilities, and corresponding images
const items = [
    {  weight:70,image: 'connect.png' },
    { weight: 5,image: 'boat-removebg.png' },
    {  weight: 5,image: 'pebble_smart_watch.jpg' },
    {  weight: 5,image: 'Watch2_pro.jpg' },
    {  weight:5,image: 'Watch_2.jpg' },
    { weight:5 ,image: 'zaviaa.png'},
    { weight:5 ,image: 'Realme_buds_wireless.png'}

];

function getRandomItem(items) {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const randomNum = Math.random() * totalWeight;

    let cumulativeWeight = 0;
    for (const item of items) {
        cumulativeWeight += item.weight;
        if (randomNum <= cumulativeWeight) {
            return item;
        }
    }
}

// Initialize the scratch card
const canvas = document.getElementById('scratch-canvas');
const ctx = canvas.getContext('2d');
const prizeText = document.getElementById('prize-text');
const prizeImage = document.getElementById('prize-image');
let isScratching = false;

function initScratchCard() {
    // Set the prize
    const prize = getRandomItem(items);
    prizeText.textContent = prize.name;
    prizeImage.src = prize.image;
    prizeImage.style.display = 'none'; // Hide the image initially

    // Setup the canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = '#888';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the "scratch" overlay
    ctx.fillStyle = 'silver';
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'destination-out';

    // Event listeners for scratching
    canvas.addEventListener('mousedown', startScratch);
    canvas.addEventListener('mouseup', stopScratch);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchstart', startScratch);
    canvas.addEventListener('touchend', stopScratch);
    canvas.addEventListener('touchmove', scratch);
}

function startScratch() {
    isScratching = true;
}

function stopScratch() {
    isScratching = false;
    checkScratchProgress();
}

function scratch(event) {
    if (!isScratching) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
    const y = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top;

    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
}

function checkScratchProgress() {
    // Check the percentage of the canvas that has been scratched
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let scratchedPixels = 0;
    const totalPixels = imageData.data.length / 4; // Each pixel has 4 values (RGBA)

    for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0) scratchedPixels++;
    }

    const scratchPercentage = (scratchedPixels / totalPixels) * 100;

    if (scratchPercentage > 20) {
        // Reveal the prize
        canvas.style.display = 'none'; // Hide the canvas
        prizeImage.style.display = 'block'; // Show the image
    }
}



function resetScratchCard() {
    canvas.style.display = 'block'; // Show the canvas again
    initScratchCard();
}

// Initialize on page load
window.onload = () => {
    initScratchCard();
};