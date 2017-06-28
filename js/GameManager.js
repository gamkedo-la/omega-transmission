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

        for (var i = 0; i < NUM_POWERUP_TYPES; i++){
            if(this.player.powerupLife[i] > 0){
                this.player.powerupLife[i]--;
                console.log("Player holding powerup type " + i + " , holding for", this.player.powerupLife[i]);
            }
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
        for (var i = 0, len = this.enemyShots.length; i < len; i++) {
            if (this.isOverlapping(this.player, this.enemyShots[i], SHOT_COLLISION_RADIUS) == true) {
                // ENEMY SHOT HITS PLAYER
                this.player.health--;
                this.enemyShots[i].reset();
                screenshake(4);
                party(this.player.x,this.player.y,null,null,null,null,1,2);
            }
        }
        for (var i = 0; i < this.enemies.length; i++) {
            if (this.isOverlapping(this.player, this.enemies[i], UFO_COLLISION_RADIUS) == true) {
                // PLAYER SHIP HITS ENEMY
                this.player.reset();
                this.player.health--;
                document.getElementById("debugText").innerHTML = "Player Crashed!";
                screenshake(10);
                party(this.player.x,this.player.y,PARTICLE_EXPLOSION,null,null,null,2,2);
                party(this.player.x,this.player.y,PARTICLE_SHOCKWAVE,null,null,null,0,1);
                // BUGFIX: the enemy gets destroyed too (to avoid a hundred deaths if you respawn in same place)
				this.enemies[i].reset();
            }
            for (var j = 0, len = this.playerShots.length; j < len; j++) {
                if (this.isOverlapping(this.playerShots[j], this.enemies[i], SHOT_COLLISION_RADIUS)) {
                    // PLAYER SHOT HITS ENEMY
                    this.enemies[i].health--;
                    if (this.enemies[i].health <= 0) {
                        // ENEMY DESTROYED
                        this.score += 10;
                        if(--this.shotsTillPowerup === 0){
                            this.dropPowerup(this.enemies[i]);
                            this.shotsTillPowerup = Math.floor(Math.random() * 4 + 3);
                        }
                        party(this.enemies[i].x,this.enemies[i].y,PARTICLE_EXPLOSION,null,null,null,2,2);
                        party(this.enemies[i].x,this.enemies[i].y,PARTICLE_SHOCKWAVE,null,null,null,0,1);
                        this.enemies[i].reset();
                        screenshake(2);
                    }
                    this.playerShots[j].reset();
                    document.getElementById("debugText").innerHTML = "Enemy Blasted!";
                    party(this.enemies[i].x,this.enemies[i].y);
                }
            }
        }
        for (var i = this.powerups.length - 1; i >= 0; i--) {
            if(this.isOverlapping(this.player, this.powerups[i], POWERUP_COLLISION_RADIUS)){
                // PLAYER HITS POWERUP
                this.player.setPowerup(this.powerups[i]);
                this.powerups.splice(i, 1);
            }
        }
    };

    this.isOverlapping = function(objectA, objectB, collisionRadius) {
        var deltaX = objectA.x - objectB.x;
        var deltaY = objectA.y - objectB.y;
        var dist = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
        return dist <= collisionRadius;
    };

    this.dropPowerup = function(enemy) {
        var type = Math.floor(Math.random() * 2);
        this.powerups.push(new Powerup(enemy.x,enemy.y,type));
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

