pythonInitialized = false;

SIM_STATUS_STOPPED = 1
SIM_STATUS_PLAYING = 2
SIM_STATUS_PAUSED = 3
SIM_STATUS_FINISHED = 4

simanimList = {}

function SimAnim (opts) {
    if (opts) {
        this.init(opts);
    }
}

SimAnim.prototype.init = async function(opts){
	this.opts = opts
	this.id = opts.id
	this.simStatus = SIM_STATUS_STOPPED
	this.code = opts.getAttribute('data-code')
	this.imgPath = opts.getAttribute('data-img-path')
	this.scale = parseFloat(opts.getAttribute('data-scale'))
	this.pythonError = false
	this.pythonErrorMsg = ""
	this.varsInputElementId = {}
	this.eventQue = []
	this.simImages = {}
	this.drawFunctions = {'circle' : this.drawCircle,
						  'box' : this.drawBox,
						  'line' : this.drawLine, 
						  'triangle' : this.drawTriangle,
						  'polyLine' : this.drawPolyLine,
						  'image' : this.drawImage,
						  'text' : this.drawText,
						  'rotate' : this.rotate,
						  'restore' : this.restore
						}
	await this.execPython()
	if(this.pythonError){
	   console.log(this.pythonErrorMsg)
	}
	else{
		this.generateHTMLForSim() 
		await this.setupCanvas()
		await this.execDrawing()
	}
}

SimAnim.prototype.execDrawing = async function(){
	for(var i =0; i < this.eventQue.length; i++){
		await this.eventQue[i]()
	}
	this.eventQue = []
}

SimAnim.prototype.setupCanvas = function() {
	this.ctx.canvas.width = this.animation_instance.anim_context.settings.window_with_px * this.scale;
	this.ctx.canvas.height = this.animation_instance.anim_context.settings.window_height_px * this.scale;

	this.scale =  this.animation_instance.anim_context.settings.px_per_unit * this.scale
	this.animation_instance_x_min = this.animation_instance.anim_context.settings.view_box[0][0]
	this.animation_instance_y_min  =  this.animation_instance.anim_context.settings.view_box[0][1]
	this.animation_instance_height = this.animation_instance.anim_context.settings.view_box[2]
	this.update_period = this.animation_instance.anim_context.settings.update_period

	this.ctx.fillStyle = this.animation_instance.anim_context.settings.background_color;
	this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

	this.animation_instance.drawFrame();
}

SimAnim.prototype.setPythonErrorMsg = function(msg){
	this.pythonError = true
	this.pythonErrorMsg = msg
}

SimAnim.prototype.execPython = function(){
	pyodide.globals.the_script = this.code
	return pyodide.runPythonAsync(`
			try:
				exec(the_script,{'animation_instance_key' : '${this.id}'})
			except Exception:
				exc_type, exc_value, exc_tb = sys.exc_info()
				msg = ''.join(traceback.format_exception(exc_type, exc_value, exc_tb.tb_next))
				js.simanimList['${this.id}'].setPythonErrorMsg(msg)
			else:
				import simanim.pyodide.gui						
			`)
		.then(() => {				
			this.animation_instance = pyodide.globals.simanim.pyodide.gui.animation_instance[this.id]
		})
}

