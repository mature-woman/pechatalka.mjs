"use strict";

/**
 * @name pechatalka.mjs
 *
 * @description
 * Module with merch and print constructor for typrographies
 *
 * @class
 * @public
 *
 * @example
 * import gallery from "https://codepen.io/mirzaev-sexy/pen/GgJbmQz.js";
 *
 *
 * {@link https://git.svoboda.works/mirzaev/pechatalka.mjs}
 * {@link https://codepen.io/mirzaev-sexy/pen/GgJbmQz}
 *
 *
 * @license http://www.wtfpl.net/ Do What The Fuck You Want To Public License
 * @author Arsen Mirzaev Tatyano-Muradovich <arsen@mirzaev.sexy>
 */
export default class pechatalka {
  /**
   * @name Wrap
   *
   * @type {HTMLElement}
   *
   * @protected
   */
  #wrap = document.getElementById("pechatalka");

  /**
   * @name Wrap (get)
   *
   * @return {HTMLElement}
   *
   * @public
   */
  get wrap() {
    return this.#wrap;
  }

  /**
   * @name Canvas
   *
   * @type {HTMLElement}
   *
   * @protected
   */
  #canvas = document.getElementById("pechatalka")?.querySelector(".canvas");

  /**
   * @name Canvas (get)
   *
   * @return {HTMLElement}
   *
   * @public
   */
  get canvas() {
    return this.#canvas;
  }

  /**
   * @name Result
   *
   * @type {HTMLElement}
   *
   * @protected
   */
  #result = document.getElementById("pechatalka")?.querySelector(".result");

  /**
   * @name Result (get)
   *
   * @return {HTMLElement}
   *
   * @public
   */
  get result() {
    return this.#result;
  }

  /**
   * @name Layers
   *
   * @type {Set}
   *
   * @protected
   */
  #layers = new Set();

  /**
   * @name Layers (get)
   *
   * @return {Set}
   *
   * @public
   */
  get layers() {
    return this.#layers;
  }

  /**
   * @name Cost
   *
   * @type {number}
   *
   * @protected
   */
  #cost = 0;

  /**
   * @name Cost (get)
   *
   * @return {number}
   *
   * @public
   */
  get cost() {
    return this.#cost;
  }

  /**
   * @name Prices
   *
   * @description
   * Prices for calculating the total cost
   *
   * @return {object}
   *
   * @public
   */
  prices = {
    pin: {
      image: 150
    }
  };

  /**
   * @name Constructor
   *
   * @description
   * Initialize the instance
   *
   * @param {HTMLElement} wrap The wrap element
   * @param {HTMLElement} canvas The canvas element
   * @param {HTMLElement} result The result element
   * @param {boolean} [inject=false] Write the instance into the wrap element?
   */
  constructor(wrap, canvas, result, inject = false) {
    if (wrap instanceof HTMLElement) {
      // Initialized the wrap element

      // Writing the wrap
      this.#wrap = wrap;

      // Writing the instance into the wrap element
      if (inject) this.#wrap.pechatalka = this;
    }

    if (canvas instanceof HTMLElement) {
      // Initialized the canvas element

      // Writing the canvas
      this.#canvas = canvas;
    }

    if (result instanceof HTMLElement) {
      // Initialized the result element

      // Writing the result
      this.#result = result;
    }
  }

  /**
   * @name Moving
   *
   * @description
   * Add moving for the target
   *
   * @param {HTMLElement} target
   */
  moving(target) {
    // Initializing the link to the canvas
    const canvas = this.#canvas;

    // Initializing the start moving cursor coordinates buffer
    const from = { x: 0, y: 0 };

    /**
     * @name Moving
     */
    function moving(event) {
      // Writing the X coordinate
      target.style.left = event.clientX - from.x + "px";

      // Writing the Y coordinate
      target.style.top = event.clientY - from.y + "px";
    }

    /**
     * @name Restore
     */
    function restore() {
      // Restoring initial coordinates
      target.style.top = target.style.left = null;
    }

    /**
     * @name Start
     */
    function start(event) {
      if (event.button === 0) {
        // Pressed the main mouse button (left by default)

        // Writing the start moving cursor coordinates
        [from.x, from.y] = [
          event.clientX - (parseInt(target.style.left) || 0),
          event.clientY - (parseInt(target.style.top) || 0)
        ];

        // Initializing the event listener
        window.addEventListener("mousemove", moving, true);
      }
    }

    /**
     * @name End
     */
    function end() {
      // Initializing the event listener
      window.removeEventListener("mousemove", moving, true);
    }

    // Initializing event listeners
    target.addEventListener("mousedown", start, false);
    window.addEventListener("mouseup", end, false);
    canvas.addEventListener("mouseleave", end, false);
  }

