import "regenerator-runtime";
import animateCSS from "../utils/animateCSS";
import createNotification from "../utils/notification";

function initSingleProduct() {
  const container = document.querySelector("#single-product");

  if (!container) return;

  // Initialize colourus
  const colourus = { nodes: container.querySelectorAll("[data-hex]"), objects: [] };
  colourus.nodes.forEach((item) => {
    const input = item.querySelector("input");
    const image = item.querySelector(".colours-image");

    image.style.background = item.getAttribute("data-hex");

    colourus.objects.push({ container: item, input });
  });

  const updateColoursItems = () => {
    const { objects } = colourus;

    objects.forEach((item) => {
      const { input, container } = item;

      if (input.checked) container.classList.add("active");
      else container.classList.remove("active");
    });
  };

  colourus.objects.forEach((item) => {
    item.input.addEventListener("change", () => {
      updateColoursItems();
    });
  });

  // Initialize quantity
  const quantity = container.querySelector(".quantity");

  if (quantity) {
    const quantityInput = quantity.querySelector("input");
    const quantityAdd = quantity.querySelector(".quantity-add");
    const quantityRemove = quantity.querySelector(".quantity-remove");

    let currentValue = 1;
    const maxCount = quantityInput.getAttribute("data-max");

    // Disable initial behavior
    quantityInput.addEventListener("click", (e) => e.preventDefault());

    const balloons = { add: "Добавить", remove: "Убавить" };

    const updateQuantity = () => {
      quantityInput.value = currentValue;

      if (currentValue < 2) balloons.remove = "Минимальное кол-во 1 шт.";
      else balloons.remove = "Убавить";

      if (currentValue >= maxCount) balloons.add = `Максимальное кол-во ${maxCount} шт.`;
      else balloons.add = `Добавить`;

      quantityAdd.setAttribute("data-balloon", balloons.add);
      quantityRemove.setAttribute("data-balloon", balloons.remove);
    };

    quantityAdd.addEventListener("click", () => {
      quantityRemove.classList.remove("disabled");

      if (currentValue >= maxCount) {
        quantityAdd.classList.add("disabled");
        return updateQuantity();
      }

      ++currentValue;
      return updateQuantity();
    });

    quantityRemove.addEventListener("click", () => {
      quantityAdd.classList.remove("disabled");

      if (currentValue < 2) {
        quantityRemove.classList.add("disabled");
        return updateQuantity();
      }

      --currentValue;
      return updateQuantity();
    });
  }

  // Initialize Slider
  const slider = document.querySelector(".single-product_slider");

  const initializeSlider = () => {
    const thumbGallery = slider.querySelector(".thumbs-gallery");
    const mainGallery = slider.querySelector(".fullsize-gallery");

    // Main Gallery
    const mainGalleryContent = mainGallery.querySelector(".image");
    const mainGalleryContentImage = mainGalleryContent.querySelector("img");

    const adjustMainGalleryHeight = (coefficient) => {
      const adjust = () => {
        const height = mainGallery.clientWidth * coefficient;
        mainGallery.style.height = height + "px";
      };

      adjust();

      window.addEventListener("resize", adjust);
    };
    adjustMainGalleryHeight(1.148698884758364);

    const sliderTransition = (src) =>
      animateCSS(mainGalleryContent, "animate__fadeOutRight").then(() => {
        mainGalleryContentImage.src = src;
        animateCSS(mainGalleryContent, "animate__fadeInLeft");
      });

    // Thumb Gallery
    const thumbGalleryImgs = thumbGallery.querySelectorAll(".image");

    // Thumbs Validation
    if (!thumbGalleryImgs.length) return;

    thumbGalleryImgs.forEach((img) => {
      img.addEventListener("click", () => {
        const imageSrc = img.getAttribute("data-image-src");
        sliderTransition(imageSrc);
      });
    });
  };

  initializeSlider();

  // Initialize to add to fav
  const addToFavBtn = container.querySelector("#add-to-fav");

  if (addToFavBtn) {
    const favData = {
      isProductFavorite: addToFavBtn.getAttribute("data-product-fav") === "true" ? true : false,
      id: addToFavBtn.getAttribute("data-product-id"),
    };

    const toggleLoading = () => {
      addToFavBtn.classList.add("loading");

      return () => addToFavBtn.classList.remove("loading");
    };

    addToFavBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const stopLoading = toggleLoading();
      const is_authorized = await fetch("https://aurum.md/api/session").then((res) => res.json());

      if (!is_authorized) {
        createNotification({
          type: "error",
          title: "Ошибка",
          content: "Вы должны войти в систему!",
          duration: 5000,
        });
        stopLoading();
      } else {
        try {
          const formData = new FormData();
          formData.append("id", favData.id);

          await fetch("https://aurum.md/api/wishlist.add", {
            method: "POST",
            body: formData,
          });

          // Notify user
          if (favData.isProductFavorite) {
            createNotification({
              type: "success",
              title: "Успех!",
              content: "Продукт успешно удален из списка избранных.",
              duration: 4000,
            });
          } else {
            createNotification({
              type: "success",
              title: "Успех!",
              content: "Продукт успешно добавлен в список избранных.",
              duration: 4000,
            });
          }
          favData.isProductFavorite = !favData.isProductFavorite;
          animateCSS(addToFavBtn, "animate__pulse");
          addToFavBtn.setAttribute("data-product-fav", favData.isProductFavorite);
        } catch (error) {
          createNotification({
            type: "error",
            title: "Ошибка",
            content: "Неизвестная ошибка!",
            duration: 3000,
          });
        } finally {
          stopLoading();
        }
      }
    });
  }
}

initSingleProduct();
