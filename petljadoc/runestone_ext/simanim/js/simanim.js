pythonInitialized = false;
var canvas = [];
var ctx = [];
var imagePath = {}
var currentId;
var simStatus = {};
var animation_instance;
var timeoutFunc;
var startFrameDelay ; 
var endFrameDelay ;
//var start;
//var end;
SIM_STATUS_STOPPED = 1
SIM_STATUS_PLAYING = 2
SIM_STATUS_PAUSED = 3
SIM_STATUS_FINISHED = 4

window.onload = function () {

	// init pyodide
	languagePluginLoader.then(() =>
		pyodide.runPythonAsync(`
	import sys
	import traceback
	import io
	import js
	import micropip
	micropip.install('utils')
	micropip.install('${document.location.origin}/_static/simanim-0.2.0-py3-none-any.whl').then(js.pythonInicijalizovan())
	`)
	).then(() => {
		animations = document.getElementsByClassName('simanim')
		for (var i = 0; i < animations.length; i++) {
			simStatus[animations[i].id] = SIM_STATUS_STOPPED
			code = animations[i].getAttribute('data-code')
			animations[i].removeAttribute('data-code')
			path = animations[i].getAttribute('data-img-path')
			animations[i].removeAttribute('data-img-path')
			imagePath[animations[i].id] = path
			evaluatePython(animations[i].id, code)
		}
	});

	async function evaluatePython(id, code) {
		pyodide.globals.the_script = code
		pyodide.runPythonAsync(`
				try:
					exec(the_script,{'animation_instance_key' : '${id}'})
				except Exception:
					exc_type, exc_value, exc_tb = sys.exc_info()
					msg = ''.join(traceback.format_exception(exc_type, exc_value, exc_tb.tb_next))
				else:
					msg = 'OK'
					import simanim.pyodide.gui
				`)
			.then(() => {
				console.log(pyodide.globals.msg);
				animation_instance = pyodide.globals.simanim.pyodide.gui.animation_instance
			})
			.then(()  => generateModalForSim(id))
			.then(()  => {
				canvas[id] = document.getElementById('simCanvas_' + id);
				ctx[id] = canvas[id].getContext('2d');
			})
			.then(() => setupCanvas(id))
			.then(() => setTimeout(function(){cleanUp(id)},400))
			.catch(err => console.log(err));
	}


};

function pythonInicijalizovan() {
	pythonInitialized = true;
}

function startSim(el) {
	if (currentId != el.currentTarget.getAttribute('animId')) {
		cleanUp(currentId)
	}	
	currentId = el.currentTarget.getAttribute('animId')

	if (simStatus[currentId] == SIM_STATUS_STOPPED) {
		setGetters(currentId)
	}
	if (simStatus[currentId] == SIM_STATUS_FINISHED) {
		cleanUp(currentId)
	}
	document.getElementById('playBtn-' + currentId).classList.add('d-none');
	document.getElementById('pauseBtn-' + currentId).classList.remove('d-none');
	document.getElementById('stopBtn-' + currentId).removeAttribute('disabled');

	inputs = document.getElementsByClassName('variable-input-'+currentId)
	for(var i=0;i<inputs.length;i++){
		inputs[i].setAttribute('disabled','true')
	}

	simStatus[currentId] = SIM_STATUS_PLAYING;
//	start = window.performance.now();
	startDrawing();

}


function stopSim(el) {
	currentId = el.currentTarget.getAttribute('animId')
	cleanUp(currentId)
}


function pauseSim(el) {
	currentId = el.currentTarget.getAttribute('animId')
	document.getElementById('playBtn-' + currentId).classList.remove('d-none');
	document.getElementById('pauseBtn-' + currentId).classList.add('d-none');
	simStatus[currentId] = SIM_STATUS_PAUSED
}


function startDrawing() {
	console.log('rendering frame');
	startFrameDelay = window.performance.now();
	if (!animation_instance[currentId].getEndAnimation() && simStatus[currentId] == SIM_STATUS_PLAYING) {
		ctx[currentId].clearRect(0, 0, ctx[currentId].canvas.width, ctx[currentId].canvas.height);
		animation_instance[currentId].drawFrame();
		endFrameDelay = window.performance.now();
		timeoutFunc = setTimeout(startDrawing, animation_instance[currentId].anim_context.settings.update_period * 1000 - ( endFrameDelay - startFrameDelay));
	}
	else if (simStatus[currentId] == SIM_STATUS_STOPPED) {
		cleanUp(currentId)
	}
	else if (animation_instance[currentId].getEndAnimation()){
//		end = window.performance.now();
//		console.log(`Execution time: ${(end - start)/1000} s`);
		ctx[currentId].clearRect(0, 0, ctx[currentId].canvas.width, ctx[currentId].canvas.height);
		animation_instance[currentId].drawFrame();
		simStatus[currentId] = SIM_STATUS_FINISHED
		document.getElementById('playBtn-' + currentId).classList.remove('d-none');
		document.getElementById('playBtn-' + currentId).setAttribute('disabled', 'disabled');
		document.getElementById('pauseBtn-' + currentId).classList.add('d-none');
	
		clearTimeout(timeoutFunc)
	}
}

