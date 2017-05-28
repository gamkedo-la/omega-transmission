function GameManager() {

    this.player = new Ship();
    this.playerShots = [];
    this.enemies = [new UFO(), new UFO(), new UFO(), new UFO()];
    this.enemyShots = [];

    this.initialize = function() {
        this.player.initialize(playerImage);
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].initialize(UFOImage);
        }
        //initializeInput(); 
        inputManager.initializeInput();
    }

    this.moveEverything = function () {
        this.player.update();
        for (var i = this.playerShots.length - 1; i >= 0; i--) {
            if (this.playerShots[i].shotLife <= 0) {
                this.playerShots.splice(i, 1);
            }
            else {
                this.playerShots[i].move();
            }
        }
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update();
        }
        for (var i = this.enemyShots.length - 1; i >= 0; i--) {
            if (this.enemyShots[i].shotLife <= 0) {
                this.enemyShots.splice(i, 1);
            }
            else {
                this.enemyShots[i].move();
            }
        }
        this.checkForCollisions();

        if (this.player.health <= 0) {
            this.player = new Ship();
            this.player.initialize(playerImage);
            inputManager.initializeInput();
        }
    }

    this.checkForCollisions = function () {
        for (var i = 0; i < this.enemyShots.length; i++) {
            if (this.isOverlapping(this.player, this.enemyShots[i]) == true) {
                this.player.health--;
                this.enemyShots[i].reset();
            }
        }
        for (var i = 0; i < this.enemies.length; i++) {
            if (this.isOverlapping(this.player, this.enemies[i]) == true) {
                this.player.reset();
                this.player.health--;
                document.getElementById("debugText").innerHTML = "Player Crashed!";
            }
            for (var j = 0; j < this.playerShots.length; j++) {
                if (this.isOverlapping(this.playerShots[j], this.enemies[i]) == true) {
                    this.enemies[i].health--;
                    if (this.enemies[i].health <= 0) {
                        this.enemies[i].reset();
                    }
                    this.playerShots[j].reset();
                    document.getElementById("debugText").innerHTML = "Enemy Blasted!";
                }
            }
        }
    }

    this.isOverlapping = function (objectA, objectB) {
        var deltaX = objectA.x - objectB.x;
        var deltaY = objectA.y - objectB.y;
        var dist = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
        return ((dist <= UFO_COLLISION_RADIUS) || (dist <= SHOT_DISPLAY_RADIUS));
    }

    this.drawEverything = function() {
        colorRect(0, 0, canvas.width, canvas.height, 'black');

        this.player.draw();
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].draw();
        }
        for (var i = 0; i < this.playerShots.length; i++) {
            this.playerShots[i].draw();
        }
        for (var i = 0; i < this.enemyShots.length; i++) {
            this.enemyShots[i].draw();
        }

        drawText("Shield", 1, 10, "cyan");
        drawText("Health", 1, 20, "tomato");
        drawText("Dash Cooldown", 1, 30, "white");
    }

    this.update = function () {
        if (this.player != null) {
            this.moveEverything();
            this.drawEverything();
        }
    }
}