SimAnim.prototype.generateHTMLForSim = function() {
	var simDiv = document.createElement('div');
	simDiv.setAttribute('class', 'modal-sim');

	var simDivContent = document.createElement('div');
	simDivContent.setAttribute('class', 'modal-content-sim');

	var simDivControls = document.createElement('div');
	simDivControls.setAttribute('class', 'sim-controls');

	var controlBtnDiv = document.createElement('div');
	controlBtnDiv.setAttribute('class', 'control-button-div');

	this.playBtn = document.createElement('button');
	this.playBtn.setAttribute('class', 'control-btn');
	this.playBtn.addEventListener('click', this.startSim.bind(this));
	this.playBtn.innerHTML = '<i class="fas fa-play"></i> PLAY';

	this.stopBtn = document.createElement('button');
	this.stopBtn.setAttribute('class', 'control-btn');
	this.stopBtn.setAttribute('disabled', 'disabled');
	this.stopBtn.addEventListener('click', this.stopSim.bind(this));
	this.stopBtn.innerHTML = '<i class="fas fa-stop"></i> STOP';

	this.pauseBtn = document.createElement('button');
	this.pauseBtn.setAttribute('class', 'control-btn d-none');
	this.pauseBtn.addEventListener('click', this.pauseSim.bind(this));
	this.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> PAUSE';

	controlBtnDiv.appendChild(this.playBtn);
	controlBtnDiv.appendChild(this.pauseBtn);
	controlBtnDiv.appendChild(this.stopBtn);
	
	simDivControls.appendChild(controlBtnDiv);

	var variablesDiv = document.createElement('div');
	variablesDiv.setAttribute('class', 'sim-modal-variables');
	variablesDiv.setAttribute('id', 'variablesDiv');

	var variables = this.animation_instance.getVars();
	for (var i = 0; i < variables.length; i++) {
		if (variables[i].meta["type"] == 'InputFloat') {
			var variableLabel = document.createElement('label');
			variableLabel.setAttribute('class', 'variable-label');
			variableLabel.innerHTML = `${variables[i].name} = `;

			var max = variables[i]['meta']['limit_to']
			var step = Math.pow(10,Math.floor(Math.log10(max)-1))

			var variableInput = document.createElement('input');
			variableInput.setAttribute('type', 'number');
			variableInput.setAttribute('class', 'variable-input');	
			variableInput.setAttribute('id', this.id + '-' +i)		
			variableInput.setAttribute('value', '' + variables[i]['meta']['default']);
			variableInput.setAttribute('min',variables[i]['meta']['limit_from'])
			variableInput.setAttribute('max',variables[i]['meta']['limit_to'])		
			variableInput.setAttribute('step', step);
			variableInput.addEventListener('input',this.setGetters.bind(this))

			this.varsInputElementId[variables[i].name] = this.id + '-' +i	

			variablesDiv.appendChild(variableLabel);
			variablesDiv.appendChild(variableInput);
		}
		else {
			var variableLabel = document.createElement('label');
			variableLabel.setAttribute('class', 'variable-label');
			variableLabel.innerHTML = `${variables[i].name} = `;

			var selectInput = document.createElement('select');
			selectInput.setAttribute('class', 'variable-input')
			selectInput.setAttribute('id', this.id + '-' +i)
			selectInput.addEventListener('input',this.setGetters.bind(this))

			for (var j = 0; j < variables[i].meta.lov.length; j++) {
				var selectOption = document.createElement('option');
				selectOption.innerHTML = variables[i].meta.lov[j];
				selectInput.appendChild(selectOption);
			}
			this.varsInputElementId[variables[i].name] = this.id + '-' +i

			variablesDiv.appendChild(variableLabel);
			variablesDiv.appendChild(selectInput);
		}
	}

	simDivControls.appendChild(variablesDiv);

	var simBodyCanvasDiv = document.createElement('div');
	simBodyCanvasDiv.setAttribute('class', 'sim-modal-canvas');

	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('id', 'simCanvas-' + this.id);
	this.canvas.setAttribute('class', ' sim-canvas')
	this.ctx = this.canvas.getContext('2d');

	simBodyCanvasDiv.appendChild(this.canvas);
	simDivContent.appendChild(simDivControls);
	simDivContent.appendChild(simBodyCanvasDiv);

	simDiv.appendChild(simDivContent);
	this.opts.appendChild(simDiv);

}

SimAnim.prototype.startSim = function() {
	this.playBtn.classList.add('d-none');
	this.pauseBtn.classList.remove('d-none');
	this.stopBtn.removeAttribute('disabled');

	for (var varName in this.varsInputElementId) {
		document.getElementById(this.varsInputElementId[varName]).setAttribute('disabled','true')
	}
	this.simStatus = SIM_STATUS_PLAYING;
	this.startDrawing.call(this)
}

SimAnim.prototype.setGetters = async function(){
	variableValues = {}
	for (var varName in this.varsInputElementId) {
		variableValues[varName] = this.varsInputElementId[varName] 
	}
	this.animation_instance.setVarGetters(variableValues)
	this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	this.animation_instance.drawFrame();
	await this.execDrawing()
}

SimAnim.prototype.startDrawing = async function(){
	var startDrawing =  window.performance.now();
	if (!this.animation_instance.getEndAnimation() && this.simStatus == SIM_STATUS_PLAYING) {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.animation_instance.drawFrame();
		await this.execDrawing()
		var endDrawing = window.performance.now();
		this.timeoutFunc = setTimeout(() => {this.startDrawing.call(this)}, this.update_period*1000 - (endDrawing - startDrawing)/1000);
	}
	else if (this.animation_instance.getEndAnimation()){
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.animation_instance.drawFrame();
		await this.execDrawing()

		this.simStatus = SIM_STATUS_FINISHED
		this.playBtn.classList.remove('d-none');
		this.playBtn.setAttribute('disabled', 'disabled');
		this.pauseBtn.classList.add('d-none');
	
		clearTimeout(this.timeoutFunc)
	}
}

