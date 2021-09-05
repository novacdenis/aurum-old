function circularAnimation() {
  const circles = document.querySelectorAll(".big-rounded-btn_wrapper circle");

  circles.forEach((circle) => circle.classList.add("animate"));
}

circularAnimation();
