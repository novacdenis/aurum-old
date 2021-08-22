const animateCSS = (element, animation, hide = false) =>
  new Promise((resolve, reject) => {
    const animationName = animation;
    const node = element;

    node.classList.add(animationName);

    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(animationName);
      
      if(hide) {
        node.style.display = "none";
      }

      resolve("Animation ended");
    }

    node.addEventListener("animationend", handleAnimationEnd, { once: true });
  });

export default animateCSS;
