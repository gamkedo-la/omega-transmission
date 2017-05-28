var playerImage = document.createElement("img");
var UFOImage = document.createElement("img");

var imagesToLoad = 0;

function countLoadedImageAndLaunchIfReady() {
    imagesToLoad--;
    if (imagesToLoad == 0) { 
        loadingDoneSoStartGame();
    }
}

function beginLoadingImage(image, fileName) {
    image.onload = countLoadedImageAndLaunchIfReady;
    image.src = "images/" + fileName;
}

function loadImages() {
    var imageList = [
        {varName:playerImage, fileName:"player1.png"},
        {varName:UFOImage, fileName:"ufo.png"}
    ];

    imagesToLoad = imageList.length;

    for(var i = 0; i < imageList.length; i++) {
        beginLoadingImage(imageList[i].varName, imageList[i].fileName);
    } 
} 