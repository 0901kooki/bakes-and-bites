// =====================================================================
// bakes & bites homepage: main.js
// This file does three small jobs:
//   1. Builds the rows of cookies that drift behind the hero.
//   2. Pauses them when nobody can see them (saves battery).
//   3. Keeps the year in the footer current.
// The rest of the page works fine without JavaScript.
// =====================================================================


// The whole file is wrapped in (function () { ... })();
// This is called an IIFE: a function that runs immediately.
// It keeps our variables (like "hero") private, so they can't clash with
// variables from any other script on the page.
(function () {

  // ---------------------------------------------------------------
  // 1. BUILD THE COOKIE ROWS
  // ---------------------------------------------------------------

  // An array (list) of image paths. Order matters: it's the order the
  // cookies appear in each row.
  // "const" = a variable that won't be reassigned.
  const flavours = [
    "images/chocchip.webp",
    "images/matcha.webp",
    "images/biscoff.webp",
    "images/pistachio.webp",
    "images/redvelvet.webp",
  ];

  // document.querySelector finds the FIRST element matching a CSS selector.
  // [data-cookie-rows] matches the attribute we put on the empty div in the HTML.
  const rowsEl = document.querySelector("[data-cookie-rows]");
  const hero = document.querySelector(".hero");

  // If the element isn't on the page, querySelector returns null.
  // Checking first means the script won't crash on a page without a hero.
  if (rowsEl) {

    // One number per row: how many seconds that row takes to drift one loop.
    // Different speeds mean the rows never move in step.
    // Four numbers = four rows.
    const speeds = [46, 52, 40, 58];

    // forEach runs the function once per item in the array.
    // speed = the current number, r = its position (0, 1, 2, 3).
    speeds.forEach((speed, r) => {

      // Create a new <div class="cookie-row"> in memory (not on the page yet).
      const row = document.createElement("div");
      row.className = "cookie-row";

      // Set a CSS variable on this one row. The CSS reads it in
      // "animation: drift-left var(--speed, 46s) ..."
      row.style.setProperty("--speed", speed + "s");

      // Add 15 cookies: the 5 flavours, three times over.
      // The CSS slides each row by exactly one third, which is one full set
      // of 5. That's what makes the loop seamless.
      for (let i = 0; i < flavours.length * 3; i++) {

        // % is "remainder after dividing". (r * 2 + i) % 5 always gives
        // 0 to 4, so it cycles through the 5 flavours forever.
        // Adding r * 2 makes each row start on a different flavour.
        const src = flavours[(r * 2 + i) % flavours.length];

        // Build: <div class="well"><img src="..." alt=""></div>
        const well = document.createElement("div");
        well.className = "well";

        const img = document.createElement("img");
        img.src = src;
        img.alt = "";             // decorative, so empty alt
        img.decoding = "async";   // decode the image without blocking the page

        well.appendChild(img);    // put the img inside the well
        row.appendChild(well);    // put the well inside the row
      }

      // Finally, put the finished row on the page.
      rowsEl.appendChild(row);
    });
  }


  // ---------------------------------------------------------------
  // 2. PAUSE THE ROWS WHEN NOBODY CAN SEE THEM
  // ---------------------------------------------------------------
  if (hero) {

    // "let" = a variable we WILL change later.
    // document.hidden is true when the user is on a different tab.
    let tabHidden = document.hidden;
    let offScreen = false;

    // An arrow function, stored in a variable so we can call it from two places.
    // classList.toggle(name, condition) adds the class when the condition is
    // true and removes it when false. The CSS rule
    // ".hero.is-paused .cookie-row" then pauses the animation.
    const update = () => hero.classList.toggle("is-paused", tabHidden || offScreen);
    // || means "or": pause if the tab is hidden OR the hero is off screen.

    // addEventListener runs a function whenever something happens.
    // "visibilitychange" fires when the user switches tabs or minimises.
    document.addEventListener("visibilitychange", () => {
      tabHidden = document.hidden;
      update();
    });

    // IntersectionObserver watches an element and tells us when it enters
    // or leaves the screen. Much cheaper than checking on every scroll.
    // The "if" checks the browser supports it (all modern ones do).
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        // entry.isIntersecting is true while any part of the hero is visible.
        // ! flips true to false and back.
        offScreen = !entry.isIntersecting;
        update();
      }).observe(hero);
    }
  }


  // ---------------------------------------------------------------
  // 3. KEEP THE FOOTER YEAR CURRENT
  // ---------------------------------------------------------------
  const year = document.querySelector("[data-year]");

  // new Date() is right now. getFullYear() gives just the year, like 2026.
  // textContent replaces the text inside the element.
  if (year) year.textContent = new Date().getFullYear();

})();
