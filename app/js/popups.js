import animateCSS from "./utils/animateCSS";

function intializeDropdowns() {
  const dropdowns = [...document.querySelectorAll(".dropdown")].map((item) => ({
    trigger: item.querySelector(".dropdown-trigger"),
    content: item.querySelector(".dropdown-content"),
    wrapper: item,
  }));

  if (!dropdowns || !dropdowns.length) return;

  const deactivate =
    ({ trigger, wrapper, content }) =>
    ({ target }) => {
      if (!wrapper.contains(target) && target !== wrapper) {
        content.classList.remove("active");
        trigger.classList.remove("disabled");

        document.removeEventListener("click", deactivate);
      }
    };

  dropdowns.forEach((item) => {
    const { trigger, content } = item;

    trigger.addEventListener("click", (e) => {
      e.preventDefault();

      trigger.classList.add("disabled");
      content.classList.add("active");

      setTimeout(() => document.addEventListener("click", deactivate(item)));
    });
  });
}

function intializeSidebars() {
  const initializator = document.querySelectorAll("[data-sidebar]");

  if (!initializator) return;

  const overlay = document.querySelector("#overlay");
  const sidebars = [];
  initializator.forEach((sidebar) => {
    const node = document.querySelector(sidebar.getAttribute("data-sidebar"));

    if (!node) return;

    const closeBtns = node.querySelectorAll("[data-sidebar-close]");
    sidebars.push({ trigger: sidebar, node, closeBtns });
  });

  const showSidebar = (node) => {
    const position = node.getAttribute("data-pos");

    overlay.classList.add("active");

    node.classList.add("active");

    if (position === "left") animateCSS(node, "animate__fadeInLeft");
    else animateCSS(node, "animate__fadeInRight");
  };

  const closeSidebar = (node) => {
    const position = node.getAttribute("data-pos");

    overlay.classList.remove("active");

    if (position === "left") {
      node.classList.contains("active") &&
        animateCSS(node, "animate__fadeOutLeft").then(() => node.classList.remove("active"));
    } else {
      node.classList.contains("active") &&
        animateCSS(node, "animate__fadeOutRight").then(() => node.classList.remove("active"));
    }
  };

  sidebars.forEach((sidebar) => {
    const { trigger, node, closeBtns } = sidebar;

    node.classList.add("animate__animated");

    trigger.addEventListener("click", (e) => {
      e.preventDefault();

      showSidebar(node);
      overlay.addEventListener("click", () => closeSidebar(node), { once: true });
    });

    closeBtns.forEach((btn) => {
      btn.addEventListener("click", () => closeSidebar(node));
    });
  });
}

// Accordions
function registerAccordion(selector) {
  const accordion = document.querySelector(selector);

  if (accordion) {
    const items = [];
    const accordionItems = accordion.querySelectorAll(".accordion-item");
    const accordionBodyPadding = accordion.getAttribute("data-padding") || 0;

    // Get items
    accordionItems.forEach((item) => {
      const head = item.querySelector(".head");
      const body = item.querySelector(".content");

      items.push({
        item,
        head,
        body,
        status: false,
      });
    });

    // Close all items
    const closeAllItems = (idx) => {
      items.forEach((_i, _idx) => {
        _idx !== idx && (_i.status = false);
      });
    };

    // Update items in accordion
    const updateItems = () => {
      items.forEach((_i) => {
        if (_i.status) {
          _i.item.classList.add("active");
          _i.body.style.maxHeight = _i.body.scrollHeight + parseInt(accordionBodyPadding) + "px";
          _i.body.style.paddingBottom = parseInt(accordionBodyPadding) + "px";
          _i.status = true;
        } else {
          _i.item.classList.remove("active");
          _i.body.style.maxHeight = 0 + "px";
          _i.body.style.paddingBottom = 0;
          _i.status = false;
        }
      });
    };

    // Register listener
    items.forEach((_i, _idx) => {
      _i.head.addEventListener("click", (e) => {
        e.preventDefault();
        closeAllItems(_idx);
        _i.status = !_i.status;
        updateItems();
      });
    });
  }
}

function initializeModals() {
  const modalsTriggers = document.querySelectorAll("[data-modal-trigger]");

  const openModal = (node) => {
    document.body.classList.add("holdscrolling");
    node.classList.add("active");
  };

  const closeModal = (node) => {
    document.body.classList.remove("holdscrolling");
    node.classList.remove("active");
  };

  modalsTriggers.forEach((tirgger) => {
    const selector = tirgger.getAttribute("data-modal-trigger");
    const node = document.querySelector(selector);

    if (!node) return;

    const overlay = node.querySelector(".modal-overlay");
    const modalCloseEls = node.querySelectorAll("[data-close-modal]");

    modalCloseEls.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal(node);
      });
    });

    overlay.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal(node);
    });

    tirgger.addEventListener("click", (e) => {
      e.preventDefault();

      openModal(node);
    });
  });
}

export { intializeDropdowns, intializeSidebars, registerAccordion, initializeModals };
