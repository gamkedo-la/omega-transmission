const POWERUP_LIFE = 500;
const POWERUP_COLLISION_RADIUS = 8;

const NUM_POWERUP_TYPES = 3;
const TYPE_LASER = 0;
const TYPE_SHIELD = 1;
const TYPE_HEALTH = 2;

function Powerup(x,y,type) {

    this.x = x;
    this.y = y;
    this.type = type;
    this.remainingLife = POWERUP_LIFE;

    this.step = function(){
        this.remainingLife--;
    };

    this.draw = function(){
        if(this.remainingLife > 0){
            switch(type){
                case TYPE_LASER:
                    drawText('x',this.x,this.y,'yellow');
                    break;
                case TYPE_SHIELD:
                    drawText('x',this.x,this.y,'red');
                    break;
                case TYPE_HEALTH:
                    drawText('x',this.x,this.y,'blue');
                    break;
            }
        }
    };
}

