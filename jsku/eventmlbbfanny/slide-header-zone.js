var slideIndexHeader = 0;
if (document.getElementsByClassName("sliderHeader").length > 0) showSlidesHeader();
function showSlidesHeader() {
    var i;
    var slidesHeader = document.getElementsByClassName("sliderHeader");
    for (i = 0; i < slidesHeader.length; i++) slidesHeader[i].style.display = "none";
    slideIndexHeader++;
    if (slideIndexHeader > slidesHeader.length) slideIndexHeader = 1;
    if (slidesHeader[slideIndexHeader - 1]) slidesHeader[slideIndexHeader - 1].style.display = "block";
    setTimeout(showSlidesHeader, 3000);
}
