const POWERUP_LIFE = 500;
const POWERUP_COLLISION_RADIUS = 14;

const NUM_POWERUP_TYPES = 3;
const TYPE_LASER = 0;
const TYPE_SHIELD = 1;
const TYPE_HEALTH = 2;

const POWERUP_HEALTH_INCREASE = 2;

function Powerup(x,y,type) {

    this.x = x;
    this.y = y;
    this.type = type;
    this.remainingLife = POWERUP_LIFE;
}

Powerup.prototype.step = function(){
    this.remainingLife--;
};

Powerup.prototype.draw = function(){
    if(this.remainingLife > 0){
        switch(this.type){
            case TYPE_LASER:
                colorCircle(this.x,this.y,POWERUP_COLLISION_RADIUS,'yellow');
                drawText("L",this.x,this.y,"black");
                break;
            case TYPE_SHIELD:
                colorCircle(this.x,this.y,POWERUP_COLLISION_RADIUS,'blue');
                drawText("S",this.x,this.y,"black");
                break;
            case TYPE_HEALTH:
                colorCircle(this.x,this.y,POWERUP_COLLISION_RADIUS,'red');
                drawText("H",this.x,this.y,"black");
                break;
        }
    }
};

