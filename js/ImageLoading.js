var playerImage = document.createElement("img");
var playerShield = document.createElement("img");
var bulletImage = document.createElement("img");
var plasmaImage = document.createElement("img");
var UFOShooterImage = document.createElement("img");
var UFORammerImage = document.createElement("img");
var UFOFleetImage = document.createElement("img");
var backgroundImage = document.createElement("img");
var plasmaPowerup = document.createElement("img");
var shieldPowerup = document.createElement("img");
var healthPowerup = document.createElement("img");
var tripleShotPowerup = document.createElement("img");
var UFOBossImage = document.createElement("img");

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
        { varName: playerImage, fileName: "Player.png" },
        { varName: playerShield, fileName: "playerShield.png" },
        { varName: bulletImage, fileName: "Bullet.png" },
        // { varName: plasmaImage, fileName: "Plasma.png" },
        { varName: plasmaImage, fileName: "Plasma2.png" },
        { varName: UFOShooterImage, fileName: "Cannondrone.png" },
        { varName: UFORammerImage, fileName: "Speardrone.png" },
        { varName: UFOFleetImage, fileName: "Fleetdrone.png" },
        //{varName: backgroundImage, fileName: "nebulae test.png" },
        //{varName: backgroundImage, fileName: "nebulae_abstract.png" },
        {varName: backgroundImage, fileName: "nebulae_abstract_2.png" },
        //{ varName: backgroundImage, fileName: "nebulae_lowbrightness_nostars.png" },
        //{ varName: backgroundImage, fileName: "nebulae_lowbrightness_stars.png" },
        //{ varName: backgroundImage, fileName: "nebulae_nostars.png" },
        { varName: plasmaPowerup, fileName: "plasmaPowerup.png" },
        { varName: shieldPowerup, fileName: "shieldPowerup.png" },
        { varName: healthPowerup, fileName: "healthPowerup.png" },
        { varName: tripleShotPowerup, fileName: "tripleShotPowerup.png" },
        { varName: UFOBossImage, fileName: "boss1.png" },
    ];

    imagesToLoad = imageList.length;

    for(var i = 0; i < imageList.length; i++) {
        beginLoadingImage(imageList[i].varName, imageList[i].fileName);
    }
}

