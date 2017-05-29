const USE_WEBGL_IF_SUPPORTED = false; // experimental and unfinished!

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    
	if (USE_WEBGL_IF_SUPPORTED && window.webGL) {
		// lazy-init a reference to a pure white blank texture and
		// make it a property in webGL for reuse
		if (!webGL.pureWhiteTexture) {
			console.log("webGL creating a new 1x1 pure white image...");
			var whiteImage = new Image();
			// 1x1 white gif see http://proger.i-forge.net/%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80/[20121112]%20The%20smallest%20transparent%20pixel.html
			whiteImage.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs="; 
			whiteImage.onload = function() { 
				console.log("Creating 1x1 white texture...");
				webGL.pureWhiteTexture = CreateTexture(webGL.g, whiteImage, whiteImage.width, whiteImage.height);
			}
		}
		
		// todo: fillcolor
		webGL.img(webGL.pureWhiteTexture, topLeftX, topLeftY, boxWidth, boxHeight, 0, 0, 0, 1, 1, 0, 0, 1, 1);
		}
	else // normal 2d rendering
	{
		canvasContext.fillStyle = fillColor;
		canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
	}
}

function colorCircle(centerX, centerY, radius, fillColor) {
	if (USE_WEBGL_IF_SUPPORTED && window.webGL) {
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
		
		// lazy-init a reference to a gl texture and
		// make it a property in the graphic for reuse
		if (!graphic.Texture) {
			console.log("webGL creating a new texture...");
			//graphic.Texture = webGL.TCTex(gl : WebGLRenderingContext, image : (Image | ArrayBuffer), width : Number, height: Number)
			graphic.Texture = CreateTexture(webGL.g, graphic, graphic.width, graphic.height); // TODO: force power-of-two size
		}
		
		//webGL.img( texture : WebGLTexture, x : Number, y : Number, width : Number, height : Number, rotation: Number, translateX: Number, translateY: Number, scaleX: Number, scaleY: Number, u0 : Number, v0 : Number, u1 : Number, v1 : Number)
		webGL.img(graphic.Texture, atX, atY, graphic.width, graphic.height, withAngle, 0, 0, 1, 1, 0, 0, 1, 1);
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

function drawText(text, x, y, fillColor) {
	if (USE_WEBGL_IF_SUPPORTED && window.webGL) {
		// fixme: text in webGL?
	}
	else
	{
		canvasContext.fillStyle = fillColor;
		canvasContext.fillText(text, x, y);
	}
}