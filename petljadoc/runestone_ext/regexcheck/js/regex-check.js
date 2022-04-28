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
    this.text = this.data['text'];
    this.solution = this.data['solution'];
    this.hasSolution = this.solution.length != 0;
    this.editableText = this.data['editable'];
    this.regexFlags = this.data['flags'];
    this.regex_area = this.opts.querySelector('.regex-input');
    this.text_area =  this.opts.querySelector('.text-input'); 
    this.customArea =  this.opts.querySelector('.front'); 
    // regex title
    this.opts.querySelectorAll('.title')[0].innerHTML =  $.i18n("regex_title");
    // flags title
     this.opts.querySelectorAll('.title')[1].innerHTML =  $.i18n("flag_title") + '<span class="flag-markers">'+this.regexFlags+'</span>';
    // text flags
    this.opts.querySelectorAll('.title')[2].innerHTML =  $.i18n("text_title");

    
    this.text_area.value = this.text;
    this.customArea.innerHTML =htmlEscape(this.text_area.value);

    if(this.hasSolution){
        this.solButton = this.opts.querySelector('.sol-button');
        this.solButton.innerHTML = $.i18n("button_text"); 
        this.solButton.addEventListener("click", function(){
            var text = this.text_area.value;
            try{
               var re = new RegExp('('+ this.solution+ ')',flag=this.regexFlags);
               this.customArea.innerHTML = htmlEscape(text.replace(re,"<span class='blue'>$1</span>"));
            }
            catch{
            }
        }.bind(this));
    }
    if(!this.editableText){
        this.text_area.setAttribute('disabled', 'true');
    }
    else{   
        this.text_area.addEventListener('input', function(){
            this.customArea.innerHTML = htmlEscape(this.text_area.value);
        }.bind(this));


        this.text_area.addEventListener('keydown', function(e) {
           if (e.key == 'Tab') {
               e.preventDefault();
               var start =  this.text_area.selectionStart;
               var end =  this.text_area.selectionEnd;
   
               this.text_area.value =  this.text_area.value.substring(0, start) + '\t' + this.text_area.value.substring(end);
               this.text_area.selectionStart =  this.text_area.selectionEnd = start + 1;
               this.customArea.innerHTML = htmlEscape(this.text_area.value);
           }
         }.bind(this));
    }

    this.regex_area.addEventListener('input', function(){
        if (this.regex_area.value == ''){
           this.customArea.innerHTML = htmlEscape(this.text_area.value);
           return 
        }
        var text = this.text_area.value;
        try{
           var re = new RegExp('('+ this.regex_area.value+ ')',flag=this.regexFlags);
           this.customArea.innerHTML = htmlEscape(text.replace(re,"<span class='blue'>$1</span>"));
        }
        catch{
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
function htmlEscape(str){
    return str.replaceAll('\n' ,'<br>').replaceAll(' </span>', '&nbsp;</span>');
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
