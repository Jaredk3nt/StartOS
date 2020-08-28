function createWindow(
  id,
  title,
  content,
  options = {
    width: '400px',
    height: '500px',
  }
) {
  const newWindow = document.createElement('div');

  let x = DEFAULT_LOCATON.x;
  let y = DEFAULT_LOCATON.y;
  let height = options.height;
  let width = options.width;
  let winZIndex = zIndex;
  if (windows[id]) {
    x = windows[id].location.x;
    y = windows[id].location.y;
    if (windows[id].size) {
      height = windows[id].size.height;
      width = windows[id].size.width;
    }
    if (windows[id].zIndex) {
      winZIndex = windows[id].zIndex;
    }
  }

  newWindow.setAttribute('id', id);
  newWindow.setAttribute('class', 'window');
  newWindow.setAttribute(
    'style',
    `left:${x}px;top:${y}px;width:${width};height:${height};z-index:${winZIndex};`
  );
  newWindow.innerHTML = `
    <div class="window-toolbar" id="${id}-toolbar">
      <div class="window-toolbar-title">${title}</div>
      <div class="window-toolbar-lines"></div>
      <button class="close-button" onclick='removeWindow("${id}")'></button>
    </div>
    <div class="window-content">${content}</div>
  `;

  document.getElementById('desktop').appendChild(newWindow);
  updateZindex(id);

  const cleanup = enableDragable(id + '-toolbar', id, 'desktop');
  if (windows[id]) {
    windows[id].cleanup = cleanup;
  }

  return newWindow;
}

/** Utility functions **/
function loadWindows() {
  windows = safeParse(localStorage.getItem(LS_WINDOWS_KEY)) || {};
  zIndex = Object.values(windows).reduce((acc, w) => {
    if (w.zIndex) {
      return Math.max(acc, parseInt(w.zIndex));
    }
    return acc;
  }, zIndex);

  Object.keys(windows).forEach(drawWindow);
}

function saveWindows() {
  const saveableWindows = Object.fromEntries(
    Object.entries(windows).map(([key, { cleanup, ...rest }]) => [key, rest])
  );
  localStorage.setItem(LS_WINDOWS_KEY, JSON.stringify(saveableWindows));
}
function redrawWindow(id) {
  if (windows[id] && windows[id].cleanup) {
    windows[id].cleanup();
  }
  document.getElementById(id).remove();
  drawWindow(id);
}

function drawWindow(id) {
  if (windows[id].bookmarks && Array.isArray(windows[id].bookmarks)) {
    return createBookmarkWindow(id);
  }
  switch (windows[id].type) {
    case 'note':
      return createNoteWindow(id);
    case 'image':
      return createImageWindow(id);
    case 'video':
      return createVideoWindow(id);
    default:
      return createWebpageWindow(id);
  }
}

function updateNoteText(id) {
  const el = document.getElementById(id + '-content');
  windows[id].text = el.value;
  saveWindows();
}

function toggleMenu(id) {
  const el = document.getElementById(id);
  if (el.style.display) {
    return (el.style.display = '');
  }
  return (el.style.display = 'block');
}

function handleMenuClick(id, func) {
  func();
  toggleMenu(id);
}

function onFocus(e) {
  let el = e.target;
  while (!el.classList.contains('window')) {
    el = el.parentElement;
  }
  updateZindex(el.id);
}

function updateZindex(id) {
  const el = document.getElementById(id);
  zIndex++;
  el.style['z-index'] = zIndex;
  if (windows[id]) {
    windows[id].zIndex = zIndex;
  }

  if (zIndex >= 98) {
    const els = Array.from(document.getElementsByClassName('window'));
    els.sort((a, b) => {
      return parseInt(a.style['z-index']) - parseInt(b.style['z-index']);
    });
    els.forEach((window, idx) => {
      window.style['z-index'] = idx;
      windows[window.id].zIndex = idx;
    });
    zIndex = els.length;
  }

  saveWindows();
}

/** Removal Functions **/
function removeWindow(id) {
  if (windows[id]) {
    if (windows[id].cleanup) windows[id].cleanup();
    delete windows[id];
    saveWindows();
  }
  document.getElementById(id).remove();
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

/** CREATE WRAPPER FUNCTIONS **/
function addPicture() {
  const title = document.getElementById('image-name-input').value;
  const url = document.getElementById('image-input').value;
  const id = genId();
  windows[id] = {
    title,
    url,
    type: 'image',
    location: { x: DEFAULT_LOCATON.x, y: DEFAULT_LOCATON.y },
  };
  saveWindows();
  createImageWindow(id);
  removeWindow(ADD_IMAGE_ID);
}

function addVideo() {
  const title = document.getElementById('video-name-input').value;
  const url = document.getElementById('video-input').value;
  const id = genId();
  windows[id] = {
    title,
    url,
    type: 'video',
    location: { x: DEFAULT_LOCATON.x, y: DEFAULT_LOCATON.y },
  };
  saveWindows();
  createVideoWindow(id);
  removeWindow(ADD_VIDEO_ID);
}

function addNote() {
  const title = document.getElementById('note-name-input').value;
  const id = genId();
  windows[id] = {
    title,
    type: 'note',
    text: '',
    location: { x: DEFAULT_LOCATON.x, y: DEFAULT_LOCATON.y },
  };
  saveWindows();
  createNoteWindow(id);
  removeWindow(ADD_NOTE_ID);
}

function addBookmarks() {
  const title = document.getElementById('bookmarks-name-input').value;
  const id = genId();
  windows[id] = {
    title,
    type: 'bookmarks',
    bookmarks: [],
    location: { x: DEFAULT_LOCATON.x, y: DEFAULT_LOCATON.y },
  };
  saveWindows();
  createBookmarkWindow(id);
  removeWindow(ADD_BOOKMARKS_ID);
}

function addBookmark(id) {
  const label = document.getElementById('name-input').value;
  const href = document.getElementById('href-input').value;
  windows[id].bookmarks.push({ label, href });
  saveWindows();
  redrawWindow(id);
  removeWindow(ADD_BOOKMARK_ID);
}
