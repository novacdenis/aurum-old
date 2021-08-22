function circularAnimation() {
  const adjustCircles = () => {
    const svgs = document.querySelectorAll(".progress-ring");

    svgs.forEach((svg) => {
      const circle = svg.querySelector(".progress-ring__circle");
      circle.setAttribute("r", 92);
      circle.setAttribute("cx", 222);
      circle.setAttribute("cy", 95);
      svg.setAttribute("width", 190);
      svg.setAttribute("height", 190);
    });
  };

  if (window.innerWidth < 801) adjustCircles();

  const circles = document.querySelectorAll(".big-rounded-btn_wrapper circle");

  const setMutationObserver = (node, onChange) => {
    const config = {
      attributes: true,
    };

    const callback = function () {
      onChange();
    };

    const observer = new MutationObserver(callback);

    observer.observe(node, config);
  };

  circles.forEach((circle) => {
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;

    const offset = circumference;
    circle.style.strokeDashoffset = offset;

    setTimeout(() => {
      circle.classList.add("animate");

      if (!circle.classList.contains("wow")) circle.style.strokeDashoffset = 0;
      else setMutationObserver(circle, () => (circle.style.strokeDashoffset = 0));
    }, 100);
  });
}

circularAnimation();
