function drawCircle(centerX, centerY, radius, color, lineWidth, lineColor, lineDashed) {
	ctx[currentId].save()
	ctx[currentId].fillStyle = color;
	ctx[currentId].strokeStyle = lineColor
	ctx[currentId].lineWidth = lineWidth;
	if (lineDashed) {
		ctx[currentId].setLineDash([5, 5])
	}
	ctx[currentId].beginPath();
	ctx[currentId].arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	ctx[currentId].closePath();
	ctx[currentId].fill();
	ctx[currentId].stroke();
	ctx[currentId].restore()
}

function drawBox(pointX, pointY, width, height, color, lineWidth, lineColor, lineDashed) {
	ctx[currentId].save()
	if (lineWidth > 0) {
		ctx[currentId].fillStyle = color;
		ctx[currentId].strokeStyle = lineColor
		ctx[currentId].lineWidth = lineWidth;
		if (lineDashed) {
			ctx[currentId].setLineDash([5, 5])
		}
		ctx[currentId].beginPath();
		ctx[currentId].rect(pointX, pointY, width, height);
		ctx[currentId].closePath();
		ctx[currentId].fill();
		ctx[currentId].stroke();
	}
	ctx[currentId].restore()
}
function drawLine(pointX1, pointY1, pointX2, pointY2, color, lineWidth, lineColor, lineDashed) {
	ctx[currentId].save()
	ctx[currentId].strokeStyle = lineColor
	ctx[currentId].lineWidth = lineWidth;
	if (lineDashed) {
		ctx[currentId].setLineDash([5, 5])
	}
	ctx[currentId].beginPath();
	ctx[currentId].moveTo(pointX1, pointY1);
	ctx[currentId].lineTo(pointX2, pointY2);
	ctx[currentId].closePath();
	ctx[currentId].stroke();
	ctx[currentId].restore()
}
function drawPolyLine(polyLine, color, lineWidth, lineColor, lineDashed) {
	ctx[currentId].save()
	if (polyLine.length < 1) {
		return;
	}
	ctx[currentId].fillStyle = color;
	ctx[currentId].strokeStyle = lineColor
	ctx[currentId].lineWidth = lineWidth;
	if (lineDashed) {
		ctx[currentId].setLineDash([5, 5])
	}
	ctx[currentId].beginPath();
	ctx[currentId].moveTo(polyLine[0][0], polyLine[0][1])
	for (i = 1; i < polyLine.length; i++) {
		ctx[currentId].lineTo(polyLine[i][0], polyLine[i][1])
	};
	ctx[currentId].stroke();
	ctx[currentId].restore()
}
var simImages = []
function drawImage(imageName, pointX1, pointY1, width, height) {
	var idOnLoad = currentId
	ctx[idOnLoad].save()
	if (imageName in simImages)
		ctx[idOnLoad].drawImage(simImages[imageName], pointX1, pointY1, width, height);
	else {
		simImages[imageName] = new Image();
		simImages[imageName].onload = function () {
			ctx[idOnLoad].drawImage(simImages[imageName], pointX1, pointY1, width, height);
		}
		simImages[imageName].src = imageName;
	}
	ctx[idOnLoad].restore()
}

function drawText(pointX1, pointY1, fontSize, text) {
	ctx[currentId].save()
	ctx[currentId].fillStyle = 'black'
	ctx[currentId].font = `bold ${fontSize}px Courier New`;
	ctx[currentId].fillText(text, pointX1, pointY1);
	ctx[currentId].restore()
}

function restore() {
	ctx[currentId].setTransform(1, 0, 0, 1, 0, 0);
}

function rotate(point, angle) {
	ctx[currentId].translate(point[0], point[1]);
	ctx[currentId].rotate(angle);
	ctx[currentId].translate(- point[0], - point[1]);
}