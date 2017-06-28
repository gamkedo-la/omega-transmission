// shot tuning constants
const SHOT_SPEED = 8.0;
const SHOT_LIFE = 120;
const SHOT_COLLISION_RADIUS = 8.0;


function Shot() {
    this.shotLife = 0;

    //Component List
    this.wrapComponent = new WrapComponent(this);

    this.reset = function() {
        this.wrapComponent.reset();
        this.shotLife = 0;
    };

    this.shootFrom = function(shipFiring, firingAngle, color) {
        this.x = shipFiring.x;
        this.y = shipFiring.y;

        this.xv = Math.cos(firingAngle) * SHOT_SPEED;
        this.yv = Math.sin(firingAngle) * SHOT_SPEED;

        // used to orient the sprite
        this.ang = firingAngle;

        this.color = color;
        this.shotLife = SHOT_LIFE;
    };

    this.move = function() {
        if (this.shotLife > 0) {
            this.shotLife--;
            this.wrapComponent.move();
        }
    };

    this.draw = function() {
        if (this.shotLife > 0) {
            if(gameManager.player.powerupLife[TYPE_LASER] != 0)
                drawScaledCenteredBitmapWithRotation(plasmaImage, this.x, this.y, 8, 17, this.ang + (90*Math.PI/180)); // art is rotated 90 ccw wrong FIXME (outdated note?)
            else
                drawScaledCenteredBitmapWithRotation(bulletImage, this.x, this.y, 8, 17, this.ang + (90*Math.PI/180)); // art is rotated 90 ccw wrong FIXME
        }
    };
}

