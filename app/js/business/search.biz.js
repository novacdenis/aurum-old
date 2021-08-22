import debounce from "../utils/debounce";
import el from "../utils/elFactory";

function initializeSearch() {
  const form = document.querySelector("#search-form");
  const searchResultContainer = document.querySelector("#search .search-inner_results .list");

  if (!form || !searchResultContainer) return;

  const input = form.querySelector("#search-input");
  const loader = form.querySelector("#search-loader");

  let data = null;

  const searchQuery = debounce(async function () {
    searchResultContainer.innerHTML = "";
    if (input.value && input.value.length > 2) {
      loader.classList.add("active");

      data = await fetchSearchQuery(input.value);

      data.forEach((item) => {
        searchResultContainer.insertAdjacentElement("beforeend", cartResultItem(item));
      });

      loader.classList.remove("active");
    }
  }, 300);

  input.addEventListener("input", searchQuery);
}

initializeSearch();

const cartResultItem = (data) =>
  el(
    "a",
    { href: data.url },
    el(
      "div",
      { class: "product-box", "data-product-id": data.id },
      el("div", { class: "product-box_action" }),
      el(
        "div",
        { class: "product-box_image" },
        el("img", { src: data.image, alt: data.name, "data-product-image": "main" })
      ),
      el(
        "div",
        { class: "product-box_meta" },
        el("h4", { class: "product-box_meta-name" }, data.name),
        el(
          "div",
          { class: "product-box_meta-price" },
          el("span", { class: "price" }, data.price),
          el("span", { class: "currency" }, "MDL")
        )
      )
    )
  );

async function fetchSearchQuery(query) {
  try {
    const res = await fetch(`https://aurum.md/api/search?s=${query}`);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}
