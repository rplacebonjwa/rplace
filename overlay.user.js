// ==UserScript==
// @name         Bonjwa + r/placeDE Template
// @namespace    http://tampermonkey.net/
// @version      18
// @description  try to take over the canvas! Combination of Bonjwa and r/placeDE template
// @author       Chris-GW, nama17, Kloroller_DE, vertigo, Sockenschuh, Chrimi8
// @match        https://garlic-bread.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.bonjwa.de
// @updateURL    https://github.com/rplacebonjwa/rplace/raw/main/overlay.user.js
// @downloadURL  https://github.com/rplacebonjwa/rplace/raw/main/overlay.user.js
// ==/UserScript==

let canvasWidth = 2500;
let canvasHeight = 2000;

let overlayUrls = [
  // Gronkh overlay
  "https://raw.githubusercontent.com/FeLuckLP/rplace/main/overlay.png",
  // r/placeDE overlay
  "https://place.army/overlay_target.png",
  // eigenes Overlay
  "https://raw.githubusercontent.com/rplacebonjwa/rplace/main/overlay.png",
];

let overlayContext = null;
let overlayImage = null;

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
        overlayImage.height = canvasHeight * 3;
        overlayImage.width = canvasWidth * 3;
        overlayImage.style = "position: absolute;left: 0px;top: 0px; width: " + canvasWidth + "px; height: " + canvasHeight + "px;";
        canvasContainer.appendChild(overlayImage);
        overlayContext = overlayImage.getContext("2d");

        repaintOverlays();
      },
      false
    );
  }
}

function repaintOverlays() {
  overlayContext.clearRect(0, 0, canvasWidth * 3, canvasHeight * 3);
  overlayUrls.forEach(url => {
    let img = new Image();
    img.onload = function () {
      overlayContext.drawImage(img, 0, 0);
    };
    img.src = url + "?" + Date.now();
  });
}

addOverlay();
setInterval(repaintOverlays, 45 * 1000);
