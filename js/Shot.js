// shot tuning constants
const SHOT_SPEED = 8.0;
const SHOT_LIFE = 120;
const SHOT_COLLISION_RADIUS = 16.0;
const TRACKING_STRENGTH = 0.1;
const BOSS_MISSILE_TRACKING_STRENGTH = 0.1;
const BOSS_MISSILE_TRACKING_LIMITER = 30 * (Math.PI/180);
const BOSS_TRACKING_MISSILE_SPEED = 10.0;


function Shot() {
    this.shotLife = 0;

    //Component List
    this.wrapComponent = new WrapComponent(this);
    this.isTrackingMissile = false;
}

Shot.prototype.reset = function() {
    this.wrapComponent.reset();
    this.shotLife = 0;
};

Shot.prototype.shootFrom = function(shipFiring, firingAngle, color) {

    this.x = shipFiring.x;
    this.y = shipFiring.y;

    this.xv = Math.cos(firingAngle) * SHOT_SPEED;
    this.yv = Math.sin(firingAngle) * SHOT_SPEED;

    // used to orient the sprite
    this.ang = firingAngle;

    this.color = color;
    this.shotLife = SHOT_LIFE;
};

Shot.prototype.move = function() {
    if (this.shotLife > 0) {
        this.shotLife--;
        this.wrapComponent.move();
    }
};

Shot.prototype.draw = function(typePlayerShot = false) {
    if (this.shotLife > 0) {
        if(gameManager.player.powerupLife[TYPE_LASER] !== 0 && typePlayerShot === true)
            drawScaledCenteredBitmapWithRotation(plasmaImage, this.x, this.y, 8, 17, this.ang + (90*Math.PI/180));
        else if(typePlayerShot === true)
            drawScaledCenteredBitmapWithRotation(playerBulletImage, this.x, this.y, 8, 17, this.ang + (90*Math.PI/180));
        else
            drawScaledCenteredBitmapWithRotation(enemyBulletImage, this.x, this.y, 8, 17, this.ang + (90*Math.PI/180));

    }
};

Shot.prototype.trackEnemy = function(){
        //point bullet toward nearest enemy if ZEALOT type  //probably needs tweaking seems a little OP at the moment
        if(gameManager.player.powerupLife[TYPE_ZEALOT] > 0 && gameManager.enemies.length > 0){
            var closestShip;
            var closestShipX;
            var closestShipY;
            var closestShipDistance = 1000;
            //find nearest enemy for ZEALOT seeker bullet to track toward
            for (var x = gameManager.enemies.length - 1; x >= 0; x--) {
                //distance from enemy
                var distanceToEnemy = Math.sqrt(Math.pow(gameManager.enemies[x].x - this.x,2) + Math.pow(gameManager.enemies[x].y - this.y, 2));
                if (distanceToEnemy < closestShipDistance ){
                    //save distance for comparison
                    closestShipDistance = distanceToEnemy;
                    //save ship for reference
                    closestShipX = gameManager.enemies[x].x;
                    closestShipY = gameManager.enemies[x].y;
                }
            }


            if(closestShip != 'undefined' && this != 'undefined'){
                // console.log(this.x);
                //actually calculating and changing the bullet velocity
                //var angleToEnemy = Math.atan2(closestShip.y - this.y, closestShip.x - this.x );
                var angleToEnemy = Math.atan2(closestShipY - this.y, closestShipX - this.x );
                this.xv = ((Math.cos(angleToEnemy) * TRACKING_STRENGTH) + (Math.cos(this.ang) * (1-TRACKING_STRENGTH))) * SHOT_SPEED;
                this.yv = ((Math.sin(angleToEnemy) * TRACKING_STRENGTH) + (Math.sin(this.ang) * (1-TRACKING_STRENGTH))) * SHOT_SPEED;
                //this.ang = angleToEnemy;
                this.ang = Math.atan2(this.yv, this.xv);
            }
        }
};


Shot.prototype.trackPlayer = function(){
        if(this.isTrackingMissile){
            //console.log(this.x);
            //actually calculating and changing the bullet velocity
            //var angleToEnemy = Math.atan2(closestShip.y - this.y, closestShip.x - this.x );
            var angleToEnemy = Math.atan2(gameManager.player.y - this.y, gameManager.player.x - this.x );
            var newMissileAngle = Math.abs(angleToEnemy - this.ang) > BOSS_MISSILE_TRACKING_LIMITER ? this.ang : angleToEnemy;
            this.xv = ((Math.cos(newMissileAngle) * BOSS_MISSILE_TRACKING_STRENGTH) + (Math.cos(this.ang) * (1-BOSS_MISSILE_TRACKING_STRENGTH))) * BOSS_TRACKING_MISSILE_SPEED;
            this.yv = ((Math.sin(newMissileAngle) * BOSS_MISSILE_TRACKING_STRENGTH) + (Math.sin(this.ang) * (1-BOSS_MISSILE_TRACKING_STRENGTH))) * BOSS_TRACKING_MISSILE_SPEED;
            //this.ang = angleToEnemy;
            this.ang = Math.atan2(this.yv, this.xv);
        }
};
