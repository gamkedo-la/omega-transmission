const POWERUP_LIFE = 200;

function Powerup(locX,locY) {

    this.x= locX;
    this.y= locY;
    this.remainingLife = POWERUP_LIFE;

    this.step = function(){
        this.remainingLife--;
    };

    this.draw = function(){
        if(this.remainingLife > 0){
            drawText('x',this.x,this.y,'yellow');
        }
    };
}

