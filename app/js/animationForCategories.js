function animationForCategories(defaultActive = 1, step = 486) {
  const $links = document.querySelectorAll("#categories .categories-link");

  const $topImagesWrapper = document.querySelector('#categories .selected-category_images[data-pos="top"]');
  const $bottomImagesWrapper = document.querySelector(
    '#categories .selected-category_images[data-pos="bottom"]'
  );

  if (!$links || !$topImagesWrapper || !$bottomImagesWrapper) return;

  const $topImagesScroller = $topImagesWrapper.querySelector(".selected-category_scroll-container");
  const $bottomImagesScroller = $bottomImagesWrapper.querySelector(".selected-category_scroll-container");

  const $topImages = $topImagesWrapper.querySelectorAll(".selected-category_item");
  const $bottomImages = $bottomImagesWrapper.querySelectorAll(".selected-category_item");

  const topImagesGrid = [];
  $topImages.forEach((_, idx) => {
    topImagesGrid.push(idx * step);
  });

  const bottomImagesGrid = [];
  $bottomImages.forEach((_, idx) => {
    bottomImagesGrid.push(idx * step);
  });

  if (defaultActive) {
    $topImagesScroller.style.top = `-${topImagesGrid[defaultActive]}px`;
    $bottomImagesScroller.style.top = `-${bottomImagesGrid[defaultActive]}px`;
    $links[defaultActive].classList.add("active");
  }

  const disableAllLink = () => $links.forEach(link => link.classList.remove("active"));

  $links.forEach((link, idx) => {
    link.addEventListener("mouseenter", () => {
      disableAllLink();
      link.classList.add("active");
      $topImagesScroller.style.top = `-${topImagesGrid[idx]}px`;
      $bottomImagesScroller.style.top = `-${bottomImagesGrid[idx]}px`;
    });
  });
}

export default animationForCategories;
