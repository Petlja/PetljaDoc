function WrappingAscorinaion(){
    var edtiorList = [];

    function Editor(opts){
        if(opts){
        this.init(opts);
        }
    }

    Editor.prototype.init =  function(opts){
        this.opts = opts;
        this.data = JSON.parse(popAttribute(opts,"data"));
    }

    Editor.prototype.funkcija = function(group){
        
        // nesto
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
        var edtior = document.getElementsByClassName('petlja-editor');
        for (var i = 0; i < edtior.length; i++) {
            edtiorList[edtior[i].id] = new Editor(edtior[i]);		
        }
    });
}
WrappingAscorinaion();