$(document).ready(function () {
    $("[data-level]").each(function (index) { 
        var level=$(this).attr('data-level');
        $(this).parent(".section").addClass('rst-level rst-level-'+level);
    });


    if (document.querySelector('.learnmorenote-type .course-content ')) {
        var allNodes = document.querySelectorAll('.learnmorenote-type .course-content ');
        for (var i = 0; i < allNodes.length; i++) {
            
            hideContent(allNodes[i])

            var arrow = document.createElement("span");
            arrow.className = "toggle-arrow closed";
            arrow.setAttribute("role", "button");
            arrow.textContent = "﹀";
            arrow.setAttribute("aria-expanded", "false");
            arrow.setAttribute("tabindex", "0")

            allNodes[i].children[0].appendChild(arrow);
            allNodes[i].children[0].className = "note-title";
            allNodes[i].children[0].setAttribute(
                                "aria-label",
                                "Ова напомена садржи додатне информације. Кликните да прикажете скривени садржај.")
            arrow.addEventListener("click", function (ev) {
                ev.stopPropagation();
                this.parentNode.click();
            });
            
            allNodes[i].children[0].addEventListener("click", function () {
                this.classList.toggle('expanded');
                toggleVisible(this.parentNode);

                var arrow = this.querySelector(".toggle-arrow");
                var content = this.parentNode;

                if (this.classList.contains("expanded")) {
                    arrow.classList.remove("closed");
                    arrow.classList.add("opened");
                    arrow.textContent = "︿";
                    arrow.setAttribute("aria-expanded", "true");
                } else {
                    arrow.classList.remove("opened");
                    arrow.classList.add("closed");
                    arrow.textContent = "﹀";

                    arrow.setAttribute("aria-expanded", "false");
                }
            })

            allNodes[i].children[0].addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    this.click();
                }
            });
        }
    }
});

function toggleVisible(learnDiv) {
    const contentParagraph = learnDiv.querySelectorAll(':scope > *:not(:first-child)');

    contentParagraph.forEach((child) => {
        child.style.display = (child.style.display === 'none' || !child.style.display) ? 'block' : 'none';
    });
}

function hideContent(learnDiv) {
    const contentParagraph = learnDiv.querySelectorAll(':scope > *:not(:first-child)');

    if (contentParagraph.length == 0) {
        var titleParaghraph = document.createElement("p");
        titleParaghraph.className = "note-title";
        titleParaghraph.setAttribute(
        "aria-label",
        "Ова напомена садржи додатне информације. Кликните да прикажете скривени садржај.")
        learnDiv.prepend(titleParaghraph);
    }

    // Toggle vidljivost za svako dete osim prvog
    contentParagraph.forEach((child) => {
        child.style.display = 'none';
    });

}