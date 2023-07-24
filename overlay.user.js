// ==UserScript==
// @name         Template Test
// @namespace    http://tampermonkey.net/
// @version      20
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
let hideOverlay = false;

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
        overlayImage.id = "overlayCanvas";
        overlayImage.height = canvasHeight * 3;
        overlayImage.width = canvasWidth * 3;
        overlayImage.style =
          "position: absolute; left: 0px; top: 0px; width: " +
          canvasWidth +
          "px; height: " +
          canvasHeight +
          "px; pointer-events: none;";
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
  if (hideOverlay) return;

  overlayUrls.forEach((url) => {
    let img = new Image();
    img.onload = function () {
      overlayContext.drawImage(img, 0, 0);
    };
    img.src = url + "?" + Date.now();
  });
}

function updateHideButtonIcon(hide) {
  let divElement = document.getElementById("hideIcon");

  if (!hide) {
    divElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
          <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd" />
        </svg>`;
  } else {
    divElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
        <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
        <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
      </svg>`;
  }
}

if (window.top !== window.self) {
  const container = document.querySelector("garlic-bread-embed");
  let buttonElement = document.createElement("button");
  buttonElement.style.position = "fixed";
  buttonElement.style.left = "calc(var(--sail) + 16px + 43px + 16px)";
  buttonElement.style.top = "calc(var(--sait) + 16px - 8px)";
  buttonElement.style.width = "43px";
  buttonElement.style.height = "43px";
  buttonElement.style.backgroundColor = "#ffffff";
  buttonElement.style.borderRadius = "0";
  buttonElement.style.border = "3px solid black";
  buttonElement.style.boxShadow = "var(--pixel-box-shadow)";
  buttonElement.onclick = function () {
    hideOverlay = !hideOverlay;
    updateHideButtonIcon(hideOverlay);
    restartInterval();
  };

  let divElement = document.createElement("div");
  divElement.class = "hide-button";
  divElement.style.display = "flex";
  divElement.style.width = "100%";
  divElement.style.height = "100%";
  divElement.style.justifyContent = "center";
  divElement.style.alignItems = "center";

  let imgDivElement = document.createElement("div");
  imgDivElement.style.width = "24px";
  imgDivElement.style.height = "24px";
  imgDivElement.style.color = "black";
  imgDivElement.id = "hideIcon";

  divElement.appendChild(imgDivElement);
  buttonElement.appendChild(divElement);
  container.appendChild(buttonElement);
  updateHideButtonIcon(hideOverlay);
}

function restartInterval() {
  clearInterval(interval);
  repaintOverlays();
  interval = setInterval(repaintOverlays, 45 * 1000);
}

addOverlay();
let interval = setInterval(repaintOverlays, 45 * 1000);
