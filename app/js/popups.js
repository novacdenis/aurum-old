import animateCSS from "./utils/animateCSS";
import toggleOverlay from "./utils/toggleGlobalOverlay";

function intializeDropdowns() {
  const initializator = document.querySelectorAll("[data-dropdown]");

  if (!initializator) return;

  const dropdowns = [];

  const setNodeToIntial = (node, className) => (node.className = className);

  initializator.forEach((item, idx) => {
    const target = item.querySelector("[data-dropdown-target]");
    const content = item.querySelector("[data-dropdown-content]");

    const targetInitialForm = target.className;
    const contentIntialForm = content.className;

    dropdowns.push({
      id: idx,
      target: { node: target, reset: () => setNodeToIntial(target, targetInitialForm) },
      content: { node: content, reset: () => setNodeToIntial(content, contentIntialForm) },
      status: false,
      dirty: false,
    });
  });

  const activate = (dropdown) => {
    const { id, target, content } = dropdown;

    target.node.classList.add("active");
    target.node.classList.add("inactive");

    content.node.classList.add("show", "dropdown-in");

    cleaner(id);
  };

  const deactivate = (dropdown) => {
    const { target, content } = dropdown;

    animateCSS(content.node, "dropdown-out").then(() => {
      target.reset();
      content.reset();
    });

    dropdown.dirty = dropdown.status = false;
  };

  const cleaner = (id) => {
    setTimeout(() => {
      const dropdown = dropdowns.find((item) => item.id === id);

      if (dropdown && dropdown.status && !dropdown.dirty) {
        deactivate(dropdown);
      }
    }, 6000);
  };

  dropdowns.forEach((dropdown) => {
    const { target, content } = dropdown;

    target.node.addEventListener("mouseenter", () => {
      dropdown.status = true;
      activate(dropdown);
    });

    content.node.addEventListener("mouseenter", () => (dropdown.dirty = true));
    content.node.addEventListener("mouseleave", () => deactivate(dropdown));
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
    const closeAllItems = () => {
      items.forEach((_i) => {
        _i.status = false;
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
    items.forEach((_i) => {
      _i.head.addEventListener("click", (e) => {
        e.preventDefault();
        closeAllItems();
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