SimAnim.prototype.cleanUp = async function(){
	this.simStatus = SIM_STATUS_STOPPED
	this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	this.animation_instance.resetAnimation();
	await this.execDrawing()

	this.playBtn.classList.remove('d-none');
	this.playBtn.removeAttribute('disabled');
	this.pauseBtn.classList.add('d-none');
	this.stopBtn.setAttribute('disabled', 'disabled');

	for (var varName in this.varsInputElementId) {
		document.getElementById(this.varsInputElementId[varName]).removeAttribute('disabled')
	}

	clearTimeout(this.timeoutFunc);
}

SimAnim.prototype.stopSim = function() {
	this.cleanUp()
}

SimAnim.prototype.pauseSim = function() {
	this.playBtn.classList.remove('d-none');
	this.pauseBtn.classList.add('d-none');
	this.simStatus = SIM_STATUS_PAUSED
}

SimAnim.prototype.queueDrawEvent = function(type, obj){
	this.eventQue.push(this.drawFunctions[type].bind(this, obj))
}

SimAnim.prototype.scalarToPixel = function(scalar){
	return scalar * this.scale
}

SimAnim.prototype.pointToPixel = function(point){
	scalarPointX = this.scalarToPixel(point[0] - this.animation_instance_x_min)
	scalarPointY = this.scalarToPixel(this.animation_instance_y_min + this.animation_instance_height - point[1])
	return [scalarPointX, scalarPointY]
}
SimAnim.prototype.rectToPixel = function(rect){
	var xy_min = this.pointToPixel([rect.xy_min[0],rect.xy_min[1] + rect.height])
	var width = this.scalarToPixel(rect.width)
	var height = this.scalarToPixel(rect.height)
	return [xy_min, width, height]
}

SimAnim.prototype.drawCircle = function(circle){
	this.ctx.save()
	this.ctx.fillStyle = circle.fill_color;
	this.ctx.strokeStyle = circle.pen_color
	this.ctx.lineWidth = this.scalarToPixel(circle.line_width);
	if (this.ctx.line_dashed) {
		this.ctx.setLineDash([5, 5])
	}
	center = this.pointToPixel(circle.center)
	radius = this.scalarToPixel(circle.radius)
	this.ctx.beginPath();
	this.ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI, false);
	this.ctx.closePath();
	this.ctx.fill();
	this.ctx.stroke();
	this.ctx.restore();
}

SimAnim.prototype.drawBox = function(rect) {
	this.ctx.save()
	if (rect.line_width > 0) {
		this.ctx.fillStyle = rect.fill_color;
		this.ctx.strokeStyle = rect.pen_color
		this.ctx.lineWidth = this.scalarToPixel(rect.line_width);
		if (rect.line_dashed) {
			this.ctx.setLineDash([5, 5])
		}
		scaledRect = this.rectToPixel(rect)
		this.ctx.beginPath();
		this.ctx.rect(scaledRect[0][0], scaledRect[0][1], scaledRect[1], scaledRect[2]);
		this.ctx.closePath();
		this.ctx.fill();
		this.ctx.stroke();
	}
	this.ctx.restore()
}

SimAnim.prototype.drawLine = function(line) {
	this.ctx.save()
	this.ctx.strokeStyle = line.pen_color
	this.ctx.lineWidth = this.scalarToPixel(line.line_width);
	if (line.line_dashed) {
		this.ctx.setLineDash([5, 5])
	}
	this.ctx.beginPath();
	point1 = this.pointToPixel(line.point1)
	point2 = this.pointToPixel(line.point2)
	this.ctx.moveTo(point1[0], point1[1]);
	this.ctx.lineTo(point2[0], point2[1]);
	this.ctx.stroke();
	this.ctx.restore()
}
SimAnim.prototype.drawPolyLine = function(polyLine) {
	this.ctx.save()
	var n = polyLine.points.length
	if (n < 1) {
		return;
	}
	let points = polyLine.points
	this.ctx.fillStyle = polyLine.fill_color;
	this.ctx.strokeStyle = polyLine.pen_color
	this.ctx.lineWidth = this.scalarToPixel(polyLine.line_width);
	if (polyLine.line_dashed) {
		this.ctx.setLineDash([5, 5])
	}
	this.ctx.beginPath();
	var scalarPointX 
	var scalarPointY 
	[scalarPointX, scalarPointY] = this.pointToPixel(points[0])
	this.ctx.moveTo(scalarPointX,scalarPointY)
	for (i = 1; i < n; i++) {
		[scalarPointX, scalarPointY] = this.pointToPixel(points[i])
		this.ctx.lineTo(scalarPointX,scalarPointY)
	};
	this.ctx.stroke();
	this.ctx.restore()
}

