// ==UserScript==
// @name         Bonjwa + r/placeDE Template
// @namespace    http://tampermonkey.net/
// @version      17
// @description  try to take over the canvas! Combination of Bonjwa and r/placeDE template
// @author       Chris-GW, nama17, Kloroller_DE, vertigo, Sockenschuh, Chrimi8
// @match        https://garlic-bread.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.bonjwa.de
// @updateURL    https://github.com/rplacebonjwa/rplace/raw/main/overlay.user.js
// @downloadURL  https://github.com/rplacebonjwa/rplace/raw/main/overlay.user.js
// ==/UserScript==

var overlayUrls = [
  // Gronkh overlay
  "https://raw.githubusercontent.com/FeLuckLP/rplace/main/overlay.png",
  // r/placeDE overlay
  "https://place.army/overlay_target.png",
  // eigenes Overlay
  "https://raw.githubusercontent.com/rplacebonjwa/rplace/main/overlay.png",
];

var overlayContext = null;
var overlayImage = null;

function addOverlay() {
  if (window.top !== window.self) {
    window.addEventListener(
      "load",
      () => {
        const canvasContainer = document
          .querySelector("garlic-bread-embed")
          .shadowRoot.querySelector("div.layout")
          .querySelector("garlic-bread-canvas")
          .shadowRoot.querySelector("div.container");
        overlayImage = document.createElement("canvas");
        overlayImage.height = "6000";
        overlayImage.width = "6000";
        overlayImage.style = "position: absolute;left: 0px;top: 0px; width: 2000px; height: 2000px;";
        canvasContainer.appendChild(overlayImage);
        overlayContext = overlayImage.getContext("2d");

        repaintOverlays();
      },
      false
    );
  }
}

function repaintOverlays() {
  overlayContext.clearRect(0, 0, 6000, 6000);
  overlayUrls.forEach(url => {
    var img = new Image();
    img.onload = function () {
      overlayContext.drawImage(img, 0, 0);
    };
    img.src = url + "?" + Date.now();
  });
}

addOverlay();
setInterval(repaintOverlays, 30000);
