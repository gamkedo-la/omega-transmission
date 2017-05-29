// tuning constants
const SPACESPEED_DECAY_MULT = 0.99;
const THRUST_POWER = 0.1;
const DASH_DISTANCE = 250;
const TURN_RATE = 0.015;
const FIRE_RATE = 30;
const DASH_RATE = 300;
const PLAYER_MAX_HEALTH = 5;
const PLAYER_MAX_SHIELD = 5;
const SHIELD_COOLDOWN = 200;

function Ship() {

    // Component List
    this.wrapComponent = new WrapComponent(this);

    this.shotCooldown = 0;
    this.readyToFire = true;
    this.dashCooldown = 0;
    this.readyToDash = true;
    this.health = PLAYER_MAX_HEALTH;
    this.shield = 0;
    this.shieldCooldown = SHIELD_COOLDOWN;

    this.keyHeld_Up = false;
    this.keyHeld_Down = false;
    this.keyHeld_Left = false;
    this.keyHeld_Right = false;
    this.keyHeld_RapidFire = false;
    this.keyHeld_ForwardThrust = false;

    this.setupControls = function (upKey, downKey, leftKey, rightKey, shotKey, forwardKey) {
        this.controlKeyForUp = upKey;
        this.controlKeyForDown = downKey;
        this.controlKeyForLeft = leftKey;
        this.controlKeyForRight = rightKey;
        this.controlKeyForShotFire = shotKey;
        this.controlKeyForForwardThrust = forwardKey;
    }

    this.initialize = function(whichGraphic) {
        this.myBitmap = whichGraphic;
        this.reset();
    }

    this.reset = function() { 
        this.wrapComponent.reset();
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.ang = -0.5 * Math.PI;
    }
  
    this.cannonFire = function() {
        if (this.readyToFire == true) {
            var tempShot = new Shot();
            tempShot.shootFrom(this, this.ang, "white");
            gameManager.playerShots.push(tempShot);
            this.readyToFire = false;
            this.shotCooldown = FIRE_RATE;
        }
    }

    this.dash = function () {
        if (this.readyToDash == true) {
            this.x += Math.cos(this.ang) * DASH_DISTANCE;
            this.y += Math.sin(this.ang) * DASH_DISTANCE;
            this.readyToDash = false;
            this.dashCooldown = DASH_DISTANCE;
        }
    }
  
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

        if (this.keyHeld_Up == true) {
            this.yv -= THRUST_POWER;
        } else if (this.keyHeld_Down == true) {
            this.yv += THRUST_POWER;
        }

        if (this.keyHeld_Left == true) {
            this.xv -= THRUST_POWER;
        } else if (this.keyHeld_Right == true) {
            this.xv += THRUST_POWER;
        }

        if (this.keyHeld_ForwardThrust == true) {
            this.xv += Math.cos(this.ang) * THRUST_POWER;
            this.yv += Math.sin(this.ang) * THRUST_POWER;
        }

        var dx = inputManager.mouse.x - this.x;
        var dy = inputManager.mouse.y - this.y;
        this.ang = Math.atan2(dy, dx);
        this.wrapComponent.move();

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
    }
  
    this.draw = function () {
        drawCenteredBitmapWithRotation(this.myBitmap, this.x, this.y, this.ang);
        drawText(this.dashCooldown, this.x + 20, this.y + 15, 'white');
        drawText(this.health, this.x + 20, this.y + 5, 'tomato');
        drawText(this.shield, this.x + 20, this.y - 5, 'cyan');
    }
}