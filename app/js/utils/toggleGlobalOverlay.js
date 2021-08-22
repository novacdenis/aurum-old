import animateCSS from "./animateCSS";

const toggleOverlay = (callback, status = true) =>
  new Promise((resolve, reject) => {
    const overaly = document.querySelector("#overlay");

    try {
      if (overaly && status) {
        overaly.classList.add("overlay-in");
      } else if (!status) {
        animateCSS(overaly, "overlay-out").then(() => (overaly.className = ""));
      }

      if (callback) {
        overaly.addEventListener(
          "click",
          () => {
            callback();
            animateCSS(overaly, "overlay-out").then(() => (overaly.className = ""));
          },
          { once: true }
        );
      }

      return resolve();
    } catch (error) {
      return reject(error);
    }
  });

export default toggleOverlay;
