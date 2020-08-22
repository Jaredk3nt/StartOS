/**
 * Config options:
 * - wallpaper
 * - open in window
 */

function loadConfig() {
  config = safeParse(localStorage.getItem(LS_CONFIG_KEY)) || {};
  applyConfig();
}

function applyConfig() {
  // Load all properties
  loadWallpaper();
}

function saveConfig() {
  localStorage.setItem(LS_CONFIG_KEY, JSON.stringify(config));
}

function updateConfig() {
  const wallpaper = document.getElementById("wallpaper-input").value;
  const internalWebpages = document
    .getElementById("internal-webpages-input")
    .classList.contains("active");
  config = {
    ...config,
    wallpaper,
    internalWebpages,
  };
  applyConfig();
  saveConfig();
  Object.keys(windows).forEach(redrawWindow);
}

function loadWallpaper() {
  if (config.wallpaper) {
    const el = document.getElementById("desktop");
    if (
      // TODO: replace conditions with regex
      config.wallpaper.startsWith("http") ||
      config.wallpaper.startsWith("https")
    ) {
      el.style["background-image"] = `url("${config.wallpaper}")`;
    }

    if (
      config.wallpaper.startsWith("rgb") ||
      config.wallpaper.startsWith("rgba") ||
      config.wallpaper.startsWith("#")
    ) {
      el.style["background-color"] = config.wallpaper;
    }
  }
}

function toggleInternalWebpagesButton() {
  const el = document.getElementById("internal-webpages-input");
  if (el.classList.contains("active")) {
    el.innerText = "External";
    return el.classList.remove("active");
  }

  el.innerText = "Internal";
  el.classList.add("active");
}
