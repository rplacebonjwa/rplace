// ==UserScript==
// @name         Bonjwa + r/placeDE Template
// @namespace    http://tampermonkey.net/
// @version      29
// @description  try to take over the canvas! Combination of Bonjwa and r/placeDE template
// @author       Chris-GW, nama17, Kloroller_DE, vertigo, Sockenschuh, Chrimi8, Deimosu
// @match        https://garlic-bread.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.bonjwa.de
// @updateURL    https://github.com/rplacebonjwa/rplace/raw/main/overlay.user.js
// @downloadURL  https://github.com/rplacebonjwa/rplace/raw/main/overlay.user.js
// ==/UserScript==

let canvasWidth = 3000;
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

const mainContainer = document.querySelector("garlic-bread-embed").shadowRoot.querySelector(".layout");

function exportScreenshot() {
  const canvas = mainContainer.querySelector("garlic-bread-canvas").shadowRoot.querySelector("canvas");
  if (!canvas) {
    return;
  }
  const imgUrl = canvas.toDataURL("image/png");

  const downloadEl = document.createElement("a");
  downloadEl.href = imgUrl;
  downloadEl.download = `place-${Date.now()}.png`;
  downloadEl.click();
  downloadEl.remove();
}

function saveStorage(name, value) {
  name = "rPlaceBonjwa" + name;
  localStorage.setItem(name, value);
}

function readStorage(name) {
  name = "rPlaceBonjwa" + name;
  let value = localStorage.getItem(name);

  return value;
}

let hideOverlay = readStorage("hideOverlay") === "true" ? true : false;

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
  checkForUpdates(false);
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

function createModal(text, showUpdateButton = false) {
  const modalContainer = document.createElement("div");
  modalContainer.style.position = "fixed";
  modalContainer.style.left = "0";
  modalContainer.style.top = "0";
  modalContainer.style.width = "100%";
  modalContainer.style.height = "100%";
  modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modalContainer.style.display = "flex";
  modalContainer.style.justifyContent = "center";
  modalContainer.style.alignItems = "center";

  const modalContent = document.createElement("div");
  modalContent.style.backgroundColor = "#fff";
  modalContent.style.padding = "20px";
  modalContent.style.borderRadius = "5px";
  modalContent.style.display = "flex";
  modalContent.style.flexDirection = "column";

  const updateText = document.createElement("div");
  updateText.textContent = text;
  updateText.style.marginBottom = "10px";
  modalContent.appendChild(updateText);

  const buttonWrapper = document.createElement("div");
  buttonWrapper.style.display = "flex";
  buttonWrapper.style.justifyContent = "flex-end";

  if (showUpdateButton) {
    const updateButton = document.createElement("button");
    updateButton.textContent = "Update";
    updateButton.style.borderRadius = "3px";
    updateButton.style.justifyContent = "flex-end";
    updateButton.onclick = function () {
      window.open(GM_info.scriptUpdateURL, "updateScript");
    };
    buttonWrapper.appendChild(updateButton);
  }

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.marginLeft = "8px";
  closeButton.style.borderRadius = "3px";
  closeButton.style.justifyContent = "flex-end";
  closeButton.onclick = closeModal;
  buttonWrapper.appendChild(closeButton);

  modalContent.appendChild(buttonWrapper);
  modalContainer.appendChild(modalContent);
  document.body.appendChild(modalContainer);

  function closeModal() {
    document.body.removeChild(modalContainer);
  }
}

function checkForUpdates(showAlert) {
  fetch("https://raw.githubusercontent.com/rplacebonjwa/rplace/main/overlay.user.js")
    .then((response) => response.text())
    .then((remoteScript) => {
      const remoteVersion = remoteScript.match(/@version\s+(\d+)/);
      if (remoteVersion && remoteVersion[1]) {
        const latestVersion = parseInt(remoteVersion[1], 10);
        if (latestVersion > GM_info.script.version) {
          updateUpdateButtonColor(true);
          if (showAlert)
            createModal(
              `New update available! Please update the script (${latestVersion} > ${GM_info.script.version}). After updating, please reload the page.`,
              true
            );
        } else {
          updateUpdateButtonColor(false);
          if (showAlert) createModal("You are using the latest version.");
        }
      }
    })
    .catch((error) => {
      console.error("Error checking for updates:", error);
    });
}

function updateUpdateButtonColor(isOlder) {
  let el = document.getElementById("hideButton");
  if (isOlder) el.style.backgroundColor = "#f87171";
  else el.style.backgroundColor = "#a3e635";
}

function createButton(pos) {
  const el = document.createElement("button");
  el.style.position = "fixed";
  el.style.left = "calc(var(--sail) + 16px)";
  el.style.top = "calc(var(--sait) + 16px - 8px + ( 43px + 16px ) * " + pos + " )";
  el.style.width = "43px";
  el.style.height = "43px";
  el.style.backgroundColor = "#ffffff";
  el.style.borderRadius = "0";
  el.style.border = "3px solid black";
  el.style.boxShadow = "var(--pixel-box-shadow)";

  return el;
}

function createDivCenter() {
  const div = document.createElement("div");
  div.style.display = "flex";
  div.style.width = "100%";
  div.style.height = "100%";
  div.style.justifyContent = "center";
  div.style.alignItems = "center";

  return div;
}

function createDivIcon() {
  const el = document.createElement("div");
  el.style.width = "24px";
  el.style.height = "24px";
  el.style.color = "black";
  el.style.margin = "auto";

  return el;
}

function createCompleteButton(pos) {
  const button = createButton(pos);
  const divCenter = createDivCenter();
  const divIcon = createDivIcon();

  divCenter.appendChild(divIcon);
  button.appendChild(divCenter);

  return button;
}

if (window.top !== window.self) {
  const container = document.querySelector("garlic-bread-embed");

  // create button to show / hide overlay
  let showHideButton = createCompleteButton(1);
  showHideButton.onclick = function () {
    hideOverlay = !hideOverlay;
    updateHideButtonIcon(hideOverlay);
    saveStorage("hideOverlay", hideOverlay);
    restartInterval();
  };
  showHideButton.firstChild.firstChild.id = "hideIcon";
  container.appendChild(showHideButton);
  updateHideButtonIcon(hideOverlay);

  // create button to download a screenshot
  let screenshotButton = createCompleteButton(2);
  screenshotButton.onclick = function () {
    exportScreenshot();
  };
  screenshotButton.firstChild.firstChild.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(2 3)"><path d="M20 16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2v11z"/><circle cx="10" cy="10" r="4"/></g></svg> `;
  container.appendChild(screenshotButton);

  // create button to check if new update available
  let updateButton = createCompleteButton(3);
  updateButton.id = "hideButton";
  updateButton.onclick = function () {
    checkForUpdates(true);
  };
  updateButton.firstChild.firstChild.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"> <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" style="stroke-width: 3px;" /></svg>`;
  container.appendChild(updateButton);
}

function restartInterval() {
  clearInterval(interval);
  repaintOverlays();
  interval = setInterval(repaintOverlays, 90 * 1000);
}

addOverlay();
let interval = setInterval(repaintOverlays, 90 * 1000);
