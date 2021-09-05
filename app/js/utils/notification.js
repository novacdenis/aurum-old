import animateCSS from "./animateCSS";
import el from "./elFactory";

/**
 *
 * @param {string} config.type The type of notification
 */
function createNotification(config) {
  const { type, title, content, duration } = config;

  let notifcation_config = {};

  if (type === "success")
    notifcation_config = {
      icon: "/images/icons/checked.svg",
      animationIn: "animate__fadeInRight",
      animationOut: "animate__fadeOutUp",
      duration: "basic",
    };
  else if (type === "error")
    notifcation_config = {
      icon: "/images/icons/cancel.svg",
      animationIn: "animate__bounceInRight",
      animationOut: "animate__fadeOutUp",
      duration: "slower",
    };
  else if (type === "warn")
    notifcation_config = {
      icon: "/images/icons/warn.svg",
      animationIn: "animate__fadeInRight",
      animationOut: "animate__fadeOutUp",
      duration: "basic",
    };

  if (window.innerWidth < 651) {
    notifcation_config.animationIn = "animate__fadeInUp";
    notifcation_config.animationOut = "animate__fadeOutLeft";
    notifcation_config.duration = "basic";
  }

  const notification = el(
    "div",
    { class: `notifcation-container animate__animated ${notifcation_config.duration}` },
    el(
      "div",
      { class: "notification__inner" },
      el("div", { class: "notification__inner-icon" }, el("img", { src: notifcation_config.icon })),
      el("div", { class: "notification__inner-title" }, title),
      el("div", { class: "notification__inner-content" }, content)
    )
  );

  // Animations
  const animateNotifyIn = () => animateCSS(notification, notifcation_config.animationIn);
  const animateNotifyOut = () => {
    notification.classList.remove(notifcation_config.duration);
    animateCSS(notification, notifcation_config.animationOut).then(() => notification.remove());
  };

  // Event for notification
  notification.addEventListener("click", animateNotifyOut);

  // Check for notofy position
  const notify_pos = [...document.querySelectorAll(".notifcation-container")]
    .map((itm) => itm.scrollHeight)
    .reduce((acc, cur) => acc + cur + 20, 20);

  // Integrate notify in DOM
  if (window.innerWidth > 650) notification.style.top = notify_pos + "px";
  else notification.style.bottom = notify_pos - 10 + "px";

  document.body.appendChild(notification);

  // Add animation to notifcation & remove
  animateNotifyIn();

  setTimeout(() => {
    animateNotifyOut();
  }, duration || 3000);
}

export default createNotification;
