var c_API;

QUIZ_MARGIN = 0.6
LECTURE_TYPE_READING = 'reading'
LECTURE_TYPE_QUIZ = 'quiz'

document.addEventListener("DOMContentLoaded", function () {
    if(!PetljaRT)
        return;
    c_API = new ContentPage(PetljaRT);
});

function ContentPage(PetljaRT){
    this.pageQuestionCollection = {};
    this.correctAnswersCount = 0;
    this.isActivityDone = false;
    this.PetljaRT = PetljaRT;
    this.mainDiv = document.getElementById("main-content");
    this.finishButton = document.getElementById("finish-activity");

    this.PetljaRT.registerContent();
    this.PetljaRT.addContentSettingHandler((contentSettings) => {this.setupPage(contentSettings)});
    this.PetljaRT.addFontSizeHandler((zoomFactor) => {this.changeFontSizeWrapper(zoomFactor)});
    this.PetljaRT.addActivityStatusHandler(() => {this.setProgressStatus()});

    this.finishButton.addEventListener("click", () => {
        if(this.isActivityDone)
            return
        var progress = this.getProgress();
        if(!progress.progressStatus){
            alert('Морате урадити све задатке у лекцији');
            return
        }
        this.isActivityDone = true;
        this.setProgressStatus();
        this.PetljaRT.registerActivityProgress(progress);
        
    });
}


ContentPage.prototype.changeFontSizeWrapper = function(zoomFactor){
    changeFontSize(this.mainDiv, zoomFactor);
}

ContentPage.prototype.setupPage = function(contentSettings){
    this.changeFontSizeWrapper(contentSettings.contentZoomFactor);
}

ContentPage.prototype.setProgressStatus = function(){
    this.finishButton.classList.replace("unfinished-activity", "finished-activity");
}

ContentPage.prototype.registerQuestions = function(id){
    this.pageQuestionCollection[id] = false;
}

ContentPage.prototype.registerQuestionsAnswer = function(id, isCorrect, answer){
    this.pageQuestionCollection[id] = isCorrect;
}

ContentPage.prototype.getProgress = function(){
    this.correctAnswersCount = 0;
    var pageQuestionStatuses = Object.values(this.pageQuestionCollection);
    for(var i = 0; i< pageQuestionStatuses.length; i++){
        if(pageQuestionStatuses[i]) 
            this.correctAnswersCount+=1
    }
    if (lectureType == LECTURE_TYPE_READING)
        return {
            'progressStatus' : this.correctAnswersCount == pageQuestionStatuses.length,
            'score' : this.correctAnswersCount,
            'maxScore' :  pageQuestionStatuses.length}
    if (lectureType == LECTURE_TYPE_QUIZ)
        return {
            'progressStatus' : this.correctAnswers > (pageQuestionStatuses.length * QUIZ_MARGIN),
            'score' : this.correctAnswersCount,
            'maxScore' : pageQuestionStatuses.length}
    return {
        'progressStatus' :true,
        'score' : 1,
        'maxScore' : 1
    }
}

function changeFontSize(node, zoomFactor) {
    node.childNodes.forEach(child => {
        if(child.nodeType != Node.TEXT_NODE){
            changeFontSize(child, zoomFactor);
            var currentFontSize = parseFloat(window.getComputedStyle(child, null).getPropertyValue("font-size"));
            if (!isNaN(currentFontSize)) {
                child.style.fontSize = (currentFontSize + zoomFactor).toString() + "px";
            }
        }
    });
};