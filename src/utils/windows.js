function loadWindows() {
  windows = safeParse(localStorage.getItem(LS_WINDOWS_KEY)) || {};
  Object.keys(windows).forEach((w) => {
    if (windows[w].bookmarks && Array.isArray(windows[w].bookmarks)) {
      return createBookmarkWindow(w);
    }
    if (windows[w].type === "note") {
      return createNoteWindow(w);
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
