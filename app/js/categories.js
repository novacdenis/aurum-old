import animateCSS from "./utils/animateCSS";

const imagesData = [
  [
    "/images/menu/cat-1-l-1.jpg",
    "/images/menu/cat-1-l-2.jpg",
    "/images/menu/cat-1-l-3.jpg",
    "/images/menu/cat-1-r-1.jpg",
    "/images/menu/cat-1-r-2.jpg",
    "/images/menu/cat-1-r-3.jpg",
  ],
  [
    "/images/menu/cat-2-l-1.jpg",
    "/images/menu/cat-2-l-2.jpg",
    "/images/menu/cat-2-l-3.jpg",
    "/images/menu/cat-2-r-1.jpg",
    "/images/menu/cat-2-r-2.jpg",
    "/images/menu/cat-2-r-3.jpg",
  ],
  [
    "/images/menu/cat-3-l-1.jpg",
    "/images/menu/cat-3-l-2.jpg",
    "/images/menu/cat-3-l-3.jpg",
    "/images/menu/cat-3-r-1.jpg",
    "/images/menu/cat-3-r-2.jpg",
    "/images/menu/cat-3-r-3.jpg",
  ],
  [
    "/images/menu/cat-4-l-1.jpg",
    "/images/menu/cat-4-l-2.jpg",
    "/images/menu/cat-4-l-3.jpg",
    "/images/menu/cat-4-r-1.jpg",
    "/images/menu/cat-4-r-2.jpg",
    "/images/menu/cat-4-r-3.jpg",
  ],
  [
    "/images/menu/cat-5-l-1.jpg",
    "/images/menu/cat-5-l-2.jpg",
    "/images/menu/cat-5-l-3.jpg",
    "/images/menu/cat-5-r-1.jpg",
    "/images/menu/cat-5-r-2.jpg",
    "/images/menu/cat-5-r-3.jpg",
  ],
];

function initializeCategoriesMenu() {
  const container = document.querySelector("#desktop-category-menu");

  if (!container) return;

  const closeBtn = container.querySelector(".categories__close");
  const activateMenu = document.querySelector("[data-sidebar-c]");

  let active_index = 0;

  const menu_items = [...container.querySelectorAll(".menu__item")].map((item, idx) => {
    if (item.classList.contains("active")) {
      active_index = idx;
      return { node: item, status: true, idx };
    }

    return { node: item, status: false, idx };
  });

  const default_images = container.querySelectorAll(".menu__item-active_image");
  default_images.forEach((img) => img.classList.add("animate__animated"));

  const disableAllMenuItems = () => {
    menu_items.forEach((item) => {
      if (item.status === true) {
        item.node.classList.remove("active");
      }
    });
  };

  const holdMenuItemsActions = () => {
    menu_items.forEach((itm) => {
      itm.node.classList.add("holding");
    });

    return () =>
      setTimeout(() => {
        menu_items.forEach((itm) => {
          itm.node.classList.remove("holding");
        });
      }, 500);
  };

  const changeImageDataSource = () => {
    default_images.forEach((item, idx) => {
      const img = item.querySelector("img");
      img.src = imagesData[active_index][idx];
    });
  };

  const animateImagesUp = () => {
    const holding = holdMenuItemsActions();

    default_images.forEach((img) => {
      animateCSS(img, "animate__fadeOutUp")
        .then(() => {
          changeImageDataSource();
          animateCSS(img, "animate__fadeInUp");
        })
        .then(holding);
    });
  };

  const animateImagesDown = () => {
    const holding = holdMenuItemsActions();

    default_images.forEach((img) => {
      animateCSS(img, "animate__fadeOutDown")
        .then(() => {
          changeImageDataSource();
          animateCSS(img, "animate__fadeInDown");
        })
        .then(holding);
    });
  };

  const animateImagesOnOpen = () => {
    const holding = holdMenuItemsActions();

    default_images.forEach((img, idx) => {
      setTimeout(() => {
        animateCSS(img, "animate__fadeInRight").then(() => {
          img.classList.remove("init");
          holding();
        });
      }, idx * 100 + 200);
    });
  };

  const setInitiToImages = () => {
    default_images.forEach((img) => img.classList.add("init"));
  };

  const activateMenuItem = (item) => {
    const { idx } = item;

    if (active_index === idx) return;

    if (idx > active_index) animateImagesUp();

    if (idx < active_index) animateImagesDown();

    return (active_index = idx);
  };

  menu_items.forEach((item) => {
    const title = item.node.querySelector(".menu__item-title");
    const explore = item.node.querySelector(".menu__item-cta");

    const url = item.node.href;

    title.addEventListener("click", (e) => {
      e.preventDefault();
      disableAllMenuItems();

      activateMenuItem(item);

      item.node.classList.add("active");
      item.status = true;
    });

    explore.addEventListener("click", (e) => {
      e.preventDefault();

      window.location.replace(url);
    });
  });

  // On toggle menu
  closeBtn.addEventListener("click", () => {
    animateCSS(container, "cat-menu-out").then(() => {
      container.classList.remove("active");
      setInitiToImages();
    });
  });
  activateMenu.addEventListener("click", () => {
    container.classList.add("active");
    animateImagesOnOpen();
    animateCSS(container, "cat-menu-in");
  });
}

export default initializeCategoriesMenu;
