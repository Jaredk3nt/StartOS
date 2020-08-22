function addBookmark(id) {
  const label = document.getElementById("name-input").value;
  const href = document.getElementById("href-input").value;
  windows[id].bookmarks.push({ label, href });
  saveWindows();
  redrawWindow(id);
  removeWindow(ADD_BOOKMARK_ID);
}

function removeBookmark(id, idx) {
  const index = parseInt(idx);
  if (
    windows[id] &&
    windows[id].bookmarks &&
    Array.isArray(windows[id].bookmarks)
  ) {
    const bookmarks = windows[id].bookmarks;
    windows[id].bookmarks = [
      ...bookmarks.slice(0, index),
      ...bookmarks.slice(index + 1, bookmarks.length),
    ];
    saveWindows();
    redrawWindow(id);
  }
}
