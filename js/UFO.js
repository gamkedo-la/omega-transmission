// tuning constants
const UFO_SPEED = 1;
const RAM_ATTACK_SPEED = 3;

const UFO_TIME_BETWEEN_CHANGE_DIR = 145;
const UFO_COLLISION_RADIUS = 12;
const MAX_HEALTH = 5;

const ENEMY_FIRE_RATE = 120;
const ENEMY_RAM_RATE = 200;

const RAMMING_DASH_TIME = 70;

const ENEMY_KIND_SHOOTER = 0;
const ENEMY_KIND_RAMMER = 1;

function UFO(enemyType) {

    switch(enemyType) {
        case ENEMY_KIND_SHOOTER:
            this.myBitmap = UFOShooterImage;
            break;
        case ENEMY_KIND_RAMMER:
            this.myBitmap = UFORammerImage;
            break;
    }

    //Component List
    this.wrapComponent = new WrapComponent(this);

    this.health = MAX_HEALTH;
    this.shotCooldown = ENEMY_FIRE_RATE;
    this.ang = Math.PI*2.0*Math.random();

    this.rammingTime = 0;

    this.reset = function() { 
        this.wrapComponent.reset();
        this.x = Math.random() * virtualWidth;
        this.y = Math.random() * virtualHeight;
        this.cyclesTilDirectionChange = 0;
        this.health = MAX_HEALTH;
    }
  
    this.update = function() {
        this.wrapComponent.move();
    
        if(this.rammingTime>0) {
            this.rammingTime--;            
            this.ang = Math.atan2(gameManager.player.y-this.y,gameManager.player.x-this.x);
            this.xv = Math.cos(this.ang) * RAM_ATTACK_SPEED;
            this.yv = Math.sin(this.ang) * RAM_ATTACK_SPEED;
        } else {
            this.cyclesTilDirectionChange--;
            if(this.cyclesTilDirectionChange <= 0) {
                this.ang = Math.random() * Math.PI * 2.0;
                this.xv = Math.cos(this.ang) * UFO_SPEED;
                this.yv = Math.sin(this.ang) * UFO_SPEED;
                this.cyclesTilDirectionChange = UFO_TIME_BETWEEN_CHANGE_DIR;
            }
        }

        if (this.shotCooldown <= 0) {
            var tempShot = new Shot();
            var dx = gameManager.player.x - this.x;
            var dy = gameManager.player.y - this.y;
            var ang = Math.atan2(dy, dx) + (Math.random() * 0.05) - 0.1;
            
            switch(enemyType) {
                case ENEMY_KIND_SHOOTER:
                    tempShot.shootFrom(this, ang, "darkred");
                    gameManager.enemyShots.push(tempShot);
                    this.shotCooldown = ENEMY_FIRE_RATE;
                    break;
                case ENEMY_KIND_RAMMER:
                    this.rammingTime = RAMMING_DASH_TIME;
                    this.shotCooldown = ENEMY_RAM_RATE;
                    break;
            }
        } else {
            this.shotCooldown--;
        }

    }
  
    this.draw = function() {
        //colorCircle(this.x, this.y + 3, UFO_COLLISION_RADIUS, 'grey'); //uncomment to visualize collision radius
        var angToFace;
        switch(enemyType) {
            case ENEMY_KIND_SHOOTER:
                angToFace = Math.atan2(gameManager.player.y-this.y,gameManager.player.x-this.x);
                break;
            case ENEMY_KIND_RAMMER:
                angToFace = Math.atan2(this.yv,this.xv);
                break;
        }
        
        drawScaledCenteredBitmapWithRotation(this.myBitmap, this.x, this.y, 60, 45, angToFace);
        drawText(this.health, this.x + 15, this.y + 15, 'tomato');
    }
}