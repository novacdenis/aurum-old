function customCursors() {
  // Get and init sections
  const customCursorsSections = [].slice
    .call(document.querySelectorAll("[data-custom-cursor]"))
    .map((section) => {
      const cursor = section.querySelector(".custom-cursor");

      return { node: section, cursor };
    });

  customCursorsSections.forEach((section) => {
    const { node, cursor } = section;

    const topTrigger = node.offsetTop;
    const bottomTrigger = topTrigger + node.scrollHeight;
    const cursorDefaultClassName = cursor.className;

    cursor.classList.add("inactive");

    node.addEventListener("mousemove", (e) => {
      if (e.pageY > topTrigger) cursor.className = cursorDefaultClassName + " active";
      if (e.pageY < topTrigger + 50) cursor.className = cursorDefaultClassName + " inactive";
      if (e.pageY > bottomTrigger - 50) cursor.className = cursorDefaultClassName + " inactive";

      cursor.style.top = e.pageY + "px";
      cursor.style.left = e.pageX + "px";
    });
  });
}

export default customCursors;
