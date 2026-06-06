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
 * import pechatalka from "https://git.svoboda.works/mirzaev/pechatalka.mjs/raw/branch/stable/pechatalka.mjs";
 *
 * // Initializing the instance
 * const instance = new pechatalka(
 *  document.getElementById("pechatalka"),
 *  document.getElementById("pechatalka")?.querySelector(".canvas"),
 *  document.getElementById("pechatalka")?.querySelector(".result"),
 *  true
 * );
 *
 * {@link https://git.svoboda.works/mirzaev/pechatalka.mjs}
 * {@link https://codepen.io/mirzaev-sexy/pen/GgJbmQz}
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
	 * @name Preset
	 *
	 * @description
	 * Registry of parameters that will be write into created layers
	 *
	 * @type {Map}
	 *
	 * @protected
	 */
	#preset = new Map();

	/**
	 * @name Preset (get)
	 *
	 * @description
	 * Registry of parameters that will be write into created layers
	 *
	 * @return {Map}
	 *
	 * @public
	 */
	get preset() {
		return this.#preset;
	}

	/**
	 * @name Cost
	 *
	 * @description
	 * The total cost
	 *
	 * @type {number}
	 *
	 * @protected
	 */
	#cost = 0;

	/**
	 * @name Cost (set)
	 *
	 * @description
	 * The total cost
	 *
	 * @return {number}
	 *
	 * @public
	 */
	set cost(value) {
		if (typeof value === "number") {
			// Validated the value

			// Initializing the deprecated cost
			const from = this.#cost;

			// Writing the value
			this.#cost = value;

			// Filtering by the minimal value
			if (this.#cost < 0) this.#cost = 0;

			// Processing the `cost changed` event function
			this.#events.get("cost")?.get("changed")(this.#cost, from);
		}
	}

	/**
	 * @name Cost (get)
	 *
	 * @description
	 * The total cost
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
			image: 150,
		},
	};

	/**
	 * @name Events
	 *
	 * @type {Map}
	 *
	 * @protected
	 */
	#events = new Map([
		["layers", new Map([["create", (layer) => {}]])],
		["cost", new Map([["changed", (to, from) => {}]])],
	]);

	/**
	 * @name Events (get)
	 *
	 * @type {Map}
	 *
	 * @public
	 */
	get events() {
		return this.#events;
	}

	/**
	 * @name Control
	 *
	 * The CONTROL button press status
	 *
	 * @type {boolean}
	 *
	 * @protected
	 */
	#control = false;


	/**
	 * @name Constructor
	 *
	 * @description
	 * Initialize the instance of Pechatalka
	 *
	 * @param {HTMLElement} wrap The wrap element
	 * @param {HTMLElement} canvas The canvas element
	 * @param {HTMLElement} result The result element
	 * @param {(Map|null)} [preset=null] Preset parameters for layers
	 * @param {boolean} [inject=false] Write the instance into the wrap element?
	 */
	constructor(wrap, canvas, result, preset, inject = false) {
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

		if (preset instanceof Map) {
			// Received the preset registry

			// Writing the preset registry
			this.#preset = preset;
		}
	}

	keyboard() {
		// 
		let start = 1000;

		//
		const decrease = 2;

		// Initializing timeouts identifiers for detecting holding buttons
		let control;

		const control_pressed = function () {
			this.#control = true;

			clearTimeout(control);
			control = setTimeout(control_pressed, start);
			start = start / decrease;
    }.bind(this);

		window.addEventListener('keydown', function(event) {
			if (event.keyCode === 17) {
				// Control

			  //
				control_pressed();
			}
		}.bind(this));

		//
		window.addEventListener('keyup', function(event) {
			if (event.keyCode === 17) {
				// Control
			 
				//
				clearTimeout(control);

				//
				this.#control = false;
			}
		}.bind(this));
	}

	dragdrop() {
		//
		document.addEventListener('dragover', (event) =>	event.preventDefault());
		document.addEventListener('drop', (event) =>	event.preventDefault());

		//
		this.#canvas.addEventListener("dragover", function() {
			// Adding the drag class
			this.#canvas.classList.add("drag");
		}.bind(this));

		//
		this.#canvas.addEventListener("dragleave", function() {
			// Removing the drag class
			this.#canvas.classList.remove("drag");
		}.bind(this));

		this.#canvas.addEventListener("drop", function() {
			// Removing the drag class
			this.#canvas.classList.remove("drag");

			// Initializing transfered files
			const files = event.dataTransfer?.files;

			if (files.length > 0) {
				// Initialized transfered files

				[...files].forEach((file) => {
					console.log(file);
					if (file?.type.startsWith("image/")) {
						// Image

						// Writing the image
						this.image(file);
					} 
				});
			}
		}.bind(this));
	}

	/**
	 * @name Global
	 *
	 * @description
	 * Write the parameter into all layers
	 *
	 * @param {string} name Name of the parameter
	 * @param {(Object|string|number|boolean|null)} [value=null] Value of the parameter
	 * @param {boolean} [preset=false] Reinitialize the parameter in the preset registry?
	 */
	global(name, value = null, preset = false) {
		if (typeof name === "string") {
			// Received required arguments

			for (const layer of this.#layers) {
				// Iterating over layers

				// Reinitializing the layer parameter
				layer.set(name, value);
			}

			if (preset) {
				// Requested to reinitialize the parameter in the preset registry

				// Writing the parameter into the preset registry
				this.#preset.set(name, value);
			}
		}
	}

	/**
	 * @name Moving
	 *
	 * @description
	 * Add moving for the layer
	 *
	 * @param {layer} layer
	 */
	moving(layer) {
		// Declaring the difference between the canvas and the layer
		let difference;

		// Initializing the start moving cursor coordinates buffer
		const from = { x: 0, y: 0 };

		/**
		 * @name Moving
		 */
		function moving(event) {
			// Writing the X coordinate
			layer.wrap.style.left = event.clientX - from.x  + "px";

			// Writing the Y coordinate
			layer.wrap.style.top = event.clientY - from.y + "px";
		}

		/**
		 * @name Restore
		 */
		function restore() {
			// Restoring initial coordinates
			layer.wrap.style.top = layer.wrap.style.left = null;
		}

		/**
		 * @name Start
		 */
		function start(event) {
			 // Calculating the difference between the canvas and the layer
			 difference ??= { 
				 width: this.#canvas.offsetWidth - layer.wrap.offsetWidth, 
				 height: this.#canvas.offsetHeight - layer.wrap.offsetHeight
			 };

			if (event.button === 0) {
				// Pressed the main mouse button (left by default)

				// Writing the start moving cursor coordinates
				[from.x, from.y] = [
					event.clientX - (parseInt(layer.wrap.style.left) || (difference.width > 0 ? difference.width / 2 : 0)),
					event.clientY - (parseInt(layer.wrap.style.top) || (difference.height > 0 ? difference.height / 2 : 0)),
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
		layer.wrap.addEventListener("mousedown", start.bind(this), false);
		window.addEventListener("mouseup", end, false);
		// this.#canvas.addEventListener("mouseleave", end, false);
	}

	/**
	 * @name Scaling
	 *
	 * @description
	 * Add resizing for the layer
	 *
	 * 1. Resizing by changing the `scale` parameter disables the buttons visibility
	 * outside the cut borders (`overflow: fixed` did not work)
	 *
	 * 2. Resizing by changing the `width` parameter has problems with boundaries,
	 * that is it has movement glitches
	 *
	 * @param {layer} layer
	 * @param {string} [type='scale'] Type of scaling (scale, width)
	 */
	scaling(layer, type = "scale") {
		// Initializing the link to the instance
		const instance = this;

		/**
		 * @name Scroll
		 */
		function scroll(event) {
			if (type === "scale") {
				// Scaling by changing scale

				if ([...instance.#layers].find(layer => layer.wrap === event.target.parentElement)) {
					// Cursor above the layer

					//
					event.preventDefault();
				}

				// Declaring the new scale
				let scale;

				if (instance.#control) {
					// Pressed the "control" button

					// Initializing the new scale
					scale = (parseFloat(layer.wrap.style.scale) || 1) +
						event.deltaY / 5000;
				} else {
					// Not pressed the "control" button

					// Initializing the new scale
					scale = (parseFloat(layer.wrap.style.scale) || 1) +
						event.deltaY / 1200;
				}

				// Normalization and protection against out of scale boundaries
				if (scale < 0.3) scale = 0.3;
				else if (scale > 6) scale = 6;

				// Writing the scale
				layer.wrap.style.scale = scale;
			} else if (type === "width") {
				// Scaling by changing width

				// Initializing the zoom changing value
				const change = event.deltaY / 1.5;

				// Initializing width of the cut space
				const cut = target.parentElement.offsetWidth;

				// Initializing bounds for zooming
				const bounds = {
					minimum: cut / 1 - cut,
					maximum: cut * 1 - cut,
				};

				// Initializing new scale
				let zoom =
					(parseFloat(layer.wrap.style.getPropertyValue("--width-zoom")) ||
						0) +
					change;

				if (zoom < bounds.minimum) zoom = bounds.minimum;
				else if (zoom > bounds.maximum) zoom = bounds.maximum;
				else {
					// The layer scale was changed

					// Writing the X coordinate
					layer.wrap.style.left = (parseInt(layer.wrap.style.left) || 0) -
						change / 2 +
						"px";

					// Writing the Y coordinate
					layer.wrap.style.top = (parseInt(layer.wrap.style.top) || 0) -
						change / 2 +
						"px";
				}

				// Writing the scale
				layer.wrap.style.setProperty("--width-zoom", zoom + "px");
			}
		}

		// Initializing the even listeners
		layer.wrap.addEventListener("wheel", scroll, false);
	}

	/**
	 * @name Image
	 *
	 * @description
	 * Generate and write the image into the canvas
	 *
	 * @param {File} file The file from input FileList
	 * @param {number} [cost=0] The layer cost
	 */
	image(file, cost = 0) {
		// Initializing identifier
		const identifier = this.#layers.size + 0;

		// Creating the layer wrap <div> element
		const wrap = document.createElement("div");
		wrap.classList.add("layer");
		wrap.setAttribute("id", "pechatalka_layer_" + identifier);

		// Creating the button <button> element
		const button_delete = document.createElement("button");
		button_delete.classList.add("delete");

		// Creating the trash icon <i> element
		const trash = document.createElement("i");
		trash.classList.add("icon", "trash");

		//icon CLOSE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! and ROUND

		// Creating the image <img> element
		const image = document.createElement("img");
		image.setAttribute("draggable", false);
		image.setAttribute("ondragstart", 'return false;');
		image.setAttribute("src", URL.createObjectURL(file));

		// Writing into the gallery
		wrap.appendChild(image);
		button_delete.appendChild(trash);
		wrap.appendChild(button_delete);
		this.#canvas.appendChild(wrap);

		setTimeout(() => {
			// Calculating the difference between the canvas and the layer wrap
		  const difference = { 
			  width: this.#canvas.offsetWidth - wrap.offsetWidth, 
			  height: this.#canvas.offsetHeight - wrap.offsetHeight
		  };
		
			// Writing the difference CSS variable into the layer
			wrap.style.setProperty('left', (difference.width > 0 ? difference.width / 2 : 0) + 'px');
			wrap.style.setProperty('top', (difference.height > 0 ? difference.height / 2 : 0) + 'px');
		}, 60);

		// Initializing the layer instance
		const instance = new layer(
			"image",
			cost,
			wrap,
			image,
			{
				delete: button_delete,
			},
			this.#preset,
		);

		// Writing into the layers registry
		this.#layers.add(instance);

		// Processing the `layer create` event function
		this.#events.get("layers")?.get("create")(instance);

		// Adding to the total cost
		this.cost += instance.cost;

		// Adding moving for the layer
		this.moving(instance);

		// Adding scaling for the layer
		this.scaling(instance);

		// Initializing the event listener function
		button_delete.addEventListener("click", (event) => {
			// Deleting the layer root element
			instance.wrap.remove();

			// Deleting from the layer registry
			this.#layers.delete(instance);

			// Substraction from the total cost
			this.cost -= instance.cost;
		});
	}
}

export class layer {
	/**
	 * @name Type
	 *
	 * @description
	 * The layr type
	 *
	 * @type {string}
	 *
	 * @protected
	 */
	#type;

	/**
	 * @name Type (set)
	 *
	 * @description
	 * The layr type
	 *
	 * @public
	 */
	set type(value) {
		// Initializing types of layers
		const types = new Set(["image", "film"]);

		// Writing the value
		if (types.has(value)) this.#type = value;
	}

	/**
	 * @name Type (get)
	 *
	 * @description
	 * The layr type
	 *
	 * @return {string}
	 *
	 * @public
	 */
	get type() {
		// Exit (success)
		return this.#type;
	}

	/**
	 * @name Cost
	 *
	 * @description
	 * The layr cost
	 *
	 * @type {number}
	 *
	 * @protected
	 */
	#cost = 0;

	/**
	 * @name Cost (set)
	 *
	 * @description
	 * The layer cost
	 *
	 * @return {number}
	 *
	 * @public
	 */
	set cost(value) {
		if (typeof value === "number") {
			// Validated the value

			// Initializing the deprecated cost
			const from = this.#cost;

			// Writing the value
			this.#cost = value;

			// Filtering by the minimal value
			if (this.#cost < 0) this.#cost = 0;

			// Processing the `cost changed` event function
			this.#events.get("cost")?.get("changed")(from, this.#cost);
		}
	}

	/**
	 * @name Cost (get)
	 *
	 * @description
	 * The layer cost
	 *
	 * @return {number}
	 *
	 * @public
	 */
	get cost() {
		return this.#cost;
	}

	/**
	 * @name Wrap
	 *
	 * @description
	 * The layer root element
	 *
	 * @type {HTMLElement}
	 *
	 * @protected
	 */
	#wrap;

	/**
	 * @name Wrap (get)
	 *
	 * @description
	 * The layer root element
	 *
	 * @return {HTMLElement}
	 *
	 * @public
	 */
	get wrap() {
		return this.#wrap;
	}

	/**
	 * @name Content
	 *
	 * @description
	 * The layer target content element
	 *
	 * @type {HTMLElement}
	 *
	 * @protected
	 */
	#content;

	/**
	 * @name Content (get)
	 *
	 * @description
	 * The layer target content element
	 *
	 * @return {HTMLElement}
	 *
	 * @public
	 */
	get content() {
		return this.#content;
	}

	/**
	 * @name Buttons
	 *
	 * @description
	 * The layer buttons elements registry
	 *
	 * @type {Map}
	 *
	 * @protected
	 */
	#buttons = new Map();

	/**
	 * @name Buttons (get)
	 *
	 * @description
	 * The layer buttons elements registry
	 *
	 * @type {Map}
	 *
	 * @public
	 */
	get buttons() {
		return this.#buttons;
	}

	/**
	 * @name Events
	 *
	 * @type {Map}
	 *
	 * @protected
	 */
	#events = new Map([
		["cost", new Map([["changed", (to, from) => {}]])],
	]);

	/**
	 * @name Events (get)
	 *
	 * @type {Map}
	 *
	 * @public
	 */
	get events() {
		return this.#events;
	}

	/**
	 * @name Constructor
	 *
	 * @description
	 * Initialize the instance of the layer
	 *
	 * @param {string} type The layer type
	 * @param {number} cost The layer cost
	 * @param {HTMLElement} wrap The layer root element
	 * @param {HTMLElement} content The layer target content element
	 * @param {object} buttons The layer buttons elements
	 * @param {Map} preset Preset parameters
	 * @param {boolean} [inject=false] Write the instance into the element?
	 */
	constructor(type, cost, wrap, content, buttons, preset, inject = false) {
		// Writing the layer type
		this.type = type;

		if (typeof this.#type === "string") {
			// Initialized the layer type

			// Writing the layer cost
			this.cost = cost;

			if (wrap instanceof HTMLElement) {
				// Received the layer root element

				// Writing the layer root element
				this.#wrap = wrap;

				// Writing the instance into the layer root element
				if (inject) this.#wrap.layer = this;
			}

			if (content instanceof HTMLElement) {
				// Received the layer target content element

				// Writing the layer target content element
				this.#content = content;
			}

			if (buttons instanceof Object) {
				// Received the layer buttons elements

				for (const [name, element] of Object.entries(buttons)) {
					// Iterating over the layers buttons elements

					// Writing into the layer buttons registry
					this.#buttons.set(name, element);
				}
			}

			for (const [name, value] of preset.entries()) {
				// Iterating over preset parameters

				// Writing the parameter
				this[name] = value;
			}
		}
	}

	/**
	 * @name Set
	 *
	 * @description
	 * Set the parameter value
	 *
	 * @param {string} name Name of the parameter
	 * @param {(Object|string|number|boolean|null)} value Value of the parameter
	 *
	 * @return {boolean} The new parameter value
	 */
	set(name, value) {
		// Initializing the old parameter value
		const from = this[name];

		// Writing the value
		this[name] = value;

		// Processing the parameter `set` event function
		this.#events.get(name)?.get("set")(this[name], from);

		// Exit (success)
		return this[name];
	}

	/**
	 * @name Toggle
	 *
	 * @description
	 * Toggle the parameter valu
	 *
	 * @param {string} name Name of the parameter
	 *
	 * @return {boolean} The new parameter value
	 */
	toggle(name) {
		// Writing the value
		this[name] = !this[name] ?? true;

		// Processing the parameter `toggle` event function
		this.#events.get(name)?.get("toggle")(this[name]);

		// Exit (success)
		return this[name];
	}
}
