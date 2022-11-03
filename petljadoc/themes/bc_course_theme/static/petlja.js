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

function changeFontSizeWrapper(zoomFactor) {
    var mainDiv = document.getElementById("main-content");
    changeFontSize(mainDiv, zoomFactor);
}

function setupPage(contentSettings){
    changeFontSizeWrapper(contentSettings.contentZoomFactor)
}

function hideFinishButton(isFinished = true){
    if(isFinished)
        document.getElementById("finish-activity").style.display = "none";
}

window.addEventListener("load", function () {
    if(!PetljaRT)
        return;
    PetljaRT.registerContent();
    PetljaRT.addFontSizeHandler(changeFontSizeWrapper);
    PetljaRT.addContentSettingHandler(setupPage);
    PetljaRT.addActivityStatusHandler(hideFinishButton);
    const finishButton = document.getElementById("finish-activity");
    if(finishButton)
        finishButton.addEventListener("click", () => {
            PetljaRT.registerActivityProgress(); 
            hideFinishButton();
        });
});