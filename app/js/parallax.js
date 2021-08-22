function smoothScrolling() {
  const body = document.body;

  const scrollWrap = document.querySelector("[data-smooth-scroll]");

  if (!scrollWrap) return;

  const height = scrollWrap.getBoundingClientRect().height - 18;
  const speed = 0.085;

  let offset = 0;

  body.style.height = Math.floor(height) + "px";
  console.log("dine");

  const smoothScroll = () => {
    offset += (window.pageYOffset - offset) * speed;

    let scroll = `translateY(-${offset}px) translateZ(0)`;

    scrollWrap.style.transform = scroll;

    const callSroll = requestAnimationFrame(smoothScroll);
  };

  smoothScroll();
}

window.onload = function () {
  smoothScrolling();
};
