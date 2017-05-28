// save the canvas for dimensions, and its 2d context for drawing to it
var canvas;
var canvasContext;

var gameManager = new GameManager();
var inputManager = new inputManager();



window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
  
    loadImages();
}

function loadingDoneSoStartGame() {
    var framesPerSecond = 60;
    setInterval(function() {
        gameManager.update();
        }, 1000/framesPerSecond);


    gameManager.initialize();
}
