import "regenerator-runtime";
import animateCSS from "../utils/animateCSS";
import el from "../utils/elFactory";
import icons from "../utils/icons";
import createNotification from "../utils/notification";

class Cart {
  constructor(container, loadingNotify, emptyNotify) {
    this.$ = container;
    this.loading_notify = loadingNotify;
    this.empty_notify = emptyNotify;

    // Cart Data
    this.fetched_data = {};
    this.meta_subtotal = this.$.querySelector(".meta-subtotal .value");
    this.meta_total = this.$.querySelector(".meta-total .value");

    // Cart actions
    this.refresh_timer = null;
    this.refresh_button = this.$.querySelector(".cart-info_refresh button");
    this.is_cart_empty = false;
    this.finish_button = this.$.querySelector(".cart-info_finish button");

    // Cart items container
    this.items_container = this.$.querySelector(".cart-list_grid");

    this.init();
  }

  async init() {
    await this.getUserCartData();

    this.refresh_button.addEventListener("click", async () => {
      await this.getUserCartData();
      this.refreshCountdown(15);
    });
  }

  async getUserCartData() {
    this.toggleCartLoading(true);

    await fetch("https://aurum.md/api/cart")
      .then((res) => res.json())
      .then((data) => this.setItemsNode(data));

    this.toggleCartLoading(false);
  }

  async removeCartItem({ id, id_size }) {
    this.holdCartActions(true);

    await fetch(`https://aurum.md/api/cart.update?id=${id}&id_size=${id_size}`)
      .then((res) => res.json())
      .then((data) => this.setItemsNode(data));

    this.holdCartActions(false);
  }

  refreshCountdown(delay) {
    const btn_default_text = this.refresh_button.innerText;
    this.refresh_button.classList.add("disabled");

    this.refresh_timer = delay;

    const countdown = setInterval(() => {
      if (this.refresh_timer === 1) {
        this.refresh_button.innerText = btn_default_text;
        this.refresh_button.classList.remove("disabled");
        clearInterval(countdown);
      } else {
        this.refresh_timer -= 1;
        this.refresh_button.innerText = `${btn_default_text} (${this.refresh_timer})`;
      }
    }, 1000);
  }

  setItemsNode(data) {
    // Get Fetched Data
    this.fetched_data = data;

    if (this.fetched_data.items) {
      this.fetched_data.items = this.fetched_data.items.map((item) => {
        return { ...item, nodeEl: this.createItem(item) };
      });
    }
    // Call Update
    this.updateCart();
  }

  updateCart() {
    this.items_container.innerHTML = "";

    this.meta_total.innerText = this.fetched_data?.total + " MDL";
    this.meta_subtotal.innerText = this.fetched_data?.subtotal + " MDL";

    if (!this.fetched_data.items?.length) this.toggleCartEmpty(true);
    else this.toggleCartEmpty(false);

    if (this.fetched_data.items) {
      this.fetched_data.items.forEach((item) => {
        this.items_container.appendChild(item.nodeEl);
      });
    }
  }

  holdCartActions(status = true) {
    if (status) {
      this.refresh_button.classList.add("disabled");
      this.finish_button.classList.add("disabled");

      this.fetched_data.items.forEach((item) => {
        item.nodeEl.classList.add("disabled");
      });
    } else {
      if (!this.refresh_timer || !this.refresh_timer > 1)
        this.refresh_button.classList.remove("disabled");
      if (!this.is_cart_empty) this.finish_button.classList.remove("disabled");

      this.fetched_data.items.forEach((item) => {
        item.nodeEl.classList.remove("disabled");
      });
    }
  }

  toggleCartLoading(status = true) {
    if (status) {
      this.toggleCartEmpty(false);

      this.items_container.appendChild(this.loading_notify);
      this.refresh_button.classList.add("disabled");
      this.finish_button.classList.add("disabled");
    } else {
      if (!this.refresh_timer || !this.refresh_timer > 1)
        this.refresh_button.classList.remove("disabled");
      if (!this.is_cart_empty) this.finish_button.classList.remove("disabled");
      this.items_container.contains(this.loading_notify) &&
        this.items_container.removeChild(this.loading_notify);
    }
  }

  toggleCartEmpty(status = true) {
    if (status) {
      this.is_cart_empty = true;
      this.finish_button.classList.add("disabled");

      this.items_container.classList.add("empty");
      this.items_container.appendChild(this.empty_notify);
    } else {
      this.is_cart_empty = false;
      this.finish_button.classList.remove("disabled");

      this.items_container.classList.remove("empty");
      this.items_container.contains(this.empty_notify) &&
        this.items_container?.removeChild(this.empty_notify);
    }
  }

