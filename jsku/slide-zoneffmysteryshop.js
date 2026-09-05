// slide-zoneffmysteryshop.js
var slideIndex = 0;
showSlides();
function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1; }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  if (slides.length > 0) {
    slides[slideIndex - 1].style.display = "block";
  }
  if (dots.length > 0) {
    dots[slideIndex - 1].className += " active";
  }
  setTimeout(showSlides, 2500);
}

var slideIndexSlider = 0;
showSlidesSlider();
function showSlidesSlider() {
  var i;
  var slides = document.getElementsByClassName("slider");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndexSlider++;
  if (slideIndexSlider > slides.length) { slideIndexSlider = 1; }
  if (slides.length > 0) {
    slides[slideIndexSlider - 1].style.display = "block";
  }
  setTimeout(showSlidesSlider, 2400);
}

var slideIndexHeader = 0;
showSlidesHeader();
function showSlidesHeader() {
  var i;
  var slidesHeader = document.getElementsByClassName("sliderHeader");
  for (i = 0; i < slidesHeader.length; i++) {
    slidesHeader[i].style.display = "none";
  }
  slideIndexHeader++;
  if (slideIndexHeader > slidesHeader.length) { slideIndexHeader = 1; }
  if (slidesHeader.length > 0) {
    slidesHeader[slideIndexHeader - 1].style.display = "block";
  }
  setTimeout(showSlidesHeader, 2500);
}
