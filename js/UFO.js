// tuning constants
const UFO_SPEED = 1;
const UFO_TIME_BETWEEN_CHANGE_DIR = 145;
const UFO_COLLISION_RADIUS = 12;
const MAX_HEALTH = 5;
const ENEMY_FIRE_RATE = 120;

function UFO() {

    //Component List
    this.wrapComponent = new WrapComponent(this);

    this.health = MAX_HEALTH;
    this.shotCooldown = ENEMY_FIRE_RATE;
    this.randAng = 0;

    this.initialize = function(whichGraphic) {
        this.myBitmap = whichGraphic;
        this.reset();
    }

    this.reset = function() { 
        this.wrapComponent.reset();
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.cyclesTilDirectionChange = 0;
        this.health = MAX_HEALTH;
    }
  
    this.update = function() {
        this.wrapComponent.move();
    
        this.cyclesTilDirectionChange--;
        if(this.cyclesTilDirectionChange <= 0) {
            this.randAng = Math.random() * Math.PI * 2.0;
            this.xv = Math.cos(this.randAng) * UFO_SPEED;
            this.yv = Math.sin(this.randAng) * UFO_SPEED;
            this.cyclesTilDirectionChange = UFO_TIME_BETWEEN_CHANGE_DIR;
        }

        if (this.shotCooldown <= 0) {
            var tempShot = new Shot();
            var dx = gameManager.player.x - this.x;
            var dy = gameManager.player.y - this.y;
            var ang = Math.atan2(dy, dx) + (Math.random() * 0.05) - 0.1;
            tempShot.shootFrom(this, ang, "darkred");

            gameManager.enemyShots.push(tempShot);
            this.shotCooldown = ENEMY_FIRE_RATE;
        } else {
            this.shotCooldown--;
        }

    }
  
    this.draw = function() {
        //colorCircle(this.x, this.y + 3, UFO_COLLISION_RADIUS, 'grey'); //uncomment to visualize collision radius
        drawCenteredBitmapWithRotation(this.myBitmap, this.x, this.y, 0);
        drawText(this.health, this.x + 15, this.y + 15, 'tomato');
    }
}