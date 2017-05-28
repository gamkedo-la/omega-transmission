function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}
  
function drawCenteredBitmapWithRotation(graphic, atX, atY, withAngle) {
    canvasContext.save(); 
    canvasContext.translate(atX, atY); 
    canvasContext.rotate(withAngle); 
    canvasContext.drawImage(graphic, -graphic.width / 2, -graphic.height / 2);
    canvasContext.restore(); 
}

function drawText(text, x, y, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillText(text, x, y);
}