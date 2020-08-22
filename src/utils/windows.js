function loadWindows() {
  windows = JSON.parse(localStorage.getItem(LS_WINDOWS_KEY));
  Object.keys(windows).forEach((w) => {
    if (windows[w].bookmarks && Array.isArray(windows[w].bookmarks)) {
      return createBookmarkWindow(w);
    }
    return createWebpageWindow(w);
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
  createBookmarkWindow(id);
}
