const HUDBAR_WIDTH  = 120;
const HUDBAR_HEIGHT =  20;
const HUDBAR_BORDER_HORIZONTAL =   16;
const HUDBAR_BORDER_VERTICAL = 4;

const MENU_WIDTH  = 200;
const MENU_HEIGHT = 240;


function GameManager() {
    this.levelNow = -1; // will increment to 0 on start
    this.stages = [
        {waveName:"Intro",spearNum:0,shooterNum:0,fleetNum:2, bossNum:0},      //dtderosa -changed fleetNum from 3 to 2 to make 'Intro' even easier
        {waveName:"Contact",spearNum:1,shooterNum:1,fleetNum:0, bossNum:0},    //dtderosa -new
        {waveName:"Scouts",spearNum:0,shooterNum:0,fleetNum:3, bossNum:0},     //dtderosa -new
        {waveName:"Recon",spearNum:3,shooterNum:0,fleetNum:0, bossNum:0},
        {waveName:"Deterrance",spearNum:0,shooterNum:2,fleetNum:1, bossNum:0}, //dtderosa -new

        {waveName:"Garrison",spearNum:0,shooterNum:4,fleetNum:0, bossNum:0},
        {waveName:"Swarm",spearNum:4,shooterNum:0,fleetNum:0, bossNum:0},      //dtderosa -new
        {waveName:"Infiltration",spearNum:2,shooterNum:2,fleetNum:0, bossNum:0},//dtderosa -new
        {waveName:"Guards",spearNum:3,shooterNum:3,fleetNum:2, bossNum:0},     //dtderosa - +1spear -1fleet
        {waveName:"BOSS!",spearNum:0,shooterNum:0,fleetNum:0, bossNum:1}      //dtderosa -new boss level
        ];

    this.player = new Ship();
    this.playerShots = [];
    this.enemies = [];
    this.enemyShots = [];
    this.powerups = [];

    this.score = 0;
    this.first = true;

    this.gameScale = 1.0;
    this.intervalID = null;
    this.waitingForNextWaveToStart = false;
    this.currentWaveName = "undefined";

    this.atEndScreen = false;

    this.titleMenuItems = [
        "Play",
        "Controls",
        "Credits",
    ];

    this.pauseMenuItems = [
        "Pause/Resume",
        "View Controls",
        "Toggle Sound",
        "Return to Main Menu",
    ];

    this.controlsList = [
        "W - Move Up",
        "A - Move Left",
        "D - Move Right",
        "S - Activate Shield",
    ];

    this.endgameMenuItems = [
        "",
        "",
        "Play Again",
        "Return to Main Menu",
    ];

    this.initialize = function() {
        this.shotsTillPowerup = Math.floor(Math.random() * 4 + 3);
        this.player.isActive = true;
        this.player.initialize(playerImage);
        this.preStartOfWave();
        inputManager.initializeInput();
        this.renderScore();
        this.renderWave();
        this.update(); // start animating now
        Sound.play("OmegaThemeSong",true,BACKGROUND_VOL);
        // Sound.play("thrust",true,0);
    };

    this.reinit = function() {
        this.player.isActive = true;
        this.shotsTillPowerup = Math.floor(Math.random() * 4 + 3);
        this.atEndScreen = true;
        this.player.initialize(playerImage);
        this.levelNow = -1; // will increment to 0 on start
        this.score = 0;
        this.renderScore();
        this.renderWave();
        this.player.health = PLAYER_MAX_HEALTH;
        this.enemies = [];
        this.enemyShots = [];
        this.playerShots = [];
    };

    this.preStartOfWave = function() {
        // locking to prevent stacking between stages:
        if(this.waitingForNextWaveToStart) {
            return;
        }
        this.waitingForNextWaveToStart=true;

        var that = this;

        var nextLevel = (this.levelNow+1) % this.stages.length;
        this.currentWaveName = this.stages[nextLevel].waveName;

        var callNextWave = function() {
            that.nextWave();
            that.waitingForNextWaveToStart=false;
        };

        var timeoutTimer = 3000;
        console.log("Enemies will spawn in " + timeoutTimer/1000.0 + " secs");
        this.intervalID = setTimeout(callNextWave, timeoutTimer);
    };

    this.nextWave = function () {
        this.levelNow++;
        var levelInd = this.levelNow % this.stages.length;

        // So difficulty can be increased in higher levels
        var round = Math.floor(this.levelNow / this.stages.length);

        var shooterIncrease = this.stages[levelInd].shooterNum ? 2*round : 0;
        var rammerIncrease = this.stages[levelInd].spearNum ? 2*round : 0;
        var fleetIncrease = this.stages[levelInd].fleetNum ? 2*round : 0;
        var bossIncrease = this.stages[levelInd].bossNum ? 2*round : 0;

        for(var shooterEnemies=0; shooterEnemies < this.stages[levelInd].shooterNum + shooterIncrease; shooterEnemies++) {
            this.enemies.push(new UFO(ENEMY_KIND_SHOOTER));
        }
        for(var rammerEnemies=0; rammerEnemies < this.stages[levelInd].spearNum + rammerIncrease; rammerEnemies++) {
            this.enemies.push(new UFO(ENEMY_KIND_RAMMER));
        }
        for(var fleetEnemies=0; fleetEnemies < this.stages[levelInd].fleetNum + fleetIncrease; fleetEnemies++) {
            this.enemies.push(new UFO(ENEMY_KIND_FLEET));
        }
        //new boss level :
        for(var bossEnemy=0; bossEnemy < this.stages[levelInd].bossNum + bossIncrease; bossEnemy++) {
            this.enemies.push(new UFOBoss());
        }

        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].reset();
        }
    };

    this.moveEverything = function() {
        if(this.player.isActive) {
            this.player.update();
            for (var i = 0; i < this.enemies.length; i++) {
                this.enemies[i].update();
            }
            this.updateShots(this.playerShots);

            for (var i = 0; i < NUM_POWERUP_TYPES; i++){
                if(this.player.powerupLife[i] > 0){
                    this.player.powerupLife[i]--;
                }
            }

            this.updateShots(this.enemyShots);
            this.checkForCollisions();
        } else {
            for(var i = 0; i < this.enemies.length; i++) {
                this.enemies[i].roam();
            }
        }

        this.updatePowerups();

        if (this.player.health <= 0) {
            if(this.player.isActive && !Sound.isPlaying("playerdead"))
                Sound.play("playerdead",false,BACKGROUND_VOL/4);
            this.player.isActive = false;
            this.renderGameOverMenu();
        } else if (this.enemies.length > 0 && this.player.health > 0) {
            this.player.isActive = true;
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
                if(shotArr === this.playerShots)
                {
                    shotArr[i].trackEnemy();
                } else if (shotArr === this.enemyShots)
                {
                    shotArr[i].trackPlayer();
                }
                shotArr[i].move();
            }
        }
    };

    this.renderScore = function(){
        var scoreStr = "Score: " + this.score;
        canvasContext.textAlign = "right";
        canvasContext.font = "20px PressStart";
        drawText(scoreStr,virtualWidth - 1, 20,'white');
        canvasContext.textAlign = "left";
        canvasContext.font = "10px Arial";
    };

    this.renderWave = function() {
        var waveStr = "Wave " + (this.levelNow+1);
        canvasContext.textAlign = "left";
        canvasContext.font = "20px PressStart";
        drawText(waveStr,1,virtualHeight,'white');
        canvasContext.font = "10px Arial";
    };

    this.checkForCollisions = function() {
        for (var i = 0, len = this.enemyShots.length; i < len; i++) {
            if (this.isOverlapping(this.player, this.enemyShots[i], SHOT_COLLISION_RADIUS) == true) {
                // ENEMY SHOT HITS PLAYER
                Sound.play("playerdead",false,BACKGROUND_VOL/6); // Death sound but quieter
                if(this.player.keyHeld_Shield && this.player.shield > 0) {
                    this.player.shield--;
                } else {
                    this.player.health--;
                }
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
                    //BOSS INJURED STATE
                    if(this.enemies[i] instanceof UFOBoss){
                        this.enemies[i].takenDamage();
                    }
                    if (this.enemies[i].health <= 0) {
                        // ENEMY DESTROYED
                        this.score += 10;
                        if((--this.shotsTillPowerup === 0) || (DEBUG_CREATE_MANY_POWERUPS)){
                            this.dropPowerup(this.enemies[i]);
                            this.shotsTillPowerup = Math.floor(Math.random() * 4 + 3);
                        }
                        party(this.enemies[i].x,this.enemies[i].y,PARTICLE_EXPLOSION,null,null,null,2,2);
                        party(this.enemies[i].x,this.enemies[i].y,PARTICLE_SHOCKWAVE,null,null,null,0,1);
                        this.enemies[i].readyToRemove=true;
                        screenshake(2);
                    }
                    this.playerShots[j].reset();
                    party(this.enemies[i].x,this.enemies[i].y);
                }
            }
        }
        // remove shot enemies
        for (var i = this.enemies.length - 1; i >= 0; i--) {
            if (this.enemies[i].readyToRemove) {
                this.enemies.splice(i, 1);
            }
        }
        if(this.enemies.length==0) {
            this.preStartOfWave();
        }
        for (var i = this.powerups.length - 1; i >= 0; i--) {
            if(this.isOverlapping(this.player, this.powerups[i], POWERUP_COLLISION_RADIUS)){
                // PLAYER HITS POWERUP
                Sound.play("pickup",false,BACKGROUND_VOL/2);
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
        var type = Math.floor(Math.random() * NUM_POWERUP_TYPES);
        this.powerups.push(new Powerup(enemy.x,enemy.y,type));
    };

    this.drawEverything = function () {
        if (USE_WEBGL_IF_SUPPORTED && window.webGL) {
            webGL.cls();
        } else {
            canvasContext.save();
            canvasContext.scale(this.gameScale, this.gameScale);

            colorRect(0, 0, virtualWidth, virtualHeight, 'black');
        }

        drawCenteredBitmapWithRotation(backgroundImage, virtualWidth / 2, virtualHeight / 2, 0);

        if(this.player.isActive) {
            for (var i = 0; i < this.playerShots.length; i++) {
                this.playerShots[i].draw(true);
            }
            for (var i = 0; i < this.enemyShots.length; i++) {
                this.enemyShots[i].draw();
            }
            for (var i = 0; i < this.powerups.length; i++) {
                this.powerups[i].draw();
            }

            this.player.draw();
            if(this.player.keyHeld_Shield && this.player.shield > 0) {
                drawCenteredBitmapWithRotation(playerShield, gameManager.player.x, gameManager.player.y, gameManager.player.ang - (Math.PI/4));
            }
        } else {
            if(this.player.health <= 0) {
                this.renderGameOverMenu();
            }
        }

        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].draw();
        }

        this.drawIndicatorBars();

        this.renderScore();
        if(this.waitingForNextWaveToStart) {
            canvasContext.font = "30px PressStart";
            canvasContext.textAlign = "center";
            drawText("Wave "+(this.levelNow+2), virtualWidth/2, virtualHeight/2-20, "yellow");
            if(this.levelNow < 9)
                drawText(this.currentWaveName, virtualWidth/2, virtualHeight/2+20, "yellow");
        } else {
            this.renderWave();
        }

        draw_particles(0,0);

        if ((USE_WEBGL_IF_SUPPORTED && window.webGL)==false) {
            canvasContext.restore();
        }
    };

    this.update = function() {
        if (!isGamePaused) {
            if (this.player != null) {
                updateScreenshake(); // "juice it...
                updateParticles(); // ...or lose it!" =)

                this.moveEverything();
                this.drawEverything();

                if (!Sound.isPlaying("OmegaThemeSong")){
                    Sound.play("OmegaThemeSong",true,BACKGROUND_VOL);
                }
            }

            // optional: 100x the rendering performance! =)
            if (USE_WEBGL_IF_SUPPORTED && window.webGL) {
                webGL.flush(); // render all sprites in one draw call
            }
        } else {
            canvasContext.save();
            canvasContext.scale(this.gameScale, this.gameScale);

            this.renderPauseMenu();

            canvasContext.restore();
        }

        // the bind() function ensures when it gets called again the "THIS" is set
        requestAnimationFrame(this.update.bind(this));
    };

    this.drawIndicatorBars = function() {
        var healthFraction = this.player.health / 5;
        if(healthFraction > 1) healthFraction = 1; // 5 health is a full health bar
        colorRect(HUDBAR_BORDER_HORIZONTAL,HUDBAR_BORDER_VERTICAL, HUDBAR_WIDTH*healthFraction + HUDBAR_BORDER_HORIZONTAL,
            HUDBAR_HEIGHT - HUDBAR_BORDER_VERTICAL, this.player.getHealthBarColor());
        //drawText("Health", HUDBAR_BORDER + 2, 13, "black");
        drawScaledCenteredBitmapWithRotation(healthPowerup, POWERUP_DRAW_SIZE/2,POWERUP_DRAW_SIZE/2, POWERUP_DRAW_SIZE,POWERUP_DRAW_SIZE, 0);

        var shieldFraction = this.player.shield / 5;
        if(this.player.shield) {
            if(shieldFraction > 1) shieldFraction = 1; // 5 shields is a full shield bar
        } else {
            shieldFraction = 0;
        }
        colorRect(HUDBAR_BORDER_HORIZONTAL,2*HUDBAR_BORDER_VERTICAL + HUDBAR_HEIGHT,
            HUDBAR_WIDTH*shieldFraction + HUDBAR_BORDER_HORIZONTAL,HUDBAR_HEIGHT - HUDBAR_BORDER_VERTICAL, "cyan");
        drawScaledCenteredBitmapWithRotation(shieldPowerup, POWERUP_DRAW_SIZE/2,POWERUP_DRAW_SIZE*1.5, POWERUP_DRAW_SIZE,POWERUP_DRAW_SIZE, 0);
    };

    this.renderPauseMenu = function() {
        renderInGameMenu("Game Paused",MENU_WIDTH,MENU_HEIGHT,this.pauseMenuItems);
    };

    this.renderGameOverMenu = function() {
        this.endgameMenuItems[0] = "Final Score: " + this.score;
        renderInGameMenu("Game Over",MENU_WIDTH,MENU_HEIGHT,this.endgameMenuItems);
        this.atEndScreen = true;
    };
}

