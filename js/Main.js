// save the canvas for dimensions, and its 2d context for drawing to it
var canvas;
var canvasContext;

const FULL_SIZE_CANVAS = true; // responsive resizing?

var gameManager = new GameManager();
var inputManager = new inputManager();



window.onload = function() {

    console.log("Initializing game engine...");
    
    canvas = document.getElementById('gameCanvas');

    if (FULL_SIZE_CANVAS) {
        window.addEventListener("resize", onResize);
        onResize();
    }

    if (USE_WEBGL_IF_SUPPORTED)	{
        init_webGL();
    }

    canvasContext = canvas.getContext('2d');

    if (!canvasContext) {
        console.log("canvasContext is null. We must be in webGL mode.");
    }

    loadImages();
}

function onResize() { // full screen
    if (!canvas) return;
    console.log("resizing canvas to " + window.innerWidth + ", " + window.innerHeight);
    canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}


function loadingDoneSoStartGame() {
    var framesPerSecond = 60;
    
    // FIXME: for performance (and battery saving) we should use requestAnimationFrame(gameManager.update);

    setInterval(function() {
        gameManager.update();
        }, 1000/framesPerSecond);

    gameManager.initialize();
}
