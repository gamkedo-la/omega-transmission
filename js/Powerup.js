const DEBUG_CREATE_MANY_POWERUPS = false; // just used for testing, set to false for players!

const POWERUP_LIFE = 500;
const POWERUP_COLLISION_RADIUS = 32;
const POWERUP_DRAW_SIZE = 24;

const NUM_POWERUP_TYPES = 6;
const TYPE_LASER = 0;
const TYPE_SHIELD = 1;
const TYPE_HEALTH = 2;
const TYPE_TRIPLESHOT = 3;
const TYPE_PHALANX = 4;
const TYPE_ZEALOT = 5;

const POWERUP_HEALTH_INCREASE = 2;

const POWERUP_BLINK_FRAMES = 10;

function Powerup(x,y,type) {

    this.x = x;
    this.y = y;
    this.type = type;
    this.remainingLife = POWERUP_LIFE;
    this.powerupVisible = true;
    this.framesToBlink = 0;
}

Powerup.prototype.step = function(){
    this.remainingLife--;

        // about to dissappear? flicker
        if (this.remainingLife < POWERUP_LIFE / 3) {
            if (!this.framesToBlink) {
                this.powerupVisible = (this.powerupVisible) ? false : true;
                this.framesToBlink = POWERUP_BLINK_FRAMES;
            }
            this.framesToBlink--;
        }
};

Powerup.prototype.draw = function(){
    if(this.remainingLife > 0){

        if (this.powerupVisible) {
            switch(this.type){
                case TYPE_LASER:
                    drawScaledCenteredBitmapWithRotation(plasmaPowerup,this.x,this.y,POWERUP_DRAW_SIZE,POWERUP_DRAW_SIZE,0);
                    break;
                case TYPE_SHIELD:
                    drawScaledCenteredBitmapWithRotation(shieldPowerup,this.x,this.y,POWERUP_DRAW_SIZE,POWERUP_DRAW_SIZE,0);
                    break;
                case TYPE_HEALTH:
                    drawScaledCenteredBitmapWithRotation(healthPowerup,this.x,this.y,POWERUP_DRAW_SIZE,POWERUP_DRAW_SIZE,0);
                    break;
                case TYPE_TRIPLESHOT:
                    drawScaledCenteredBitmapWithRotation(tripleShotPowerup,this.x,this.y,POWERUP_DRAW_SIZE,POWERUP_DRAW_SIZE,0);
                    break;
                case TYPE_PHALANX:
                    drawScaledCenteredBitmapWithRotation(phalanxPowerup,this.x,this.y,POWERUP_DRAW_SIZE,POWERUP_DRAW_SIZE,0);
                    break;
                case TYPE_ZEALOT:
                    drawScaledCenteredBitmapWithRotation(zealotPowerup,this.x,this.y,POWERUP_DRAW_SIZE,POWERUP_DRAW_SIZE,0);
                    break;
            }
        }
    }
};

