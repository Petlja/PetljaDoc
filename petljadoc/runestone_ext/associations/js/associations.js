var ascClues = document.getElementsByClassName("asc-clue")
var answerRe = new RegExp("^(O|o)dgovor$");
var clues = {"A1" : "asocijacija 1",
             "A2" : "asocijacija 2",
             "A3" : "asocijacija 3",
             "A4" : "asocijacija 4"
            }
for(var i = 0 ; i<ascClues.length; i++){
    ascClues[i].addEventListener("click",function(){
        this.innerText = clues[this.getAttribute("data-ord")];
    }, {once : true});
}

var answers = document.getElementsByClassName("asc-test-answer")

for(var i = 0 ; i<answers.length; i++){
    answers[i].addEventListener("click",function(){
        userAnswer = document.getElementById("asc-input").value.trim()
        if(userAnswer.match(answerRe)){
            document.getElementById("123").style.border = "2px solid green"
            this.parentElement.nextElementSibling.innerText = userAnswer;
            this.parentElement.nextElementSibling.style.display = "block";
            this.parentElement.remove()
        }
        else{
            document.getElementById("asc-input").style.border = "2px solid red"
        }
    });
}

