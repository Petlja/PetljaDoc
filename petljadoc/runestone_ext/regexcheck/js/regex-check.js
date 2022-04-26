window.addEventListener("load",function(){
    regex_area = document.getElementById("regex_input");
    text_area = document.getElementById("text_input");
    customArea = document.getElementById("front");
    text_area.addEventListener("input", function(){
        text_area = document.getElementById("text_input");
        customArea.innerHTML = text_area.value.replaceAll('\n' ,'<br>').replaceAll('\t', '&emsp;').replaceAll(" </span>", "&nbsp;</span>");
    });
    regex_area.addEventListener("input", function(){
         if (regex_area.value == ""){
            customArea.innerHTML = text_area.value.replaceAll('\n' ,'<br>').replaceAll('\t', '&emsp;').replaceAll(" </span>", "&nbsp;</span>");
            return 
         }
         var text = text_area.value
         var re = new RegExp("("+ regex_area.value+ ")",flag="g");
         text_area = document.getElementById("text_input");
         customArea.innerHTML = text.replace(re,"<span class='blue'>$1</span>").replaceAll('\n' ,'<br>').replaceAll('\t', '&emsp;').replaceAll(" </span>", "&nbsp;</span>");
     });

     text_area.addEventListener('keydown', function(e) {
        if (e.key == 'Tab') {
          e.preventDefault();
          var start = this.selectionStart;
          var end = this.selectionEnd;
      
          // set textarea value to: text before caret + tab + text after caret
          this.value = this.value.substring(0, start) +
            "\t" + this.value.substring(end);
      
          // put caret at right position again
          this.selectionStart =
            this.selectionEnd = start + 1;

        text_area = document.getElementById("text_input");
        customArea.innerHTML = text_area.value.replaceAll('\n' ,'<br>').replaceAll('\t', '&emsp;').replaceAll(" </span>", "&nbsp;</span>");
        }

      });
 });


 String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + this.length);
}

function WrappingRegexCheck(){ 
var regexCheckList = [];

function RegexCheck(opts){
    if(opts){
    this.init(opts);
    }
}

RegexCheck.prototype.init =  function(opts){
    this.opts = opts;
}

window.addEventListener('load',function() {
    regexCheckers = document.getElementsByClassName('regex-check');
    for (var i = 0; i < regexCheckers.length; i++) {
        regexCheckList[regexCheckers[i].id] = new RegexCheck(regexCheckers[i]);		
    }
});

};
WrappingRegexCheck();
