function WrappingNimGame(){

    const _PLAYER_ONE = "player-1";
    const _PLAYER_TWO = "player-2";
    const playerTunrSwitcher = {
        "player-1" : _PLAYER_TWO,
        "player-2" : _PLAYER_ONE
    }
    const _MULTY_PLAYER = "multy-player";
    const _SINGLE_PLAYER = "single-player";
    const gameModeSwitcher = {
        "single-player" : _MULTY_PLAYER,
        "multy-player" : _SINGLE_PLAYER
    }

    var nimGameList = [];

    function NIMgame(opts){
        if(opts){
         this.init(opts);
        }
    }
    
    NIMgame.prototype.init =  function(opts){
        this.opts = opts;   
        this.canvas = opts.querySelector('canvas');
        this.canvasContext = this.canvas.getContext('2d');
        this.circles = [];
        this.msgDiv = opts.querySelector('.msg-banner');
        this.maxTakeAway = 3;
        this.numOfCircles = 13;
        this.circleRadius = 30;
        this.removedCircleIndex = 0;
        this.playersTurn = _PLAYER_ONE;
        this.canvasContext.canvas.width = Math.min(document.documentElement.clientWidth,780);
        this.canvasContext.canvas.height = 400;
        this.takeButtonPlayerOne = this.opts.querySelector('[data-id=player-1]');
        this.takeButtonPlayerTwo = this.opts.querySelector('[data-id=player-2]');
        this.slider = this.opts.querySelector('.slider.round');
        this.playerTwo = this.opts.querySelector('.player-two');
        this.sliderInput = this.opts.querySelector('input');
        this.gameVersion = _SINGLE_PLAYER;
        this.restartGameButton = this.opts.querySelector('[data-restart]');
        this.thinking = false;
        this.start;
        [this.takeButtonPlayerOne, this.takeButtonPlayerTwo].forEach(function(button){
            button.addEventListener("click", function(){
                this.displayMsg('');
                var buttonId = button.getAttribute('data-id');
                if(buttonId !== this.playersTurn || this.thinking){
                    return
                }
                var value = this.opts.querySelector(`[data-input-id=${buttonId}]`).value;
                if(value> this.maxTakeAway && value<0){
                    this.displayMsg('Ne toliko');
                    return
                }
                for(var i=0;i<value;i++){
                    if(this.removedCircleIndex + 1 > this.circles.length)
                        break;
                    this.circles[this.removedCircleIndex].color = "red";
                    this.removedCircleIndex++;
                }
                if(this.gameVersion === _MULTY_PLAYER){
                    this.playersTurn = playerTunrSwitcher[this.playersTurn];
                }
                this.clearCanvas();
                this.drawAllElements();
                if(this.removedCircleIndex + 1 > this.circles.length){
                    this.displayMsg(`Pobedio je igrac ${this.playersTurn[this.playersTurn.length-1]}`);
                    return
                }
                if(this.gameVersion === _SINGLE_PLAYER){
                    this.thinking = true;
                    setTimeout(() => { 
                    var numberOfCircles = this.circles.reduce(function(n, circle) {
                        return n + (circle.color == "blue");
                    }, 0)
                    var subract;
                    var currentState = numberOfCircles % (this.maxTakeAway + 1);
                    if(currentState === 0){
                        subract = randomIntFromInterval(1,this.maxTakeAway);
                    }
                    else{
                        subract =currentState;
                    }
                    for(var i=0;i<subract;i++){
                        if(this.removedCircleIndex + 1 > this.circles.length)
                            break;
                        this.circles[this.removedCircleIndex].color = "orange";
                        this.removedCircleIndex++;
                    } 
                    if(this.removedCircleIndex + 1 > this.circles.length){
                        this.displayMsg("Algoritam je pobedio");
                    }
                    this.clearCanvas();
                    this.drawAllElements();
                    this.thinking = false;
                },350);
                }

            }.bind(this));
        }.bind(this)); 
        this.slider.addEventListener('click',function(){
            this.displayMsg('');
            this.circles = this.circles.map(circle => {circle.color = "blue";return circle});
            this.playersTurn = _PLAYER_ONE;
            this.gameVersion = gameModeSwitcher[this.gameVersion];
            this.removedCircleIndex = 0;    
            this.clearCanvas();
            this.drawAllElements();
            if(this.sliderInput.checked){
                this.playerTwo.style.display = "block";
            }
            else{
                this.playerTwo.style.display = "none";
            }
        }.bind(this))
        this.restartGameButton.addEventListener("click",function(){
            this.displayMsg('');
            this.circles = this.circles.map(circle => {circle.color = "blue";return circle});
            this.playersTurn = _PLAYER_ONE;
            this.removedCircleIndex = 0;    
            this.clearCanvas();
            this.drawAllElements();
        }.bind(this));
        this.initNIM();
        this.drawAllElements();
    }


    NIMgame.prototype.clearCanvas = function(){
        this.canvasContext.clearRect(0,0,this.canvasContext.canvas.width,this.canvasContext.canvas.height);
    }

    NIMgame.prototype.drawAllElements = function(){
        for(var i=0;i<this.numOfCircles;i++){
                draw(this.canvasContext,this.circles[i].x,this.circles[i].y,this.circles[i].color);
       }
    }


    NIMgame.prototype.initNIM = function(){
        this.circles.push({"x":this.canvasContext.canvas.width*0.5,"y":this.canvasContext.canvas.height*0.5,"color":"blue"});
        for(var i=1;i<this.numOfCircles;i++){     
            // make sure new circle doesn't overlap any existing circles
            while(true){
                var x=Math.random()*this.canvasContext.canvas.width;
                var y=Math.random()*this.canvasContext.canvas.height;
                var hit=0;
                for(var j=0;j<this.circles.length;j++){
                    var circle=this.circles[j];
                    var dx=x-circle.x;
                    var dy=y-circle.y;
                    var rr=this.circleRadius*2;
                    if((dx*dx+dy*dy<rr*rr) ||
                    (x+this.circleRadius>this.canvasContext.canvas.width) || 
                    (y+this.circleRadius>this.canvasContext.canvas.height) || 
                    (x-this.circleRadius< 0) ||
                    (y-this.circleRadius<0)){
                         hit++; 
                         break;
                    }
                }
                // new circle doesn't overlap any other, so break
                if(hit==0){
                    this.circles.push({"x":x,"y":y,"color":"blue"});
                    break;
                }
            }
           
        }       
    }

    NIMgame.prototype.displayMsg = function(msg){
        this.msgDiv.innerText = msg;
    }

    window.addEventListener("load", function(){
        nimGames = document.getElementsByClassName('nim-game');
        for (var i = 0; i < nimGames.length; i++) {
            nimGameList[nimGames[i].id] = new NIMgame(nimGames[i]);		
        }
    });

    function draw(canvasContext,x,y,color){
        canvasContext.fillStyle = color
        canvasContext.beginPath();
        canvasContext.arc(x,y, 30, 0, 2 * Math.PI);
        canvasContext.fill();
        canvasContext.closePath();
        canvasContext.stroke();
    }
    function randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
      }
};
WrappingNimGame();

