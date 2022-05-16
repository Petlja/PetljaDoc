function WrappingNimGame(){

    var nimGameList = [];

    function NIMgame(opts){
        if(opts){
         this.init(opts);
        }
    }

    NIMgame.prototype.init =  function(opts){
        this.opts = opts;   
        this.canvas = opts.querySelector('canvas')
        this.canvasContext = this.canvas.getContext('2d');
        this.circles = [];
        this.msgDiv = opts.querySelector('.msg-banner');
        this.maxTakeAway = 2;
        this.numOfCircles = 20;
        this.circleRadius = 30;
        this.removedCircleIndex = 0;
        this.playersTurn = "player-1";
        this.canvasContext.canvas.width = Math.min(document.documentElement.clientWidth,780);
        this.canvasContext.canvas.height = 400;
        this.takeButton = this.opts.querySelector('[data-id]');
        this.slider = this.opts.querySelector('.slider.round');
        this.playerTwo = this.opts.querySelector('.player-two');
        this.sliderInput = this.opts.querySelector('input');
        this.takeButton.addEventListener("click", function(){
            this.displayMsg('');
            var buttonId = this.takeButton.getAttribute('data-id');
            if(buttonId !== this.playersTurn){
                return
            }
            var value = this.opts.querySelector(`[data-input-id=${buttonId}]`).value;
            if(value> this.maxTakeAway){
                this.displayMsg('Ne toliko');
                return
            }
            for(var i=0;i<value;i++){
                if(this.removedCircleIndex + 1 > this.circles.length)
                    break;
                this.circles[this.removedCircleIndex].display = false;
                this.removedCircleIndex++;
            }
            this.clearCanvas();
            this.drawAllElements();
        }.bind(this));
        this.slider.addEventListener('click',function(){
            this.circles = this.circles.map(circle => {circle.display = true;return circle});
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
        this.initNIM();
        this.drawAllElements();
    }

    NIMgame.prototype.clearCanvas = function(){
        this.canvasContext.clearRect(0,0,this.canvasContext.canvas.width,this.canvasContext.canvas.height);
    }

    NIMgame.prototype.drawAllElements = function(){
        for(var i=0;i<this.numOfCircles;i++){
            if(this.circles[i].display)
                draw(this.canvasContext,this.circles[i].x,this.circles[i].y);
        }
    }

    NIMgame.prototype.initNIM = function(){
        this.circles.push({"x":this.canvasContext.canvas.width*0.5,"y":this.canvasContext.canvas.height*0.5,"display":true});
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
                    this.circles.push({"x":x,"y":y,"display":true});
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

    function draw(canvasContext,x,y){
        canvasContext.beginPath();
        canvasContext.arc(x,y, 30, 0, 2 * Math.PI);
        canvasContext.closePath();
        canvasContext.stroke();
    }
};
WrappingNimGame();

