// tuning constants
// const UFO_SPEED = 1;
// const FLEET_SPEED = 2;
// const RAM_ATTACK_SPEED = 3;
const BOSS_SPEED = 3;
const BOSS_RAM_ATTACK_SPEED = 4;

 const BOSS_TIME_BETWEEN_CHANGE_STATE = 80;
// const UFO_COLLISION_RADIUS = 12;

const BOSS_FIRE_RATE = 10;
const BOSS_RAM_RATE = 200;

const BOSS_RAMMING_DASH_TIME = 70;

const BOSS_MAX_HEALTH = 20;

// const DIR_UP = 0;
// const DIR_RIGHT = 1;
// const DIR_LEFT = 2;
// const DIR_DOWN = 3;
var attackState = {
	IDLE: 0,
	SHOOT: 1,
	RAM: 2
}


function UFOBoss() {
	this.myBitmap = UFOBossImage;

    //Component List
    this.wrapComponent = new WrapComponent(this);

    this.health = MAX_HEALTH[this.enemyType]; 
	this.shotCooldown = ENEMY_FIRE_RATE; 
	this.ang = Math.PI*2.0*Math.random();

    this.rammingTime = 0;
    this.readyToRemove = false;
	
	this.state = attackState.IDLE;
	this.timeUntilStateChange = BOSS_TIME_BETWEEN_CHANGE_STATE;
}

UFOBoss.prototype.reset = function() {
    this.wrapComponent.reset();
	this.x = Math.random() * virtualWidth;
	this.y = Math.random() * virtualHeight;
    

    this.cyclesTilDirectionChange = 0;
    this.health = BOSS_MAX_HEALTH;
};

UFOBoss.prototype.draw = function() {
    //colorCircle(this.x, this.y + 3, UFO_COLLISION_RADIUS, 'grey'); //uncomment to visualize collision radius
    var angToFace;
    // switch(this.enemyType) {
        // case ENEMY_KIND_SHOOTER:
            angToFace = Math.atan2(gameManager.player.y-this.y,gameManager.player.x-this.x);
            // break;
        // case ENEMY_KIND_RAMMER:
            // angToFace = Math.atan2(this.yv,this.xv);
            // break;
        // default:
            // angToFace = this.ang;
            // break;
    // }

    drawScaledCenteredBitmapWithRotation(this.myBitmap, this.x, this.y, 120, 90, angToFace);
    drawText(this.health, this.x + 15, this.y + 15, 'tomato');
};

UFOBoss.prototype.update = function() {
     this.wrapComponent.move();

    if(this.state === attackState.RAM || this.state === attackState.SHOOT) {
        if(this.rammingTime>0 && this.state === attackState.RAM) {
            this.rammingTime--;
            this.ang = Math.atan2(gameManager.player.y-this.y,gameManager.player.x-this.x);
            this.xv = Math.cos(this.ang) * BOSS_RAM_ATTACK_SPEED;
            this.yv = Math.sin(this.ang) * BOSS_RAM_ATTACK_SPEED;
        } else {
            this.cyclesTilDirectionChange--;
            if(this.cyclesTilDirectionChange <= 0) {
                this.ang = Math.random() * Math.PI * 2.0;
                this.xv = Math.cos(this.ang) * BOSS_SPEED;
                this.yv = Math.sin(this.ang) * BOSS_SPEED;
                this.cyclesTilDirectionChange = BOSS_TIME_BETWEEN_CHANGE_STATE;
            }
        }

        if (this.shotCooldown <= 0) {
            var tempShot = new Shot();
            var dx = gameManager.player.x - this.x;
            var dy = gameManager.player.y - this.y;
            var ang = Math.atan2(dy, dx) + (Math.random() * 0.05) - 0.1;

            switch(this.state) {
                case attackState.SHOOT:
                    tempShot.shootFrom(this, ang, "darkred");
                    gameManager.enemyShots.push(tempShot);
                    this.shotCooldown = BOSS_FIRE_RATE;
                    break;
                case attackState.RAM:
                    this.rammingTime = BOSS_RAMMING_DASH_TIME;
                    this.shotCooldown = BOSS_RAM_RATE;
                    break;
            }
        } else {
            this.shotCooldown--;
        }
    } else {
        this.x += this.xv * BOSS_SPEED * (1 + gameManager.levelNow/10);
        this.y += this.yv * BOSS_SPEED * (1 + gameManager.levelNow/10);
    }
	
	if(this.timeUntilStateChange<=0){
			this.state = Math.floor(Math.random() * 4);
			this.timeUntilStateChange = BOSS_TIME_BETWEEN_CHANGE_STATE;
	} else{
		this.timeUntilStateChange--;
	}
};

