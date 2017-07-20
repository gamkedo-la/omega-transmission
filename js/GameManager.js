const HUDBAR_WIDTH  = 120;
const HUDBAR_HEIGHT =  20;
const HUDBAR_BORDER_HORIZONTAL =   16;
const HUDBAR_BORDER_VERTICAL = 4;

const MENU_WIDTH  = 200;
const MENU_HEIGHT = 240;


function GameManager() {
    this.levelNow = 0; // will increment to 0 on start
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

    this.gameScale = 1.0;
    this.intervalID = null;
    this.waitingForNextWaveToStart = false;
    this.currentWaveName = "undefined";

    this.pauseMenuItems = [
        "P - Pause/Resume",
        "W - Move Up",
        "A - Move Left",
        "D - Move Right",
        "S - Activate Shield",
        "T - Sound On/Off",
        "U - Quit Game"
    ];

    this.endgameMenuItems = [
        "Final Score: " + this.score,
        "",
        "P - Play Again",
    ];

    this.initialize = function() {
        this.shotsTillPowerup = Math.floor(Math.random() * 4 + 3);
        this.player.initialize(playerImage);
        //this.nextWave();
        this.preStartOfWave();
        inputManager.initializeInput();
        this.renderScore();
        this.update(); // start animating now
        if(!Sound.mute) {
            Sound.play("OmegaThemeSong",true,BACKGROUND_VOL);
        }
    };

    this.preStartOfWave = function() {
        //var countDownTimer = 3000;
        //console.log(this.stages.length);

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
            // that.player.isActive = true;
        };
        //console.log(this.intervalID);
        //clearTimeout(this.intervalID);
        var timeoutTimer = 3000;
        console.log("Enemies will spawn in " + timeoutTimer/1000.0 + " secs");
        this.intervalID = setTimeout(callNextWave, timeoutTimer);
    };

    this.nextWave = function () {
        this.levelNow++;
        //console.log(this.levelNow);
        //console.log(this.stages.length);
        // this.levelNow %= this.stages.length;
        var levelInd = this.levelNow % this.stages.length;

        for(var shooterEnemies=0; shooterEnemies < this.stages[levelInd].shooterNum; shooterEnemies++) {
            this.enemies.push(new UFO(ENEMY_KIND_SHOOTER));
        }
        for(var rammerEnemies=0; rammerEnemies < this.stages[levelInd].spearNum; rammerEnemies++) {
            this.enemies.push(new UFO(ENEMY_KIND_RAMMER));
        }
        for(var fleetEnemies=0; fleetEnemies < this.stages[levelInd].fleetNum; fleetEnemies++) {
            this.enemies.push(new UFO(ENEMY_KIND_FLEET));
        }
        //new boss level :
        for(var bossEnemy=0; bossEnemy < this.stages[levelInd].bossNum; bossEnemy++) {
            this.enemies.push(new UFOBoss());
        }

        //test to increase enemy during the next cycle
        if(this.stages[levelInd].shooterNum > 0) {
            this.stages[levelInd].shooterNum += 2;
        }
        if(this.stages[levelInd].spearNum > 0) {
            this.stages[levelInd].spearNum += 2;
        }
        if(this.stages[levelInd].fleetNum > 0) {
            this.stages[levelInd].fleetNum += 2;
        }
        if(this.stages[levelInd].bossNum > 0) {
            this.stages[levelInd].bossNum++;
        }

        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].reset();
        }
    };

    this.moveEverything = function() {
        this.player.update();
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update();
        }
        if(this.player.isActive) {
            this.updateShots(this.playerShots);

            for (var i = 0; i < NUM_POWERUP_TYPES; i++){
                if(this.player.powerupLife[i] > 0){
                    this.player.powerupLife[i]--;
                }
            }

            this.updateShots(this.enemyShots);
            this.checkForCollisions();
        }
        // else {
            // if(this.enemyShots) {
            //     this.enemyShots = null;
            // }
        // }
        this.updatePowerups();

        if (this.player.health <= 0) {
            this.player.isActive = false;
            this.renderMenu("Game Over",MENU_WIDTH,MENU_HEIGHT,this.pauseMenuItems);
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
        scoreStr = "Score: " + this.score;
        canvasContext.textAlign = "right";
        canvasContext.font = "20px Arial";
        drawText(scoreStr,virtualWidth - 1, 20,'white');
        canvasContext.textAlign = "left";
        canvasContext.font = "10px Arial";
    };

    this.checkForCollisions = function() {
        for (var i = 0, len = this.enemyShots.length; i < len; i++) {
            if (this.isOverlapping(this.player, this.enemyShots[i], SHOT_COLLISION_RADIUS) == true) {
                // ENEMY SHOT HITS PLAYER
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
                    document.getElementById("debugText").innerHTML = "Enemy Blasted!";
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
            //this.nextWave();
            this.preStartOfWave();
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
                this.renderMenu("Game Over",MENU_WIDTH,MENU_HEIGHT,this.endgameMenuItems);
            }
        }

        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].draw();
        }

        this.drawIndicatorBars();

        this.renderScore();
        if(this.waitingForNextWaveToStart) {
            canvasContext.font = "30px Arial";
            canvasContext.textAlign = "center";
            drawText("Wave "+(this.levelNow+2), virtualWidth/2, virtualHeight/2-20, "yellow");
            drawText(this.currentWaveName, virtualWidth/2, virtualHeight/2+20, "yellow");
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
                if (!Sound.isPlaying("OmegaThemeSong") && !Sound.mute){
                    Sound.play("OmegaThemeSong",true,BACKGROUND_VOL);
                }
            }

            // optional: 100x the rendering performance! =)
            if (USE_WEBGL_IF_SUPPORTED && window.webGL) {
                webGL.flush(); // render all sprites in one draw call
            }
        } else {
            this.renderMenu("Game Paused",MENU_WIDTH,MENU_HEIGHT,this.pauseMenuItems);
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
        //drawText("Shield", HUDBAR_BORDER + 2, 36, "black");
        drawScaledCenteredBitmapWithRotation(shieldPowerup, POWERUP_DRAW_SIZE/2,POWERUP_DRAW_SIZE*1.5, POWERUP_DRAW_SIZE,POWERUP_DRAW_SIZE, 0);
    };

    this.renderMenu = function(titleString,width,height,menuItems) {
        var fontSize = 20;
        canvasContext.textBaseline = 'middle';
        canvasContext.textAlign = "center";
        canvasContext.font = fontSize + "px Arial";

        var titleStringWidth = canvasContext.measureText(titleString).width;

        console.log(canvas.width/2-MENU_WIDTH/2 + titleString);
        colorRect(canvas.width/2-MENU_WIDTH/2,canvas.height/2-MENU_HEIGHT/2,
            MENU_WIDTH,MENU_HEIGHT,"black");
        drawText(titleString,canvas.width/2,
            canvas.height/2 - MENU_HEIGHT/2 + fontSize/2,"yellow");

        fontSize *= 3/4;
        canvasContext.font = fontSize + "px Arial";
        for (var i = 0; i < menuItems.length; i++) {
            drawText(menuItems[i], canvas.width/2,(canvas.height/2 - MENU_HEIGHT/2 + 3*fontSize) + i*(fontSize+5), "white");
        }

        canvasContext.textBaseline = "left";
        canvasContext.textAlign = "left";
    };
}
