function loadWindows() {
  windows = safeParse(localStorage.getItem(LS_WINDOWS_KEY)) || {};
  Object.keys(windows).forEach((w) => {
    if (windows[w].bookmarks && Array.isArray(windows[w].bookmarks)) {
      return createBookmarkWindow(w);
    }
    switch (windows[w].type) {
      case "note":
        return createNoteWindow(w);
      case "image":
        return createImageWindow(w);
      case "video":
        return createVideoWindow(w);
      default:
        return createWebpageWindow(w);
    }
  });
}

function saveWindows() {
  const saveableWindows = Object.fromEntries(
    Object.entries(windows).map(([key, { cleanup, ...rest }]) => [key, rest])
  );
  localStorage.setItem(LS_WINDOWS_KEY, JSON.stringify(saveableWindows));
}

function removeWindow(id) {
  if (windows[id]) {
    if (windows[id].cleanup) windows[id].cleanup();
    delete windows[id];
    saveWindows();
  }
  document.getElementById(id).remove();
}

function redrawWindow(id) {
  if (windows[id] && windows[id].cleanup) {
    windows[id].cleanup();
  }
  document.getElementById(id).remove();
  if (windows[id].bookmarks && Array.isArray(windows[id].bookmarks)) {
    return createBookmarkWindow(id);
  }
  return createWebpageWindow(id);
}

function updateNoteText(id) {
  const el = document.getElementById(id + "-content");
  windows[id].text = el.value;
  saveWindows();
}

function toggleMenu(id) {
  const el = document.getElementById(id);
  if (el.style.display) {
    return (el.style.display = "");
  }
  return (el.style.display = "block");
}

function handleMenuClick(id, func) {
  func();
  toggleMenu(id);
}

function addPicture() {
  console.log("add picture");
  const title = document.getElementById("image-name-input").value;
  const url = document.getElementById("image-input").value;
  const id = genId();
  windows[id] = {
    title,
    url,
    type: "image",
    location: { x: DEFAULT_LOCATON.x, y: DEFAULT_LOCATON.y },
  };
  saveWindows();
  createImageWindow(id);
}

function addVideo() {
  const title = document.getElementById("video-name-input").value;
  const url = document.getElementById("video-input").value;
  const id = genId();
  windows[id] = {
    title,
    url,
    type: "video",
    location: { x: DEFAULT_LOCATON.x, y: DEFAULT_LOCATON.y },
  };
  saveWindows();
  createVideoWindow(id);
}
