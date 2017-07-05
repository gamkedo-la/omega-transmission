// tuning constants
const SPACESPEED_DECAY_MULT = 0.99;
const THRUST_POWER = 0.1;
const DASH_DISTANCE = 250;
const TURN_RATE = 0.015;
const FIRE_RATE = 10; // was a calm 30;
const DASH_RATE = 300;
const PLAYER_MAX_HEALTH = 5;
const PLAYER_MAX_SHIELD = 5;
const SHIELD_COOLDOWN = 200;

function Ship() {

    // Component List
    this.wrappingMovementComponent = new WrapComponent(this);
    //this.movementComponent = new movementComponent(this);

    this.shotCooldown = 0;
    this.readyToFire = true;
    this.dashCooldown = 0;
    this.readyToDash = true;
    this.health = PLAYER_MAX_HEALTH;
    this.shield = 0;
    this.shieldCooldown = SHIELD_COOLDOWN;
    this.powerupLife = [ 0, 0, 0 ];

    this.keyHeld_RapidFire = false;
    this.keyHeld_ForwardThrust = false;
    this.keyHeld_StrafeLeft = false;
    this.keyHeld_StrafeRight = false;


    this.initialize = function(whichGraphic) {
        this.myBitmap = whichGraphic;
        this.reset();
    };

    this.reset = function() {
        this.wrappingMovementComponent.reset();
        this.x = virtualWidth / 2;
        this.y = virtualHeight / 2;
        this.ang = -0.5 * Math.PI;
    };

    this.cannonFire = function() {
        if (this.readyToFire == true) {
            var tempShot = new Shot();
            tempShot.shootFrom(this, this.ang, "white");
            gameManager.playerShots.push(tempShot);
            this.readyToFire = false;

            if(this.powerupLife[0] > 0)
                this.shotCooldown = FIRE_RATE/2;
            else
                this.shotCooldown = FIRE_RATE;

            // muzzle flash at gun position:
            var shootx = this.x + (Math.cos(this.ang) * 30);
            var shooty = this.y + (Math.sin(this.ang) * 30);
            party(shootx,shooty);
        }
    };

    this.setPowerup = function(powerup){
        this.powerupLife[powerup.type] += 1000;
        if(powerup.type === TYPE_HEALTH) {
            this.health += POWERUP_HEALTH_INCREASE;
        }
        console.log("picked up powerup! ", + this.powerupLife[powerup.type]);
    };

    this.dash = function () {
        if (this.readyToDash == true) {
            this.x += Math.cos(this.ang) * DASH_DISTANCE;
            this.y += Math.sin(this.ang) * DASH_DISTANCE;
            this.readyToDash = false;
            this.dashCooldown = DASH_DISTANCE;
        }
    };

    this.update = function () {
        if (this.shotCooldown > 0) {
            this.shotCooldown--;
        } else {
            this.readyToFire = true;
        }

        if (this.dashCooldown > 0) {
            this.dashCooldown--;
        } else {
            this.readyToDash = true;
        }

        if (this.keyHeld_RapidFire == true) {
            this.cannonFire();
        }

        if (this.keyHeld_ForwardThrust == true) {
            this.xv += Math.cos(this.ang) * THRUST_POWER;
            this.yv += Math.sin(this.ang) * THRUST_POWER;
            // thruster flames at engine position:
            var shootx = this.x + (Math.cos(this.ang) * -20);
            var shooty = this.y + (Math.sin(this.ang) * -20);
            party(shootx,shooty);

        }

        if (this.keyHeld_StrafeRight == true) {
            this.xv += Math.cos(this.ang - Math.PI / 2) * THRUST_POWER;
            this.yv += Math.sin(this.ang - Math.PI / 2) * THRUST_POWER;
            // thruster flames at engine position:
            var shootx = this.x + (Math.cos(this.ang + Math.PI / 2) * +20);
            var shooty = this.y + (Math.sin(this.ang + Math.PI / 2) * +20);
            party(shootx,shooty);

        }

        if (this.keyHeld_StrafeLeft == true) {
            this.xv += Math.cos(this.ang + Math.PI / 2) * THRUST_POWER;
            this.yv += Math.sin(this.ang + Math.PI / 2) * THRUST_POWER;
            // thruster flames at engine position:
            var shootx = this.x + (Math.cos(this.ang - Math.PI / 2) * +20);
            var shooty = this.y + (Math.sin(this.ang - Math.PI / 2) * +20);
            party(shootx,shooty);

        }

        //prevent mouse position from causing a fight with the gamepad if it is in use
        if (inputManager.mouseMoved == true) {
            // rotate the ship to face the mouse cursor
            var dx = inputManager.mouse.x - this.x;
            var dy = inputManager.mouse.y - this.y;
            this.ang = Math.atan2(dy, dx);
        } else if (inputManager.gamepadMoved == true) {
            // detect gamepad aiming (if any) and override mouse cursor ang
            if (window.joystick) // created in GamepadSupport.js
            {
                var maybeAng = joystick.getAimAngle();
                //console.log("gamepad aiming mode: " + maybeAng);
                if (maybeAng != 0) { //special edge case so we ignore idle gamepads
                    this.ang = maybeAng;
                    // always fire if the gamepad is aiming!
                    this.cannonFire(); // TODO: maybe use R2/R1 for fire button?
                }
            }
        }

        //console.log("this.ang: " + this.ang);

        this.wrappingMovementComponent.move();

        this.xv *= SPACESPEED_DECAY_MULT;
        this.yv *= SPACESPEED_DECAY_MULT;

        if (this.shield < PLAYER_MAX_SHIELD) {
            if (this.shieldCooldown <= 0) {
                this.shield++;
                this.shieldCooldown = SHIELD_COOLDOWN;
            } else {
                this.shieldCooldown--;
            }
        }
    };

    this.draw = function () {
        drawScaledCenteredBitmapWithRotation(this.myBitmap, this.x, this.y, 32, 64, this.ang + (90*Math.PI/180)); // art is rotated 90 ccw wrong FIXME
        drawText(this.dashCooldown, this.x + 20, this.y + 15, 'white');
        drawText(this.health, this.x + 20, this.y + 5, 'tomato');
        drawText(this.shield, this.x + 20, this.y - 5, 'cyan');
    };
}

