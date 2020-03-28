function vanillaSelectBox(domSelector, options) {
    this.domSelector = domSelector;
    this.root = document.querySelector(domSelector)
    this.main;
    this.button;
    this.title;
    this.isMultiple = this.root.hasAttribute("multiple");
    this.multipleSize = this.isMultiple && this.root.hasAttribute("size") ? parseInt(this.root.getAttribute("size")) : -1;
    this.drop;
    this.top;
    this.left;
    this.options;
    this.listElements;
    this.isDisabled = false;
    this.inputBox = null;
    this.ulminWidth = 140;
    this.ulminHeight = 25;
    this.userOptions = {
        maxWidth: 500,
        maxHeight: 400,
        placeHolder: "선택하세요."
    }
    if (options) {
        if (options.maxWidth != undefined) {
            this.userOptions.maxWidth = options.maxWidth;
        }
        if (options.maxHeight != undefined) {
            this.userOptions.maxHeight = options.maxHeight;
        }
        if (options.placeHolder != undefined) {
            this.userOptions.placeHolder = options.placeHolder;
        }
    }
    this.init();
}

    vanillaSelectBox.prototype.init = function () {
		let self = this;
        this.root.style.display = "none";
        let already = document.getElementById("btn-group-" + self.domSelector);
        if (already) {
            already.remove();
        }
        this.main = document.createElement("div");
        this.root.parentNode.insertBefore(this.main, this.root.nextSibling);
        this.main.classList.add("vsb-main");
        this.main.setAttribute("id", "btn-group-" + this.domSelector);
        this.main.style.marginLeft = this.main.style.marginLeft;

		let btnTag = "button";
        this.button = document.createElement(btnTag);
        this.button.id = "regionButton";
		
        this.main.appendChild(this.button);
        this.title = document.createElement("span");
        this.button.appendChild(this.title);
        this.title.classList.add("title");
	
        let rect = this.button.getBoundingClientRect();
        this.top = rect.bottom;
        this.left = rect.left;;
        this.drop = document.createElement("div");
        this.main.appendChild(this.drop);
        this.drop.classList.add("vsb-menu");
        let ul = document.createElement("ul");
        this.drop.appendChild(ul);

        ul.style.maxHeight = this.userOptions.maxHeight + "px";
        ul.style.minWidth = this.ulminWidth + "px";
        ul.style.minHeight = this.ulminHeight + "px";
        if (this.isMultiple) {
            ul.classList.add("multi");
        }
        let selectedTexts = ""
        let sep = "";
		
        this.options = document.querySelectorAll(this.domSelector + " option");
        Array.prototype.slice.call(this.options).forEach(function (x) {
            let text = x.textContent;
            let value = x.value;
            let classes = x.getAttribute("class");
			if(classes) 
				{
					classes=classes.split(" ");
				}
			else
				{
					classes=[];
				}
            let li = document.createElement("li");
            let isSelected = x.hasAttribute("selected");
            ul.appendChild(li);
            li.setAttribute("data-value", value);
            li.setAttribute("data-text", text);
            if (classes.length != 0) {
				classes.forEach(function(x){
					li.classList.add(x);
				});
                
            }
            if (isSelected) {
                selectedTexts += sep + text;
                sep = ",";
                li.classList.add("active");
                if (!self.isMultiple) {
                    self.title.textContent = text;
					if (classes.length != 0) {
						classes.forEach(function(x){
							self.title.classList.add(x);
						});
                    }
                }
            }
            li.appendChild(document.createTextNode(text));
        });
        if (self.isMultiple) {
            self.title.innerHTML = selectedTexts;
        }
        if (self.userOptions.placeHolder != "" && self.title.textContent == "") {
            self.title.textContent = self.userOptions.placeHolder;
        }
        this.listElements = this.drop.querySelectorAll("li");
		
		
			this.main.addEventListener("click", function (e) {
				if (self.isDisabled) return;
				self.drop.style.left = self.left + "px";
				self.drop.style.top = self.top + "px";
				self.drop.style.display = "block";
				document.addEventListener("click", docListener);
				e.preventDefault();
				e.stopPropagation();
				});

        this.drop.addEventListener("click", function (e) {
            if (!e.target.hasAttribute("data-value")) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            let choiceValue = e.target.getAttribute("data-value");
            let choiceText = e.target.getAttribute("data-text");
            let className = e.target.getAttribute("class");
            if (!self.isMultiple) {
                self.root.value = choiceValue;
                self.title.textContent = choiceText;
                if (className) {
                    self.title.setAttribute("class", className + " title");
                } else {
                    self.title.setAttribute("class", "title");
                }
                Array.prototype.slice.call(self.listElements).forEach(function (x) {
                    x.classList.remove("active");
                });
                if (choiceText != "") {
                    e.target.classList.add("active");
                }
                self.privateSendChange();
				
					docListener();

            } else {
                let wasActive = false;
                if (className) {
                    wasActive = className.indexOf("active") != -1;
                }
                if (wasActive) {
                    e.target.classList.remove("active");
                } else {
                    e.target.classList.add("active");
                }
                let selectedTexts = ""
                let sep = "";
                for (let i = 0; i < self.options.length; i++) {
                    if (self.options[i].value == choiceValue) {
                        self.options[i].selected = !wasActive;
                    }
                    if (self.options[i].selected) {
                        selectedTexts += sep + self.options[i].textContent;
                        sep = ",";
                    }
                }
                self.title.textContent = selectedTexts;
                self.privateSendChange();
            }
            e.preventDefault();
            e.stopPropagation();
            if (self.userOptions.placeHolder != "" && self.title.textContent == "") {
                self.title.textContent = self.userOptions.placeHolder;
            }
        });
        function docListener() {
            document.removeEventListener("click", docListener);
            self.drop.style.display = "none";
        }
    }

    vanillaSelectBox.prototype.setValue = function (values) {
		let self = this;
        if (values == null || values == undefined || values == "") {
            self.empty();
        } else {
            if (self.isMultiple) {
                if (type(values) == "string") {
                    if (values == "all") {
                        values = [];
                        Array.prototype.slice.call(self.options).forEach(function (x) {
                            values.push(x.value);
                        });
                    } else {
                        values = values.split(",");
                    }
                }
                let foundValues = [];
                if (type(values) == "array") {
                    Array.prototype.slice.call(self.options).forEach(function (x) {
                        if (values.indexOf(x.value) != -1) {
                            x.selected = true;
                            foundValues.push(x.value);
                        } else {
                            x.selected = false;
                        }
                    });
                    let selectedTexts = ""
                    let sep = "";
                    Array.prototype.slice.call(self.listElements).forEach(function (x) {
                        if (foundValues.indexOf(x.getAttribute("data-value")) != -1) {
                            x.classList.add("active");
                            selectedTexts += sep + x.getAttribute("data-text");
                            sep = ",";
                        } else {
                            x.classList.remove("active");
                        }
                    });
                    
                    self.title.textContent = selectedTexts;
                    self.privateSendChange();
                }
            } else {
                let found = false;
                let text = "";
                Array.prototype.slice.call(self.listElements).forEach(function (x) {
                    if (x.getAttribute("data-value") == values) {
                        x.classList.add("active");
                        found = true;
                        text = x.getAttribute("data-text")
                    } else {
                        x.classList.remove("active");
                    }
                });
                Array.prototype.slice.call(self.options).forEach(function (x) {
                    if (x.value == values) {
                        x.selected = true;
                        className = x.getAttribute("class");
                        if (!className) className = "";
                    } else {
                        x.selected = false;
                    }
                });
                if (found) {
                    self.title.textContent = text;
                    if (self.userOptions.placeHolder != "" && self.title.textContent == "") {
                        self.title.textContent = self.userOptions.placeHolder;
                    }
                    if (className != "") {
                        self.title.setAttribute("class", className + " title");
                    } else {
                        self.title.setAttribute("class", "title");
                    }
                }
            }
        }
        function type(target) {
            const computedType = Object.prototype.toString.call(target);
            const stripped = computedType.replace("[object ", "").replace("]", "");
            const lowercased = stripped.toLowerCase();
            return lowercased;
        }
    }

    vanillaSelectBox.prototype.privateSendChange = function () {
        let event = document.createEvent('HTMLEvents');
        event.initEvent('change', true, false);
        this.root.dispatchEvent(event);
    
	}

	vanillaSelectBox.prototype.empty = function () {
        Array.prototype.slice.call(this.listElements).forEach(function (x) {
            x.classList.remove("active");
        });
        Array.prototype.slice.call(this.options).forEach(function (x) {
            x.selected = false;
        });
        this.title.textContent = "";
        if (this.userOptions.placeHolder != "" && this.title.textContent == "") {
            this.title.textContent = this.userOptions.placeHolder;
        }
        this.privateSendChange();
    }
	
    vanillaSelectBox.prototype.destroy = function () {
        let already = document.getElementById("btn-group-" + this.domSelector);
        if (already) {
            already.remove();
            this.root.style.display = "inline-block";
        }
    }
    vanillaSelectBox.prototype.disable = function () {
        let already = document.getElementById("btn-group-" + this.domSelector);
        if (already) {
            button = already.querySelector("button")
            button.classList.add("disabled");
            this.isDisabled = true;
        }
    }
    vanillaSelectBox.prototype.enable = function () {
        let already = document.getElementById("btn-group-" + this.domSelector);
        if (already) {
            button = already.querySelector("button")
            button.classList.remove("disabled");
            this.isDisabled = false;
        }
    }

vanillaSelectBox.prototype.showOptions = function(){
	console.log(this.userOptions);
}
// Polyfills for IE
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}
