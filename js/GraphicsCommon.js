const USE_WEBGL_IF_SUPPORTED = false; // experimental and unfinished!
// note by cdeleon: I haven't properly handled gameManager.gameScale in webGL :/

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {

    if (USE_WEBGL_IF_SUPPORTED && window.webGL) {

        // TODO: we need to parse "any": css color string like "violet"
        //if (fillColor=='black') webGL.col = 0x000000FF; // etc

        if (webGL.pureWhiteTexture)
            webGL.img(webGL.pureWhiteTexture, topLeftX, topLeftY, boxWidth, boxHeight, 0,
                                0, 0, gameManager.gameScale, gameManager.gameScale, 0, 0, 1, 1);

        }
    else // normal 2d rendering
    {
        canvasContext.fillStyle = fillColor;
        canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
    }
}

function colorCircle(centerX, centerY, radius, fillColor) {
    if (USE_WEBGL_IF_SUPPORTED && window.webGL) {

        // TODO: currently draws a square not a circle: use an image please
        if (webGL.pureWhiteTexture)
            webGL.img(webGL.pureWhiteTexture, centerX-(radius/2), centerY-(radius/2), radius, radius, 0,
                        0, 0, gameManager.gameScale, gameManager.gameScale, 0, 0, 1, 1);

    }
    else // normal 2d rendering
    {
        canvasContext.fillStyle = fillColor;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        canvasContext.fill();
    }
}

function drawCenteredBitmapWithRotation(graphic, atX, atY, withAngle) {

    if (USE_WEBGL_IF_SUPPORTED && window.webGL) {

        // maybe lazy-init a reference to a gl texture and remember it as a property of the graphic
        if (!graphic.Texture && graphic) {
            console.log("webGL creating a new texture of size: " +graphic.width+","+graphic.height);
            graphic.Texture = CreateTexture(webGL.g, graphic, graphic.width, graphic.height); // TODO: force power-of-two size
        }

        //webGL.img( texture : WebGLTexture, x : Number, y : Number, width : Number, height : Number, rotation: Number, translateX: Number, translateY: Number, scaleX: Number, scaleY: Number, u0 : Number, v0 : Number, u1 : Number, v1 : Number)
        webGL.img(graphic.Texture, -graphic.width/2, -graphic.height/2, graphic.width, graphic.height, withAngle, atX, atY, gameManager.gameScale, gameManager.gameScale, 0, 0, 1, 1);
    }
    else // fallback to slow but compatible rendering mode
    {
        canvasContext.save();
        canvasContext.translate(atX, atY);
        canvasContext.rotate(withAngle);
        canvasContext.drawImage(graphic, -graphic.width / 2, -graphic.height / 2);
        canvasContext.restore();
    }
}

function drawScaledCenteredBitmapWithRotation(graphic, atX, atY, targetWidth, targetHeight, withAngle) {

    if (USE_WEBGL_IF_SUPPORTED && window.webGL) {

        // maybe lazy-init a reference to a gl texture and remember it as a property of the graphic
        if (!graphic.Texture && graphic) {
            console.log("webGL creating a new texture of size: " + graphic.width + "," + graphic.height);
            graphic.Texture = CreateTexture(webGL.g, graphic, graphic.width, graphic.height); // TODO: force power-of-two size
        }

        //webGL.img( texture : WebGLTexture, x : Number, y : Number, width : Number, height : Number, rotation: Number, translateX: Number, translateY: Number, scaleX: Number, scaleY: Number, u0 : Number, v0 : Number, u1 : Number, v1 : Number)
        webGL.img(graphic.Texture, -graphic.width / 2, -graphic.height / 2, graphic.width, graphic.height, withAngle, atX, atY, gameManager.gameScale, gameManager.gameScale, 0, 0, 1, 1);
    }
    else // fallback to slow but compatible rendering mode
    {
        canvasContext.save();
        canvasContext.translate(atX, atY);
        canvasContext.rotate(withAngle);
        canvasContext.drawImage(graphic, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
        canvasContext.restore();
    }
}

function drawText(text, x, y, fillColor) {

    if (USE_WEBGL_IF_SUPPORTED && window.webGL) {

        // fixme: webGL has no font rendering
        // this is a game-specific hack: dots instead of numbers!
        var numDots = parseInt(text);

        if (isNaN(numDots)) numDots = 1; // turn text into a single dot for now lol
        //console.log("drawText: " + text + " = " + numDots);

        if (!numDots || (numDots < 0)) numDots = 0;
        if (numDots > 10) numDots = 10;
        for (var loop=0; loop<numDots; loop++)
        {
            colorCircle(x+4+(loop*8),y,6,fillColor);
        }

    }
    else
    {
        canvasContext.fillStyle = fillColor;
        canvasContext.fillText(text, x, y);
    }
}

function renderMenu(titleString,menuItems,excludedIndices=[],width=0,height=0) {
    var fontSize = 20;
    canvasContext.textBaseline = 'middle';
    canvasContext.textAlign = "center";
    canvasContext.font = fontSize + "px PressStart";

    if(!width && !height) {
        height = 40 + menuItems.length * (2 * fontSize + 5);
        width = 280; // Yea...
    }

    colorRect(virtualWidth/2-width/2,virtualHeight/2-height/2 - 20,
        width,height,"black");
    drawText(titleString,virtualWidth/2,
        virtualHeight/2 - height/2 + fontSize/2,"yellow");

    fontSize *= 3/5;
    canvasContext.font = fontSize + "px PressStart";
    for (var i = 0; i < menuItems.length; i++) {
        var xPos = virtualWidth/2;
        var yPos = (virtualHeight/2 - height/2 + 5*fontSize) + i*(2*fontSize+5);

        var optionWidth = canvasContext.measureText(menuItems[i]).width;

        if(!(excludedIndices.includes(i)) && inputManager.mouse.x >= xPos - optionWidth/2 &&
            inputManager.mouse.x <= xPos + optionWidth/2 &&
            inputManager.mouse.y >= yPos && inputManager.mouse.y <= yPos + fontSize) {

            drawText("**",xPos-optionWidth/2-10,yPos,"yellow");
            drawText("**",xPos+optionWidth/2+10,yPos,"yellow");
        }
        drawText(menuItems[i],xPos,yPos,"white");
    }

    canvasContext.textBaseline = "left";
    canvasContext.textAlign = "left";
}

