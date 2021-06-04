window.addEventListener('load',function(){
    resize();
    var nextButtons = document.getElementsByClassName('next-img');
    for(var i=0; i<nextButtons.length;i++){
        nextButtons[i].addEventListener('click',function(e){
            var id = e.target.parentElement.id.split('-nav')[0];
            if(id === ""){
                id = e.target.parentElement.parentElement.id.split('-nav')[0];
            }
            var gallery = document.getElementById(id);
            var imges = gallery.getElementsByTagName('img');
            for(var i=0; i<imges.length;i++){
                if(!imges[i].classList.contains('hidden') && i !== imges.length - 1){
                    imges[i+1].classList.toggle('hidden')
                    imges[i].classList.toggle('hidden')
                    break;
                }
            }
        });
    } 
    var prevButtons = document.getElementsByClassName('prev-img');
    for(var i=0; i<prevButtons.length;i++){
        prevButtons[i].addEventListener('click',function(e){
            var id = e.target.parentElement.id.split('-nav')[0];
            var gallery = document.getElementById(id);
            var imges = gallery.getElementsByTagName('img');
            for(var i=0; i<imges.length;i++){
                if(!imges[i].classList.contains('hidden') && i !== 0){
                    imges[i].classList.toggle('hidden')
                    imges[i-1].classList.toggle('hidden')
                    break;
                }
            }
        });
    }
});


window.addEventListener('resize', resize);

function resize(){
    var gallerys = document.getElementsByClassName('gallery')
    for(var i=0; i<gallerys.length;i++){
        var gallery = gallerys[i].firstElementChild.firstElementChild
        var gallerysWidth = gallery.getBoundingClientRect().width;
        var mainContentWidth = document.getElementById('main-content').getBoundingClientRect().width;
        if(gallerysWidth >  mainContentWidth){
           gallery.style.width = null;
           gallery.style.height = null;
        }
    }
}