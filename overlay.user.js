// ==UserScript==
// @name         Bonjwa + r/placeDE Template
// @namespace    http://tampermonkey.net/
// @version      9
// @description  try to take over the canvas! Combination of Bonjwa and r/placeDE template
// @author       Chris-GW, nama17, Kloroller_DE, vertigo, Sockenschuh
// @match        https://garlic-bread.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.bonjwa.de
// @updateURL    https://github.com/rplacebonjwa/rplace/raw/main/overlay.user.js
// @downloadURL  https://github.com/rplacebonjwa/rplace/raw/main/overlay.user.js
// ==/UserScript==

addOverlayImage("https://raw.githubusercontent.com/rplacebonjwa/rplace/main/overlay.png")
addOverlayImage("https://place.army/overlay_target.png")

function addOverlayImage(url) {
  var overlayImage = null;
  if (window.top !== window.self) {
    window.addEventListener('load', () => {
      const canvasContainer = document.querySelector("garlic-bread-embed").shadowRoot.querySelector("div.layout").querySelector("garlic-bread-canvas").shadowRoot.querySelector("div.container");
      overlayImage = document.createElement("img");
      overlayImage.src = url + "?" + Date.now()
      overlayImage.style = `position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 1000px;height: 1000px;pointerEvents: 'none';`;
      canvasContainer.appendChild(overlayImage);
    }, false);
  }

  setInterval(function () {
    overlayImage.src = url + "?" + Date.now()
  }, 30000);
}

