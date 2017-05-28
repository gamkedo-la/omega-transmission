// keyboard keycode constants, determined by printing out evt.keyCode from a key handler  
const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;
const KEY_LETTER_W = 87;
const KEY_LETTER_A = 65;
const KEY_LETTER_S = 83;
const KEY_LETTER_D = 68;
const KEY_SPACEBAR = 32;

mouse = [0, 0];

function initializeInput() {
    document.addEventListener("keydown", keyPressed);
    document.addEventListener("keyup", keyReleased);
    document.addEventListener('mousemove', getMousePosition);
    document.addEventListener('mousedown', mousePressed);
    document.addEventListener('mouseup', mouseReleased);

    canvas.addEventListener('contextmenu', event => event.preventDefault());

    gameManager.player.setupControls(KEY_LETTER_W, KEY_LETTER_S, KEY_LETTER_A, KEY_LETTER_D, KEY_SPACEBAR, KEY_UP_ARROW);
}

function setKeyHoldState(thisKey, thisShip, setTo) {
    if (thisKey == thisShip.controlKeyForLeft) {
        thisShip.keyHeld_Left = setTo;
    }
    if (thisKey == thisShip.controlKeyForRight) {
        thisShip.keyHeld_Right = setTo;
    }
    if (thisKey == thisShip.controlKeyForUp) {
        thisShip.keyHeld_Up = setTo;
    }
    if (thisKey == thisShip.controlKeyForDown) {
        thisShip.keyHeld_Down = setTo;
    }
    if (thisKey == thisShip.controlKeyForForwardThrust) {        
        thisShip.keyHeld_ForwardThrust = setTo;
    }
}

function keyPressed(evt) {
    setKeyHoldState(evt.keyCode, gameManager.player, true);
    if (evt.keyCode == gameManager.player.controlKeyForShotFire) {
        gameManager.player.cannonFire();
    }
    evt.preventDefault(); // without this, arrow keys scroll the browser!
}

function keyReleased(evt) {
    setKeyHoldState(evt.keyCode, gameManager.player, false);
}

function getMousePosition(evt) {
    mouse[0] = evt.clientX;
    mouse[1] = evt.clientY;
}

function mousePressed(evt) {
    if (evt.button == 0) {
        gameManager.player.keyHeld_RapidFire = true;
    }
}

function mouseReleased(evt) {
    if (evt.button == 0) {
        gameManager.player.keyHeld_RapidFire = false;
    }
    if (evt.button == 2) {
        gameManager.player.dash();
    }
}