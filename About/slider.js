let slideIndex = 1;
const slides = document.getElementsByClassName("mySlides");
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function showSlides(n) {
  if (slides.length < 1) return
  if (n > slides.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = slides.length; }
  Array.from(slides).forEach(slide => slide.style.display = "none");
  slides[slideIndex - 1].style.display = "block";
}