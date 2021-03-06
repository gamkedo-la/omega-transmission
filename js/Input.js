// keyboard keycode constants, determined by printing out evt.keyCode from a key handler
const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;
const KEY_LETTER_W = 87;
const KEY_LETTER_A = 65;
const KEY_LETTER_D = 68;
const KEY_LETTER_P = 80;
const KEY_LETTER_R = 82;
const KEY_LETTER_S = 83;
const KEY_LETTER_T = 84;
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
        canvas.addEventListener('mousemove', this.getMousePosition);
        canvas.addEventListener('mousedown', this.mousePressed);
        canvas.addEventListener('mouseup', this.mouseReleased);

        this.setupControls(KEY_LETTER_W, KEY_SPACEBAR, KEY_LETTER_A, KEY_LETTER_D, KEY_LETTER_S);
    };

    this.setKeyHoldState = function(thisKey, thisShip, setTo) {
        if (gameManager.player.isActive) {
            if (thisKey == this.controlKeyForStrafeLeft) {
                thisShip.keyHeld_StrafeLeft = setTo;
                if(!Sound.isPlaying("thrust") && thisShip.keyHeld_StrafeLeft) {
                    Sound.play("thrust",true,BACKGROUND_VOL/10);
                }
                else {
                    Sound.pause("thrust");
                }
            }
            if (thisKey == this.controlKeyForStrafeRight) {
                thisShip.keyHeld_StrafeRight = setTo;
                if(!Sound.isPlaying("thrust") && thisShip.keyHeld_StrafeRight)
                    Sound.play("thrust",true,BACKGROUND_VOL/10);
                else {
                    Sound.pause("thrust");
                }
            }
            if (thisKey == this.controlKeyForForwardThrust) {
                thisShip.keyHeld_ForwardThrust = setTo;
                if(!Sound.isPlaying("thrust") && thisShip.keyHeld_ForwardThrust) {
                    Sound.play("thrust",true,BACKGROUND_VOL/10);
                }
                else {
                    Sound.pause("thrust");
                }
            }

            if(thisKey == this.controlKeyForShield) {
                if(!thisShip.keyHeld_Shield && !Sound.isPlaying("shieldup"))
                    Sound.play("shieldup",false,BACKGROUND_VOL/5);
                thisShip.keyHeld_Shield = setTo;
            }
        }
    };

    this.keyPressed = function (evt) {
        //needed to use inputManager instead of this due to scope with event
        inputManager.setKeyHoldState(evt.keyCode, gameManager.player, true);
        if (evt.keyCode === inputManager.controlKeyForShotFire) {
            gameManager.player.cannonFire();
        }
        else if(evt.keyCode === inputManager.controlKeyForShield) {
            gameManager.player.shieldUp();
        }
        else if (evt.keyCode === KEY_LETTER_P) {
            if(!gameManager.menuStatus[MENU_END])
                isGamePaused = isGamePaused ? false : true;
        }
        else if (evt.keyCode === KEY_LETTER_T) {
            if(!Sound.mute) {
                Sound.Mute();
            } else {
                Sound.unMute();
            }
        }
        else if(!gameManager.player.isActive && evt.keyCode === KEY_LETTER_R) {
            gameManager.first = false;
            gameManager.reinit();
        }

        evt.preventDefault(); // without this, arrow keys scroll the browser!
    };

    this.keyReleased = function(evt) {
        inputManager.setKeyHoldState(evt.keyCode, gameManager.player, false);
        if(evt.keyCode == KEY_LETTER_S) {
            if(Sound.isPlaying("shieldup"))
                Sound.stop("shieldup");//play("shieldup",false,BACKGROUND_VOL/5);
        }
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

        if(gameManager.menuStatus.includes(true)) {
            switch(gameManager.menuStatus.indexOf(true)) {
                case MENU_MAIN:
                    var menu = gameManager.titleMenuItems;
                    break;
                case MENU_PAUSE:
                    var menu = gameManager.pauseMenuItems;
                    break;
                case MENU_END:
                    var menu = gameManager.endgameMenuItems;
                    break;
                case MENU_CTRL:
                    var menu = gameManger.controlsList;
                    break;
            }

            console.log("in here");
            var fontSize = 20;
            var height = 40 + menu.length * (2 * fontSize + 5);
            var width = 280; // Yea...
            fontSize = 12;

            for(var i = 0; i < menu.length; i++) {
                var xPos = virtualWidth/2;
                var yPos = (virtualHeight/2 - height/2 + 5*fontSize) + i*(2*fontSize+5);

                var optionWidth = canvasContext.measureText(menu[i]).width;

                if(inputManager.mouse.x >= xPos - optionWidth/2 &&
                    inputManager.mouse.x <= xPos + optionWidth/2 &&
                    inputManager.mouse.y >= yPos && inputManager.mouse.y <= yPos + fontSize) {
                    console.log("hi");
                    break;
                }
            }

            console.log("i: " + i);
            switch(i) {
                case 0:
                    isGamePaused = false;
            }
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