  /**
   * @name Scaling
   *
   * @description
   * Add resizing for the target
   *
   * 1. Resizing by changing the `scale` parameter disables the buttons visibility
   * outside the cut borders (`overflow: fixed` did not work)
   *
   * 2. Resizing by changing the `width` parameter has problems with boundaries,
   * that is it has movement glitches
   *
   * @param {HTMLElement} target
   * @param {string} [type='scale'] Type of scaling (scale, width)
   */
  scaling(target, type = "scale") {
    /**
     * @name Scroll
     */
    function scroll(event) {
      if (type === "scale") {
        // Scaling by changing scale

        // Initializing new scale
        let scale = (parseFloat(target.style.scale) || 1) + event.deltaY / 1000;

        // Normalization and protection against out of scale boundaries
        if (scale < 0.4) scale = 0.4;
        else if (scale > 3) scale = 3;

        // Writing the scale
        target.style.scale = scale;
      } else if (type === "width") {
        // Scaling by changing width

        // Initializing the zoom changing value
        const change = event.deltaY / 2;

        // Initializing width of the cut space
        const cut = target.parentElement.offsetWidth;

        // Initializing bounds for zooming
        const bounds = {
          minimum: cut / 2 - cut,
          maximum: cut * 2 - cut
        };

        // Initializing new scale
        let zoom =
          (parseFloat(target.style.getPropertyValue("--width-zoom")) || 0) +
          change;

        if (zoom < bounds.minimum) zoom = bounds.minimum;
        else if (zoom > bounds.maximum) zoom = bounds.maximum;
        else {
          // The layer scale was changed

          // Writing the X coordinate
          target.style.left =
            (parseInt(target.style.left) || 0) - change / 2 + "px";

          // Writing the Y coordinate
          target.style.top =
            (parseInt(target.style.top) || 0) - change / 2 + "px";
        }

        // Writing the scale
        target.style.setProperty("--width-zoom", zoom + "px");
      }
    }

    // Initializing the even listeners
    target.addEventListener("wheel", scroll, false);
  }

  /**
   * @name Image
   *
   * @description
   * Add the image into the canvas
   *
   * @param {File} file The file from input FileList
   */
  image(file) {
    // Initializing identifier
    const identifier = this.#layers.entries.length ?? 1;

    // Creating the layer <div> element
    const layer = document.createElement("div");
    layer.classList.add("layer");
    layer.setAttribute("id", "pechatalka_layer_" + identifier);

    // Creating the button <button> element
    const button_delete = document.createElement("button");
    button_delete.classList.add("delete", "rounded");
    button_delete.addEventListener("click", (event) => {
      // Deleting the wrap
      layer.remove();

      // Removing from the total cost
      this.#cost -= this.prices.pin.image ?? 0;

      // Writing the total cost into the document
      this.#result.querySelector(".cost").innerText = this.#cost;
    });

    // Creating the trash icon <i> element
    const trash = document.createElement("i");
    trash.classList.add("icon", "trash");

    // Creating the image <img> element
    const image = document.createElement("img");
    image.classList.add("rounded");
    image.setAttribute("draggable", false);
    image.setAttribute("src", URL.createObjectURL(file));

    // Writing into the gallery
    layer.appendChild(image);
    button_delete.appendChild(trash);
    layer.appendChild(button_delete);
    this.#canvas.appendChild(layer);

    // Adding to the total cost
    this.#cost += this.prices.pin.image ?? 0;

    // Writing the total cost into the document
    this.#result.querySelector(".cost").innerText = this.#cost;

    // Adding moving for the layer
    this.moving(layer);

    // Adding scaling for the layer
    this.scaling(layer);
  }
}
