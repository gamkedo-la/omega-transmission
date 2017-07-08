// shot tuning constants
const SHOT_SPEED = 8.0;
const SHOT_LIFE = 120;
const SHOT_COLLISION_RADIUS = 16.0;


function Shot() {
    this.shotLife = 0;

    //Component List
    this.wrapComponent = new WrapComponent(this);
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
		/*
		//point bullet toward nearest enemy if ZEALOT type  //probably needs tweaking seems a little OP at the moment
		if(gameManager.player.powerupLife[TYPE_ZEALOT] > 0 && gameManager.enemies.length > 0){
			var closestShip;
			var closestShipDistance = 1000;
			//find nearest enemy for ZEALOT seeker shotto track toward
			for (var x = gameManager.enemies.length - 1; x >= 0; x--) {
				//distance from enemy
				var distanceToEnemy = Math.sqrt(Math.pow(gameManager.enemies[x].x - this.x,2) + Math.pow(gameManager.enemies[x].y - this.y, 2));
				if (distanceToEnemy < closestShipDistance ){
					//save distance for comparison
					closestShipDistance = distanceToEnemy;
					//save ship for reference
					closestShip = gameManager.enemies[x];
				}
			}
			
			
			if(closestShip != 'undefined'){
				console.log(this.x);
				//actually calculating and changing the bullet velocity
				var ang = Math.atan2(closestShip.y - this.y, closestShip.x - this.x);
				this.xv = Math.cos(ang) * SHOT_SPEED;
				this.yv = Math.sin(ang) * SHOT_SPEED;
			}
		}
		*/
        this.wrapComponent.move();
    }
};

Shot.prototype.draw = function() {
    if (this.shotLife > 0) {
        if(gameManager.player.powerupLife[TYPE_LASER] != 0)
            drawScaledCenteredBitmapWithRotation(plasmaImage, this.x, this.y, 8, 17, this.ang + (90*Math.PI/180)); // art is rotated 90 ccw wrong FIXME (outdated note?)
        else
            drawScaledCenteredBitmapWithRotation(bulletImage, this.x, this.y, 8, 17, this.ang + (90*Math.PI/180)); // art is rotated 90 ccw wrong FIXME
    }
};

