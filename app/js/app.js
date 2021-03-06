import "regenerator-runtime";
import animationForCategories from "./animationForCategories";
import animateCSS from "./utils/animateCSS";
import convertImages from "./utils/convertImages";
import {
  initializeModals,
  intializeSidebars,
  registerAccordion,
  intializeDropdowns,
} from "./popups";
import elFactory from "./utils/elFactory";
import initializeCategoriesMenu from "./categories";
import createNotification from "./utils/notification";

document.addEventListener("DOMContentLoaded", () => {
  // Add animation delay for elements
  const animationDelayRequesters = document.querySelectorAll("[data-animation-delay]");
  animationDelayRequesters.forEach((requester) => {
    const delay = requester.getAttribute("data-animation-delay");
    requester.style.animationDelay = `${delay}s`;
  });

  // Create document overaly
  const overaly = elFactory("div", { id: "overlay" });
  document.body.appendChild(overaly);

  // Adjustet product height
  adjustProductHeight(1.176470588235294);

  // Image converter
  convertImages(".svg-icon");

  // Categories Animation
  if (window.innerWidth > 801) animationForCategories();

  // Products
  productsActionsAndEffects();

  // Textareas
  autoResizeTextarea();

  // Popups
  intializeSidebars();
  initializeModals();
  intializeDropdowns();

  // Accodrions
  registerAccordion("#mobile-nav_sidebar .links");
  registerAccordion("#shop .shop-sorting");
  registerAccordion("#single-product .helping");
  registerAccordion("#faq .faq-container");

  // Init Animation
  animations();

  // Initialize big menu
  if (window.innerWidth >= 1330) initializeCategoriesMenu();
});

function animations() {
  const sectionTitles = document.querySelectorAll(".section-title");
  sectionTitles.forEach((section) => {
    const is_title_centered = section.classList.contains("centered");

    const titles = section.querySelectorAll("h1");
    const subtitle = section.querySelector(".subtitle");

    titles.forEach((title) => {
      title.classList.add("wow", "clip-text", is_title_centered ? "top" : "left");
      title.setAttribute("data-init-class", "reveal");
    });

    if (subtitle) {
      subtitle.classList.add("wow", "animate__fadeIn");
      subtitle.setAttribute("data-wow-delay", "0.3s");
    }
  });

  const wow = new WOW({
    boxClass: "wow",
    animateClass: "animate__animated",
    offset: 0,
    mobile: true,
    live: true,
    callback: function (box) {
      if (box.hasAttribute("data-init-class"))
        box.classList.add(box.getAttribute("data-init-class"));
    },
    scrollContainer: null,
  });
  wow.init();
}

function adjustProductHeight(coefficient) {
  const products = document.querySelectorAll(".products-grid .product-box .product-box_image");

  if (!products.length) return;

  const adjust = () => {
    const height = products[0].offsetWidth * coefficient;

    products.forEach((product) => (product.style.height = height + "px"));
  };

  adjust();

  window.onresize = adjust;
}

function autoResizeTextarea() {
  const inputs = document.querySelectorAll("[data-txt-autoresize]");

  if (!inputs) return;

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.style.height = "auto";
      input.style.height = input.scrollHeight + "px";
    });
  });
}

function productsActionsAndEffects() {
  const $products = document.querySelectorAll(".product-box");
  const productActions = [];

  if (!$products) return;

  $products.forEach((product) => {
    const productID = product.getAttribute("data-product-id");
    const addToFavBtn = product.querySelector("[data-product-fav]");
    const imageBox = product.querySelector(".product-box_image");

    const isProductFavorite =
      addToFavBtn.getAttribute("data-product-fav") === "true" ? true : false;

    productActions.push({
      id: productID,
      product,
      addToFavBtn,
      imageBox,
      isProductFavorite,
    });

    product.removeAttribute("data-product-id");
  });

  const addProductToFavorite = async (product) => {
    const is_authorized = await fetch("https://aurum.md/api/session").then((res) => res.json());

    if (!is_authorized) {
      createNotification({
        type: "error",
        title: "????????????",
        content: "???? ???????????? ?????????? ?? ??????????????!",
        duration: 5000,
      });
    } else {
      try {
        const formData = new FormData();
        formData.append("id", product.id);

        await fetch("https://aurum.md/api/wishlist.add", {
          method: "POST",
          body: formData,
        });

        // Notify user
        if (product.isProductFavorite)
          createNotification({
            type: "success",
            title: "??????????!",
            content: "?????????????? ?????????????? ???????????? ???? ???????????? ??????????????????.",
            duration: 4000,
          });
        else
          createNotification({
            type: "success",
            title: "??????????!",
            content: "?????????????? ?????????????? ???????????????? ?? ???????????? ??????????????????.",
            duration: 4000,
          });

        product.isProductFavorite = !product.isProductFavorite;
        animateCSS(product.addToFavBtn, "animate__pulse");
        product.addToFavBtn.setAttribute("data-product-fav", product.isProductFavorite);
      } catch (error) {
        createNotification({
          type: "error",
          title: "????????????",
          content: "?????????????????????? ????????????!",
          duration: 3000,
        });
      }
    }
  };

  // Add Actions & Effects
  productActions.forEach((item) => {
    const itemHoverImage = item.imageBox.querySelector('[data-product-image="hover"]');

    if (itemHoverImage) {
      item.imageBox.addEventListener("mouseenter", () => {
        item.imageBox.classList.add("hoverable");
      });
      item.imageBox.addEventListener("mouseleave", () => {
        item.imageBox.classList.remove("hoverable");
      });
    }

    item.addToFavBtn.addEventListener("click", (e) => {
      e.preventDefault();
      addProductToFavorite(item);
    });
  });
}