SimAnim.prototype.drawTriangle = function(triangle) {
	//triangle[6] canvas settings
	//trinagle[0] point 1  X
	//trinagle[1] point 1  Y
	//trinagle[2] point 2  X
	//trinagle[3] point 2  Y
	//trinagle[4] point 3  X
	//trinagle[5] point 3  Y
	this.ctx.save()
	this.ctx.strokeStyle = triangle[6].pen_color;
	this.ctx.lineWidth  = this.scalarToPixel(triangle[6].line_width);
	this.ctx.fillStyle = triangle[6].pen_color;
	if (triangle[6].line_dashed) {
		this.ctx.setLineDash([5, 5])
	}
	point1 = this.pointToPixel([triangle[0],triangle[1]])
	point2 = this.pointToPixel([triangle[2],triangle[3]])
	point3 = this.pointToPixel([triangle[4],triangle[5]])
	this.ctx.beginPath();
	var path=new Path2D()
	path.moveTo(point1[0], point1[1]);
	path.lineTo(point2[0], point2[1]);
	path.lineTo(point3[0], point3[1]);
	this.ctx.fill(path);
	this.ctx.stroke();
	this.ctx.restore()

}

SimAnim.prototype.drawImage = function(image) {
	this.ctx.save()
	return new Promise(function (resolve){
		if (image.file in this.simImages)
			resolve(image)
		else {
			this.simImages[image.file] = new Image();
			this.simImages[image.file].onload = () => {
				resolve(image)
			}
			this.simImages[image.file].src = pathJoin([this.imgPath, image.file]);
		}
		
	}.bind(this)).then((image) => {
		var xy_min = this.pointToPixel([image.xy_min[0],image.xy_min[1] + image.height])
		var width = this.scalarToPixel(image.width)
		var height = this.scalarToPixel(image.height)
		this.ctx.drawImage(this.simImages[image.file], xy_min[0], xy_min[1], width, height);
		this.ctx.restore()
	});

}

SimAnim.prototype.drawText = function(text) {
	this.ctx.save()
	this.ctx.fillStyle = 'black'
	font_size = this.scalarToPixel(text.font_size)
	this.ctx.font = `bold ${font_size}px Courier New`;
	position = this.pointToPixel(text.position)
	this.ctx.fillText(text.content, position[0], position[1]);
	this.ctx.restore()
}

SimAnim.prototype.restore = function() {
	this.ctx.setTransform(1, 0, 0, 1, 0, 0);
}

SimAnim.prototype.rotate = function(point) {
	scaledPoint = this.pointToPixel(point[0])
	this.ctx.translate( scaledPoint[0], scaledPoint[1]);
	this.ctx.rotate(point[1]);
	this.ctx.translate(- scaledPoint[0], - scaledPoint[1]);
}

window.addEventListener('load',function() {
	// init pyodide
	languagePluginLoader.then(() =>
		pyodide.runPythonAsync(`
	import sys
	import traceback
	import io
	import js
	import micropip
	micropip.install('utils')
	micropip.install('${document.location.origin}/_static/simanim-0.3.0-py3-none-any.whl').then(js.pythonInicijalizovan())
	`)
	).then(() => {
		animations = document.getElementsByClassName('simanim')
		for (var i = 0; i < animations.length; i++) {
			simanimList[animations[i].id] = new SimAnim(animations[i])			
		}
	});

});

function pythonInicijalizovan() {
	pythonInitialized = true;
}

function queDrawEvent(event){
	simanimList[event.animation_key].queueDrawEvent(event.type,event.object)
}

function pathJoin(parts, sep){
	var separator = sep || '/';
	var replace   = new RegExp(separator+'{1,}', 'g');
	return parts.join(separator).replace(replace, separator);
 }