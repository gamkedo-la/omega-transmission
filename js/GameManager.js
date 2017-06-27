function GameManager() {

    this.player = new Ship();
    this.playerShots = [];
    this.enemies = [];
    this.enemyShots = [];
    this.powerups = [];

    this.gameScale = 1.0;

    this.initialize = function() {
        this.shotsTillPowerup = Math.floor(Math.random() * 4 + 3);
        this.player.initialize(playerImage);
        for(var shooterEnemies=0; shooterEnemies < 1; shooterEnemies++) {
            this.enemies.push(new UFO(ENEMY_KIND_SHOOTER));
        }
        for(var rammerEnemies=0; rammerEnemies < 2; rammerEnemies++) {
            this.enemies.push(new UFO(ENEMY_KIND_RAMMER));
        }
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].reset();
        }
        inputManager.initializeInput();
        this.renderScore();
        this.update(); // start animating now
    };

    this.moveEverything = function() {
        console.log(this.shotsTillPowerup);
        this.player.update();
        this.updateShots(this.playerShots);

        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update();
        }

        this.updateShots(this.enemyShots);
        this.checkForCollisions();
        this.updatePowerups();

        if (this.player.health <= 0) {
            this.score = 0;
            this.player = new Ship();
            this.player.initialize(playerImage);
            inputManager.initializeInput();
        }
    };

    this.updatePowerups = function(){
        for (var i = 0; i < this.powerups.length; i++){
            this.powerups[i].step();
            if(this.powerups.remainingLife === 0){
                this.powerups.splice(i, 1);
            }
        }
    };

    this.updateShots = function(shotArr) {
        for (var i = shotArr.length - 1; i >= 0; i--) {
            if (shotArr[i].shotLife <= 0) {
                shotArr.splice(i, 1);
            }
            else {
                shotArr[i].move();
            }
        }
    };

    this.renderScore = function(){
        scoreStr = "Score: " + this.score;
        canvasContext.textAlign = "right";
        drawText(scoreStr,virtualWidth - 1, 10,'white');
        canvasContext.textAlign = "left";
    };

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
                screenshake(10);
                party(this.player.x,this.player.y);
            }
            for (var j = 0; j < this.playerShots.length; j++) {
                if (this.isOverlapping(this.playerShots[j], this.enemies[i]) == true) {
                    this.enemies[i].health--;
                    if (this.enemies[i].health <= 0) {
                        this.score += 10;

                        if(--this.shotsTillPowerup === 0){
                            this.dropPowerup(this.enemies[i]);
                            this.shotsTillPowerup = Math.floor(Math.random() * 4 + 3);
                        }

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
    };

    this.dropPowerup = function(enemy) {
        newPowerup = new Powerup(enemy.x,enemy.y);
        this.powerups.push(newPowerup);
    };

    this.isOverlapping = function(objectA, objectB) {
        var deltaX = objectA.x - objectB.x;
        var deltaY = objectA.y - objectB.y;
        var dist = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
        return ((dist <= UFO_COLLISION_RADIUS) || (dist <= SHOT_DISPLAY_RADIUS));
    };

    this.drawEverything = function () {
        if (USE_WEBGL_IF_SUPPORTED && window.webGL) {
            webGL.cls();
        }
        else {
            canvasContext.save();
            canvasContext.scale(this.gameScale, this.gameScale);

            colorRect(0, 0, virtualWidth, virtualHeight, 'black');
        }

        drawCenteredBitmapWithRotation(backgroundImage, virtualWidth / 2, virtualHeight / 2, 0);

        for (var i = 0; i < this.playerShots.length; i++) {
            this.playerShots[i].draw();
        }
        for (var i = 0; i < this.enemyShots.length; i++) {
            this.enemyShots[i].draw();
        }
        for (var i = 0; i < this.powerups.length; i++) {
            this.powerups[i].draw();
        }
        this.player.draw();
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].draw();
        }

        drawText("Shield", 1, 10, "cyan");
        drawText("Health", 1, 20, "tomato");
        drawText("Dash Cooldown", 1, 30, "white");

        this.renderScore();

        draw_particles(0,0);

        if ((USE_WEBGL_IF_SUPPORTED && window.webGL)==false) {
            canvasContext.restore();
        }
    };

    this.update = function() {
        if (this.player != null) {
            updateScreenshake(); // "juice it...
            updateParticles(); // ...or lose it!" =)
            this.moveEverything();
            this.drawEverything();
        }

        // optional: 100x the rendering performance! =)
        if (USE_WEBGL_IF_SUPPORTED && window.webGL) {
            webGL.flush(); // render all sprites in one draw call
        }

        // the bind() function ensures when it gets called again the "THIS" is set
        requestAnimationFrame(this.update.bind(this));
    };
}

