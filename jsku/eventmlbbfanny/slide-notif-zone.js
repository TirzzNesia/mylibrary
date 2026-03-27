var slideIndexNotif = 0;
if (document.getElementsByClassName("mySlides").length > 0) showSlidesNotif();
function showSlidesNotif() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");
    for (i = 0; i < slides.length; i++) slides[i].style.display = "none";
    slideIndexNotif++;
    if (slideIndexNotif > slides.length) slideIndexNotif = 1;
    for (i = 0; i < dots.length; i++) dots[i].className = dots[i].className.replace(" actives", "");
    if (slides[slideIndexNotif - 1]) slides[slideIndexNotif - 1].style.display = "block";
    if (dots[slideIndexNotif - 1]) dots[slideIndexNotif - 1].className += " actives";
    setTimeout(showSlidesNotif, 6000);
}
