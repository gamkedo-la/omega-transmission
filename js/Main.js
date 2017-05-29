// save the canvas for dimensions, and its 2d context for drawing to it
var canvas;
var canvasContext;

var gameManager = new GameManager();
var inputManager = new inputManager();



window.onload = function() {
    canvas = document.getElementById('gameCanvas');
  
if (USE_WEBGL_IF_SUPPORTED)	init_webGL(); // now!

  canvasContext = canvas.getContext('2d');
  	if (!canvasContext) {
		console.log("ERROR: no canvasContext!");
		// this can happen if webGL grabs it instead
	}
  
    loadImages();
}

function loadingDoneSoStartGame() {
    var framesPerSecond = 60;
    setInterval(function() {
        gameManager.update();
        }, 1000/framesPerSecond);


    gameManager.initialize();
}
