// keyboard keycode constants, determined by printing out evt.keyCode from a key handler
const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;
const KEY_LETTER_W = 87;
const KEY_LETTER_A = 65;
const KEY_LETTER_S = 83;
const KEY_LETTER_D = 68;
const KEY_LETTER_P = 80;
const KEY_SPACEBAR = 32;

function inputManager() {
    this.mouse = { x: 0, y: 0 };
    this.mouseMoved = false;
    this.gamepadMoved = false;

    this.setupControls = function (forwardKey, shotKey, strafeLeftKey, strafeRightKey, shieldKey) {
        this.controlKeyForShotFire = shotKey;
        this.controlKeyForForwardThrust = forwardKey;
        this.controlKeyForStrafeLeft = strafeLeftKey;
        this.controlKeyForStrafeRight = strafeRightKey;
		this.controlKeyForShield = shieldKey;
    };

    this.initializeInput = function() {
        document.addEventListener("keydown", this.keyPressed);
        document.addEventListener("keyup", this.keyReleased);
        document.addEventListener('mousemove', this.getMousePosition);
        canvas.addEventListener('mousedown', this.mousePressed);
        canvas.addEventListener('mouseup', this.mouseReleased);

        // commented out, broke Safari, can find another workaround -cdeleon
        //canvas.addEventListener('contextmenu', event => event.preventDefault()); //blocks right click menu
        //canvas.addEventListener('wheel', event => event.preventDefault());

        this.setupControls(KEY_LETTER_W, KEY_SPACEBAR, KEY_LETTER_A, KEY_LETTER_D, KEY_LETTER_S);
    };

    this.setKeyHoldState = function(thisKey, thisShip, setTo) {
        if (thisKey == this.controlKeyForStrafeLeft) {
            thisShip.keyHeld_StrafeLeft = setTo;
        }
        if (thisKey == this.controlKeyForStrafeRight) {
            thisShip.keyHeld_StrafeRight = setTo;
        }
        if (thisKey == this.controlKeyForUp) {
            thisShip.keyHeld_Up = setTo;
        }
        if (thisKey == this.controlKeyForDown) {
            thisShip.keyHeld_Down = setTo;
        }
        if (thisKey == this.controlKeyForForwardThrust) {
            thisShip.keyHeld_ForwardThrust = setTo;
        }
    };

    this.keyPressed = function (evt) {
        //needed to use inputManager instead of this due to scope with event
        inputManager.setKeyHoldState(evt.keyCode, gameManager.player, true);
        if (evt.keyCode == inputManager.controlKeyForShotFire) {
            gameManager.player.cannonFire();
        }
		else if(evt.keyCode == inputManager.controlKeyForShield) {
			gameManager.player.shieldUp();
		}
        else if (evt.keyCode == KEY_LETTER_P) {
            isGamePaused = (isGamePaused == true) ? false : true;
        }
		
        evt.preventDefault(); // without this, arrow keys scroll the browser!
    };

    this.keyReleased = function(evt) {
        inputManager.setKeyHoldState(evt.keyCode, gameManager.player, false);
    };

    this.getMousePosition = function(evt) {
        var rect = canvas.getBoundingClientRect();
        var root = document.documentElement;
        var canvasX = evt.clientX - rect.left - root.scrollLeft;
        var canvasY = evt.clientY - rect.top - root.scrollTop;

        inputManager.mouse.x = canvasX/gameManager.gameScale;
        inputManager.mouse.y = canvasY/gameManager.gameScale;
        inputManager.mouseMoved = true;
        inputManager.gamepadMoved = false;
    };

    this.mousePressed = function(evt) {
        if (evt.button == 0) {
            gameManager.player.keyHeld_RapidFire = true;
        }
        evt.preventDefault(); // to block default middle mouse scroll interaction
    };

    this.mouseReleased = function(evt) {
        if (evt.button == 0) {
            gameManager.player.keyHeld_RapidFire = false;
        }
        if (evt.button == 2) {
            gameManager.player.dash();
        }
        evt.preventDefault(); // to block default middle mouse scroll interaction
    };
}