function cleanUp(id){
	simStatus[id] = SIM_STATUS_STOPPED
	ctx[id].clearRect(0, 0, ctx[id].canvas.width, ctx[id].canvas.height);
	currentId = id
	animation_instance[id].resetAnimation();
	document.getElementById('playBtn-' + id).classList.remove('d-none');
	document.getElementById('playBtn-' + id).removeAttribute('disabled');
	document.getElementById('pauseBtn-' + id).classList.add('d-none');
	document.getElementById('stopBtn-' + id).setAttribute('disabled', 'disabled');

	inputs = document.getElementsByClassName('variable-input')
	for(var i=0;i<inputs.length;i++){
		inputs[i].removeAttribute('disabled')
	}

	clearTimeout(timeoutFunc);
}

function setGettersFromInput(el){
	id = el.currentTarget.getAttribute('anim-variable-id')
	setGetters(id)
}

function setGetters(id){
	if(currentId != id){
		cleanUp(currentId)
	}
	currentId = id
	vi = document.getElementsByClassName('variable-input-' + id);
	viLabels = document.getElementsByClassName('variable-label-' + id);
	variableValues = {}
	for (var i = 0; i < vi.length; i++) {
		variableValues[viLabels[i].innerText.split(" ")[0]] = {'class':'variable-input-' + id,'ord' : i}
	}
	animation_instance[id].setVarGetters(variableValues)
	ctx[id].fillRect(0, 0, ctx[id].canvas.width, ctx[id].canvas.height);
	animation_instance[id].drawFrame();
}

function setupCanvas(id) {
	ctx[id].canvas.width = animation_instance[id].anim_context.settings.window_with_px;
	ctx[id].canvas.height = animation_instance[id].anim_context.settings.window_height_px;
	ctx[id].fillStyle = animation_instance[id].anim_context.settings.background_color;
	ctx[id].fillRect(0, 0, ctx[id].canvas.width, ctx[id].canvas.height);
	currentId = id
	animation_instance[id].drawFrame();
}



