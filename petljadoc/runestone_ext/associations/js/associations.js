function WrappingAscorinaion(){
    associationsList = [];

    function Associations(opts){
        if(opts){
        this.init(opts);
        }
    }
    //{"clues":[{"group":"A", "answer" :"Test", "clues" : ["test","test2"]},{"group":"B", "answer":"Test2", "clues" : ["test3","test4"]}], "answer":42}
    Associations.prototype.init =  function(opts){
        this.opts = opts;
        this.game = JSON.parse(popAttribute(opts,"data-game"));
        this.groupList = this.game["clues"];
        this.finalAnswer = this.game["answer"]
        this.finalAnswerRegex = new RegExp(this.finalAnswer);
        this.clueGroupFealdMap = {}
        for(var i=0;i<this.groupList.length;i++){
            this.createAscGroup(this.groupList[i]);
        }
        this.createFinalAnswerDiv();
    }

    Associations.prototype.createAscGroup = function(opts){
        var group_div = document.createElement("div");
        group_div.classList.add("asc-group")
        for(var i=0;i<opts["clues"].length;i++){
            const clue_div = document.createElement("div");
            clue_div.classList.add("asc-clue");
            clue_div.classList.add("asc-clue-hidden");
            var feald = opts["group"] + (i+1);
            this.clueGroupFealdMap[feald] = opts["clues"][i]
            clue_div.setAttribute("data-ord",feald);
            clue_div.innerText = feald;
            clue_div.addEventListener("click",function(clicked){
                clicked.event.target.innerText = this.clueGroupFealdMap[clicked.event.target.getAttribute("data-ord")];
            }.bind(this), {once : true});
            group_div.appendChild(clue_div);
        }
        var input_div = document.createElement("div");
        var input_button_div = document.createElement("div");
        var input = document.createElement("input");
        input.classList.add("asc-input")
        input.id = "group" + opts["group"]
        var input_button = document.createElement("div");
        input_button.classList.add("asc-test-answer")
        input_button.innerText = "Resi Kolonu"
        input_button.setAttribute("data-input-id", "group" + opts["group"])
        input_button.setAttribute("data-answerRe",opts["group-answ"])
        input_button.addEventListener("click",function(clicked){
            userAnswer = document.getElementById(clicked.event.target.getAttribute("data-input-id")).value.trim()
            if(userAnswer.match(opts["answer"])){
                group_div.style.border = "2px solid green"
                clicked.event.target.parentElement.nextElementSibling.innerText = userAnswer;
                clicked.event.target.parentElement.nextElementSibling.style.display = "block";
                clicked.event.target.parentElement.remove()
            }
            else{
                input.style.border = "2px solid red"
            }
        });
        var corect_msg = document.createElement("div");
        corect_msg.classList.add("correct-msg")

        input_button_div.appendChild(input);
        input_button_div.appendChild(input_button);

        input_div.appendChild(input_button_div);
        input_div.appendChild(corect_msg);

        group_div.appendChild(input_div);

        this.opts.appendChild(group_div);
    }

    Associations.prototype.createFinalAnswerDiv = function(){
        var finalAnswerDiv = document.createElement("div");
        finalAnswerDiv.classList.add("odgovor")

        var input = document.createElement("input");
        var inputTestButton = document.createElement("div");
        inputTestButton.classList.add("asc-final-test-answer")
        inputTestButton.innerText = "Test"
        inputTestButton.addEventListener("click",function(){
            userAnswer = input.value.trim()
            if(userAnswer.match(this.finalAnswerRegex)){
                this.opts.style.border = "2px solid green"
                inputTestButton.remove()
                input.remove()
                var correctDiv = document.createElement("div");
                correctDiv.classList.add("correct-msg-final")
                correctDiv.innerText = userAnswer;
                finalAnswerDiv.appendChild(correctDiv)
            }
            else{
                input.style.border = "2px solid red"
            }
        }.bind(this));

        finalAnswerDiv.appendChild(input);
        finalAnswerDiv.appendChild(inputTestButton);

        this.opts.appendChild(finalAnswerDiv);
    }

    function popAttribute(element, atribute, fallback){
        var atr = fallback;
        if (element.hasAttribute(atribute)){
            atr = element.getAttribute(atribute);
            element.removeAttribute(atribute);
        }
        return atr;
    }

    window.addEventListener('load',function() {
        associations = document.getElementsByClassName('asc');
        for (var i = 0; i < associations.length; i++) {
            associationsList[associations[i].id] = new Associations(associations[i]);		
        }
    });
}
WrappingAscorinaion();