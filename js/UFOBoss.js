// tuning constants
// const UFO_SPEED = 1;
// const FLEET_SPEED = 2;
// const RAM_ATTACK_SPEED = 3;
const BOSS_SPEED = 2;
const BOSS_RAM_ATTACK_SPEED = 4;

 const BOSS_TIME_BETWEEN_CHANGE_STATE = 110;
// const UFO_COLLISION_RADIUS = 12;

const BOSS_FIRE_RATE = 18;
const BOSS_RAM_RATE = 200;
const BOSS_TRACKING_MISSILE_RATE = 55;  	//How often the boss shoots tracking missiles during missile state

const BOSS_RAMMING_DASH_TIME = 40;

const BOSS_MAX_HEALTH = 30;

const BOSS_MAX_INJURED_SPINTIME = 50; 		//Amount of time to spin when injured
const BOSS_INJURED_STATE_COOLDOWN = 200;	//Minimum amount of time to pass before spinning out boss upon injury

var attackState = {
    IDLE: 0,
    SHOOT: 1,
    RAM: 2,
    SUPERATTACK: 3,
    INJURED: 4
};


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
	this.injuredStateCooldown = BOSS_INJURED_STATE_COOLDOWN;
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
    switch(this.attackState) {
        case attackState.SHOOT:
            angToFace = Math.atan2(gameManager.player.y-this.y,gameManager.player.x-this.x);
            break;
        case attackState.RAM:
            angToFace = Math.atan2(this.yv,this.xv);
            break;
        case attackState.SUPERATTACK:
            angToFace = Math.atan2(gameManager.player.y-this.y,gameManager.player.x-this.x);
            break;
        default:
            angToFace = this.ang;
            break;
    }

    drawScaledCenteredBitmapWithRotation(this.myBitmap, this.x, this.y, 120, 90, angToFace);
    drawText(this.health, this.x + 20, this.y + 20, 'tomato');
};

UFOBoss.prototype.update = function() {
     this.wrapComponent.move();
	
    if(this.state === attackState.RAM || this.state === attackState.SHOOT) {
        if(this.rammingTime>0 && this.state === attackState.RAM) { //Ramming
            this.rammingTime--;
            this.ang = Math.atan2(gameManager.player.y-this.y,gameManager.player.x-this.x);
            this.xv = Math.cos(this.ang) * BOSS_RAM_ATTACK_SPEED;
            this.yv = Math.sin(this.ang) * BOSS_RAM_ATTACK_SPEED;
        } else { //Not ramming
            this.cyclesTilDirectionChange--;
            if(this.cyclesTilDirectionChange <= 0) {
                this.ang = Math.random() * Math.PI * 2.0;
                this.xv = Math.cos(this.ang) * BOSS_SPEED;
                this.yv = Math.sin(this.ang) * BOSS_SPEED;
                this.cyclesTilDirectionChange = BOSS_TIME_BETWEEN_CHANGE_STATE;
            }
        }

        if (this.shotCooldown <= 0 ) {
            var tempShot = new Shot();
            var dx = gameManager.player.x - this.x;
            var dy = gameManager.player.y - this.y;
            var ang = Math.atan2(dy, dx) + (Math.random() * 0.05) - 0.1;

            switch(this.state) {
                case attackState.SHOOT:
                //case attackState.SUPERATTACK:
                    tempShot.shootFrom(this, ang, "darkred");
                    gameManager.enemyShots.push(tempShot);
                //    this.shotCooldown = this.state == attackState.SHOOT ? BOSS_FIRE_RATE : BOSS_FIRE_RATE/2;
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
    } else if(this.state === attackState.IDLE) { //Idle state
        this.xv = 0;
        this.yv = 0;
    }else if(this.state === attackState.SUPERATTACK){
        this.ang = Math.atan2(gameManager.player.y-this.y,gameManager.player.x-this.x);
        this.xv = 0;
        this.yv = 0;

        if(this.shotCooldown <= 0){
            var tempShot1 = new Shot();
            tempShot1.shootFrom(this, this.ang + 0.5, "darkred");
            tempShot1.isTrackingMissile = true;
            gameManager.enemyShots.push(tempShot1);
            var tempShot2 = new Shot();
            tempShot2.shootFrom(this, this.ang - 0.5, "darkred");
            tempShot2.isTrackingMissile = true;
            gameManager.enemyShots.push(tempShot2);

            this.shotCooldown = BOSS_TRACKING_MISSILE_RATE;
        }else {
			this.shotCooldown--;// = this.shotCooldown - 0.333; // is this to hack-ey? longer shot cooldown for tracking missiles
		}
	}else if(this.state === attackState.INJURED){
		this.xv = 0;
		this.yv = 0;
		this.ang = this.ang+(10 * Math.PI / 180);
	}
	
	this.injuredStateCooldown--;

    if(this.timeUntilStateChange<=0){
		this.ChooseRandomState();
    } else{
        this.timeUntilStateChange--;
    }
};

UFOBoss.prototype.takenDamage = function(){
	if(this.injuredStateCooldown <= 0){
		this.timeUntilStateChange = BOSS_MAX_INJURED_SPINTIME;
		this.injuredStateCooldown = BOSS_INJURED_STATE_COOLDOWN;
		this.state = attackState.INJURED;
	}

    if (this.health % 5 === 0) {
        gameManager.enemies.push(new UFO(Math.floor(Math.random() * MAX_HEALTH.length)));
        gameManager.enemies[gameManager.enemies.length - 1].reset();
    }
};

UFOBoss.prototype.ChooseRandomState = function(){
	this.state = Math.floor(Math.random() * 4);
	//this.state = 3;  /// can use this line instead of line above to force a constant state for testing
	this.timeUntilStateChange = BOSS_TIME_BETWEEN_CHANGE_STATE;
};