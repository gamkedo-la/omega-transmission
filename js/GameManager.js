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
        inputManager.initializeInput();

        this.update(); // start animating now
        
    }

    this.moveEverything = function() {
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

    this.checkForCollisions = function() {
        for (var i = 0; i < this.enemyShots.length; i++) {
            if (this.isOverlapping(this.player, this.enemyShots[i]) == true) {
                this.player.health--;
                this.enemyShots[i].reset();
                screenshake(4);
                party(this.player.x,this.player.y);
            }
        }
        for (var i = 0; i < this.enemies.length; i++) {
            if (this.isOverlapping(this.player, this.enemies[i]) == true) {
                this.player.reset();
                this.player.health--;
                document.getElementById("debugText").innerHTML = "Player Crashed!";
                screenshake(20);
                party(this.player.x,this.player.y);
            }
            for (var j = 0; j < this.playerShots.length; j++) {
                if (this.isOverlapping(this.playerShots[j], this.enemies[i]) == true) {
                    this.enemies[i].health--;
                    if (this.enemies[i].health <= 0) {
                        this.enemies[i].reset();
                        screenshake(2);
                        party(this.enemies[i].x,this.enemies[i].y);
                    }
                    this.playerShots[j].reset();
                    document.getElementById("debugText").innerHTML = "Enemy Blasted!";
                    party(this.enemies[i].x,this.enemies[i].y);
                }
            }
        }
    }

    this.isOverlapping = function(objectA, objectB) {
        var deltaX = objectA.x - objectB.x;
        var deltaY = objectA.y - objectB.y;
        var dist = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
        return ((dist <= UFO_COLLISION_RADIUS) || (dist <= SHOT_DISPLAY_RADIUS));
    }

    this.drawEverything = function () {
        if (USE_WEBGL_IF_SUPPORTED && window.webGL) {
            webGL.cls();
        }
        else {
            colorRect(0, 0, canvas.width, canvas.height, 'black');
        }

        drawCenteredBitmapWithRotation(backgroundImage, canvas.width / 2, canvas.height / 2, 0);

        for (var i = 0; i < this.playerShots.length; i++) {
            this.playerShots[i].draw();
        }
        for (var i = 0; i < this.enemyShots.length; i++) {
            this.enemyShots[i].draw();
        }
        this.player.draw();
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].draw();
        }

        drawText("Shield", 1, 10, "cyan");
        drawText("Health", 1, 20, "tomato");
        drawText("Dash Cooldown", 1, 30, "white");
    }

    this.update = function() {
        if (this.player != null) {
			updateScreenshake(); // "juice it...
			updateParticles(); // ...or lose it!" =)
            this.moveEverything();
            this.drawEverything();
            draw_particles(0,0);
        }

        // optional: 100x the rendering performance! =)
        if (USE_WEBGL_IF_SUPPORTED && window.webGL) {
            webGL.flush(); // render all sprites in one draw call
        }

        // the bind() function ensures when it gets called again the "THIS" is set
        requestAnimationFrame(this.update.bind(this));
    }
}