function generateModalForSim(id) {
	var modalDiv = document.createElement('div');
	modalDiv.setAttribute('id', 'simModal');
	modalDiv.setAttribute('class', 'modal fade');
	modalDiv.setAttribute('role', 'dialog');
	modalDiv.setAttribute('aria-hidden', 'true');

	var modalDivDialog = document.createElement('div');
	modalDivDialog.setAttribute('class', 'modal-sim' );

	var modalDivContent = document.createElement('div');
	modalDivContent.setAttribute('class', 'modal-content-sim');

	var modalDivBody = document.createElement('div');
	modalDivBody.setAttribute('class', 'modal-body');
	modalDivBody.setAttribute('id', 'simModalBody');

	var modalDivBodyControls = document.createElement('div');
	modalDivBodyControls.setAttribute('class', 'sim-controls');

	var playBtnsDiv = document.createElement('div');
	playBtnsDiv.setAttribute('class', 'play-button-div');

	var playBtn = document.createElement('button');
	playBtn.setAttribute('class', 'control-btn');
	playBtn.setAttribute('id', 'playBtn-' + id);
	playBtn.setAttribute('animId', id);
	playBtn.innerHTML = '<i class="fas fa-play"></i> PLAY';

	var stopBtn = document.createElement('button');
	stopBtn.setAttribute('class', 'control-btn');
	stopBtn.setAttribute('disabled', 'disabled');
	stopBtn.setAttribute('id', 'stopBtn-' + id);
	stopBtn.setAttribute('animId', id);
	stopBtn.innerHTML = '<i class="fas fa-stop"></i> STOP';

	var pauseBtn = document.createElement('button');
	pauseBtn.setAttribute('class', 'control-btn d-none');
	pauseBtn.setAttribute('id', 'pauseBtn-' + id);
	pauseBtn.setAttribute('animId', id);
	pauseBtn.innerHTML = '<i class="fas fa-pause"></i> PAUSE';

	playBtnsDiv.appendChild(playBtn);
	playBtnsDiv.appendChild(pauseBtn);
	playBtnsDiv.appendChild(stopBtn);
	modalDivBodyControls.appendChild(playBtnsDiv);

	var variablesDiv = document.createElement('div');
	variablesDiv.setAttribute('class', 'sim-modal-variables');
	variablesDiv.setAttribute('id', 'variablesDiv');


	var variables = animation_instance[id].getVars();
	for (var i = 0; i < variables.length; i++) {
		if (variables[i].meta["type"] == 'InputFloat') {
			var variableLabel = document.createElement('label');
			variableLabel.setAttribute('class', 'variable-label variable-label-' + id);
			variableLabel.innerHTML = `${variables[i].name} = `;

			var variableInput = document.createElement('input');
			variableInput.setAttribute('type', 'number');
			variableInput.setAttribute('class', 'variable-input variable-input-' + id);
			variableInput.setAttribute('anim-variable-id',id)
			variableInput.setAttribute('value', '' + variables[i]['meta']['default']);
			var max = variables[i]['meta']['limit_to']
			var step = Math.pow(10,Math.floor(Math.log10(max)-1))
			variableInput.setAttribute('min',variables[i]['meta']['limit_from'])
			variableInput.setAttribute('max',variables[i]['meta']['limit_to'])
			variableInput.setAttribute('step', step);
			variableInput.addEventListener('input',(el) =>{setGettersFromInput(el)})

			variablesDiv.appendChild(variableLabel);
			variablesDiv.appendChild(variableInput);
		}
		else {
			var variableLabel2 = document.createElement('label');
			variableLabel2.setAttribute('class', 'variable-label variable-label-' + id);
			variableLabel2.innerHTML = `${variables[i].name} = `;

			var selectInput = document.createElement('select');
			selectInput.setAttribute('class', 'variable-input variable-input-' + id)
			selectInput.setAttribute('anim-variable-id',id)
			for (var j = 0; j < variables[i].meta.lov.length; j++) {
				var selectOption1 = document.createElement('option');
				selectOption1.innerHTML = variables[i].meta.lov[j];
				selectInput.appendChild(selectOption1);
			}
			selectInput.addEventListener('input',(el) =>{setGettersFromInput(el)})
			variablesDiv.appendChild(variableLabel2);
			variablesDiv.appendChild(selectInput);
		}
	}



	modalDivBodyControls.appendChild(variablesDiv);

	var modalBodyCanvasDiv = document.createElement('div');
	modalBodyCanvasDiv.setAttribute('class', 'sim-modal-canvas');

	var canvas = document.createElement('canvas');
	canvas.setAttribute('id', 'simCanvas_' + id);
	canvas.setAttribute('class', ' sim-canvas')
	modalBodyCanvasDiv.appendChild(canvas);

	modalDivBody.appendChild(modalDivBodyControls);
	modalDivBody.appendChild(modalBodyCanvasDiv);

	modalDivContent.appendChild(modalDivBody);

	modalDivDialog.appendChild(modalDivContent);

	modalDiv.appendChild(modalDivDialog);

	document.getElementById(id).appendChild(modalDivDialog);


	if (document.getElementById('playBtn-' + id))
		document.getElementById('playBtn-' + id).addEventListener('click', function (el) {
			startSim(el);
		});

	if (document.getElementById('stopBtn-' + id))
		document.getElementById('stopBtn-' + id).addEventListener('click', function (el) {
			stopSim(el);
		});

	if (document.getElementById('pauseBtn-' + id))
		document.getElementById('pauseBtn-' + id).addEventListener('click', function (el) {
			pauseSim(el);
		});
}

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
	ctx[currentId].lineWidth  = lineWidth;
	if (lineDashed) {
		ctx[currentId].setLineDash([5, 5])
	}
	ctx[currentId].beginPath();
	ctx[currentId].moveTo(pointX1, pointY1);
	ctx[currentId].lineTo(pointX2, pointY2);
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

function drawTriangle(pointX1, pointY1, pointX2, pointY2,pointX3, pointY3, color, lineWidth, lineColor, lineDashed){
	ctx[currentId].save()
	ctx[currentId].strokeStyle = lineColor
	ctx[currentId].lineWidth  = lineWidth;
	ctx[currentId].fillStyle = lineColor;
	if (lineDashed) {
		ctx[currentId].setLineDash([5, 5])
	}
	ctx[currentId].beginPath();
	var path=new Path2D()
	path.moveTo(pointX1, pointY1);
	path.lineTo(pointX2, pointY2);
	path.lineTo(pointX3,pointY3);
	ctx[currentId].fill(path);
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
			//end = window.performance.now();
			//console.log(`Execution time: ${(end - start)} ms`);
		}
		//start = window.performance.now();
		simImages[imageName].src =pathJoin([imagePath[currentId], imageName]);
	}
	ctx[idOnLoad].restore()
}

function pathJoin(parts, sep){
   var separator = sep || '/';
   var replace   = new RegExp(separator+'{1,}', 'g');
   return parts.join(separator).replace(replace, separator);
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