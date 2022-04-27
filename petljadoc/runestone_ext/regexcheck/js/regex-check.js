function WrappingRegexCheck(){ 
var regexCheckList = [];

function RegexCheck(opts){
    if(opts){
    this.init(opts);
    }
}

RegexCheck.prototype.init =  function(opts){
    this.opts = opts;
    this.data =  JSON.parse(popAttribute(opts,'data-regex'));
    //{'solution' : '\d{4}', 'text' : 'asd asd', 'editable' : 'True', 'flags' : 'gsi'}
    this.text = this.data['text'];
    this.solution = this.data['solution'];
    this.hasSolution = this.solution.length != 0;
    this.editableText = this.data['editable'];
    this.regexFlags = this.data['flags'];
    this.regex_area = this.opts.querySelector('#regex_input');
    this.text_area =  this.opts.querySelector('#text_input'); 
    this.customArea =  this.opts.querySelector('#front'); 
    
    this.text_area.value = this.text;
    this.customArea.innerHTML = this.text_area.value.replaceAll('\n' ,'<br>').replaceAll('\t', '&emsp;').replaceAll(' </span>', '&nbsp;</span>');


    this.text_area.addEventListener('input', function(){
        this.customArea.innerHTML = this.text_area.value.replaceAll('\n' ,'<br>').replaceAll('\t', '&emsp;').replaceAll(' </span>', '&nbsp;</span>');
    }.bind(this));

    this.regex_area.addEventListener('input', function(){
         if (this.regex_area.value == ''){
            this.customArea.innerHTML = this.text_area.value.replaceAll('\n' ,'<br>').replaceAll('\t', '&emsp;').replaceAll(' </span>', '&nbsp;</span>');
            return 
         }
         var text = this.text_area.value;
         try{
            var re = new RegExp('('+ this.regex_area.value+ ')',flag=this.regexFlags);
            this.customArea.innerHTML = text.replace(re,"<span class='blue'>$1</span>").replaceAll('\n' ,'<br>').replaceAll('\t', '&emsp;').replaceAll(' </span>', '&nbsp;</span>');
         }
         catch{
         }
     }.bind(this));

     this.text_area.addEventListener('keydown', function(e) {
        if (e.key == 'Tab') {
            e.preventDefault();
            var start = this.selectionStart;
            var end = this.selectionEnd;

            this.value = this.value.substring(0, start) + '\t' + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 1;
            this.customArea.innerHTML = this.text_area.value.replaceAll('\n' ,'<br>').replaceAll('\t', '&emsp;').replaceAll(' </span>', '&nbsp;</span>');
        }
      }.bind(this));
}

function popAttribute(element, atribute, fallback = ''){
    var atr = fallback;
    if (element.hasAttribute(atribute)){
        atr = element.getAttribute(atribute);
        element.removeAttribute(atribute);
    }
    return atr;
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + this.length);
}

window.addEventListener('load',function() {
    regexCheckers = document.getElementsByClassName('regex-check');
    for (var i = 0; i < regexCheckers.length; i++) {
        regexCheckList[regexCheckers[i].id] = new RegexCheck(regexCheckers[i]);		
    }
});

};
WrappingRegexCheck();