  createItem(data) {
    const item = el("div", { class: "cart-list_item" });
    const actions = el("div", { class: "item-actions" });
    const image = el(
      "div",
      { class: "item-image" },
      el("img", { src: data.image, alt: data.name }),
      el("span", { class: "item-image_size" }, data?.size || "")
    );
    const meta = el(
      "div",
      { class: "item-mobile_meta" },
      el(
        "div",
        { class: "item-name", "data-mobile-label": "Товар" },
        el("span", { class: "name" }, data.name)
      ),
      el(
        "div",
        { class: "item-price", "data-mobile-label": "Цена" },
        el("span", { class: "price" }, `${data.price} MDL`)
      ),
      el(
        "div",
        { class: "item-count", "data-mobile-label": "Количество" },
        el("span", { class: "count" }, data.count)
      ),
      el(
        "div",
        { class: "item-subtotal", "data-mobile-label": "Подытог" },
        el("span", { class: "subtotal" }, `${data.subtotal} MDL`)
      )
    );

    // Item Action
    const remove_action = el(
      "button",
      {
        class: "item-action btn",
        "data-remove-item": true,
        "data-balloon": "Удалить",
        "data-balloon-pos": "bottom",
        "data-balloon-pos-x": "left",
      },
      el("span", { class: "icon" }, { type: "svg", icon: icons.times })
    );

    const remove_action_m = el(
      "button",
      {
        class: "item-action btn",
        "data-remove-item-m": true,
      },
      el("span", { class: "text" }, "Удалить")
    );

    remove_action.addEventListener(
      "click",
      () => {
        this.removeCartItem({ id: data.id, size: data.id_size }, item);
      },
      { once: true }
    );

    remove_action_m.addEventListener(
      "click",
      () => {
        this.removeCartItem({ id: data.id, size: data.id_size }, item);
      },
      { once: true }
    );

    actions.appendChild(remove_action);
    image.appendChild(remove_action_m);

    item.appendChild(actions);
    item.appendChild(image);
    item.appendChild(meta);

    return item;
  }
}

function initCart() {
  const cartContainer = document.querySelector("#cart");

  const loadingNotify = () => {
    const l_item = el("div", { class: "cart-list_item" });
    const l_actions = el("div", { class: "item-actions" });
    const l_image = el("div", { class: "item-image loading" }, el("span", { class: "image" }));
    const l_meta = el(
      "div",
      { class: "item-mobile_meta loading" },
      el("div", { class: "item-name" }, el("span", { class: "name" }, "Name")),
      el("div", { class: "item-price" }, el("span", { class: "price" }, "Price")),
      el("div", { class: "item-count" }, el("span", { class: "count" }, "Count")),
      el("div", { class: "item-subtotal" }, el("span", { class: "subtotal" }, "Subtotal"))
    );

    l_item.appendChild(l_actions);
    l_item.appendChild(l_image);
    l_item.appendChild(l_meta);

    return l_item;
  };

  const emptyNotify = () => {
    const container = el("div", { class: "empty-notify" });
    const image = el("div", { class: "empty-notify_image" }, { type: "svg", icon: icons.empty });
    const description = el(
      "div",
      { class: "empty-notify_descrp" },
      el("h3", {}, "Ваша корзина пуста...")
    );
    const action = el(
      "button",
      { class: "btn btn-solid" },
      el("a", { href: "/shop/" }, "В магазин")
    );

    container.appendChild(image);
    container.appendChild(description);
    container.appendChild(action);

    return container;
  };

  if (!cartContainer) return;

  new Cart(cartContainer, loadingNotify(), emptyNotify());
}

initCart();

// Checkout section -----
function checkoutPromocode() {
  const container = document.querySelector("#checkout-promocode");

  if (!container) return;

  const input = container.querySelector("#code-type");
  const action = container.querySelector(".action");
  const code_success = container.querySelector(".code-success");
  const regex = new RegExp(/[^a-zA-Z0-9]/g);

  const toggleLoading = () => {
    container.classList.add("loading");

    setTimeout(() => container.classList.remove("active"), 150);

    return () => container.classList.remove("loading");
  };

  const transformInputVal = (val) => {
    return val.replace(regex, "").toUpperCase();
  };

  // Check promocode onblur
  const onValidCode = (data) => {
    const { code, title } = data;
    const content = el("span", {}, "Промокод ", el("strong", {}, code), " успешно активирован!");

    container.classList.add("success");
    code_success.innerHTML = `<strong>${code}</strong> - ${title}. Успешно активировано!`;

    createNotification({
      type: "success",
      title: "Успех",
      content,
      duration: 5000,
    });
  };

  const onInvalidCode = () => {
    animateCSS(container, "holding").then(() => (input.value = ""));

    createNotification({
      type: "error",
      title: "Ошибка",
      content: "Данный код недействителен!",
      duration: 5000,
    });
  };

  const checkPromocodeValidity = async () => {
    if (input.value.length > 2) {
      const stopLoading = toggleLoading();

      try {
        const response = await fetch(`https://aurum.md/api/checkPromocode?code=${input.value}`);
        const data = await response.json();

        if (response.status === 200) onValidCode({ ...data, code: input.value });
        else onInvalidCode();

        stopLoading();
      } catch (error) {
        createNotification({
          type: "error",
          title: "Ошибка",
          content: "Что-то пошло не так!",
          duration: 5000,
        });

        stopLoading();
      }
    }
  };

  input.addEventListener("input", (e) => {
    if (e.target.value.length > 2) container.classList.add("active");
    else container.classList.remove("active");

    input.value = transformInputVal(e.target.value);
  });

  action.addEventListener("click", (e) => {
    e.preventDefault();

    checkPromocodeValidity();
  });
}

checkoutPromocode();
