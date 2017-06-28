// save the canvas for dimensions, and its 2d context for drawing to it
var canvas;
var canvasContext;

const FULL_SIZE_CANVAS = true; // responsive resizing?

var gameManager = new GameManager();
var inputManager = new inputManager();

var virtualHeight = 720.0;
var virtualWidth = 1280.0;

window.onload = function() {

    console.log("Initializing game engine...");

    canvas = document.getElementById('gameCanvas');

    if (FULL_SIZE_CANVAS) {
        window.addEventListener("resize", onResize);
        onResize();
    }

    if (USE_WEBGL_IF_SUPPORTED)    {
        init_webGL();
    }

    canvasContext = canvas.getContext('2d');

    if (!canvasContext) {
        console.log("canvasContext is null. We must be in webGL mode.");
    }

    loadImages();

    init_particles();
};

function onResize() { // changing window dimensions
    if (!canvas) return;
    var gameRatio = virtualHeight/virtualWidth;
    var widthIfHeightScaled = window.innerHeight / gameRatio;
    if(widthIfHeightScaled <= window.innerWidth) {
        canvas.width = widthIfHeightScaled;
        canvas.height = window.innerHeight;
        gameManager.gameScale = window.innerHeight/virtualHeight;
    } else {
        var heightIfWidthScaled = window.innerWidth * gameRatio;
        canvas.width = window.innerWidth;
        canvas.height = heightIfWidthScaled;
        gameManager.gameScale = window.innerWidth/virtualWidth;
    }
}


function loadingDoneSoStartGame() {
    gameManager.initialize();
}

