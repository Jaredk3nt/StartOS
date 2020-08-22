function createWindow(
  id,
  title,
  content,
  options = {
    width: "400px",
    height: "500px",
  }
) {
  const newWindow = document.createElement("div");

  let x = DEFAULT_LOCATON.x;
  let y = DEFAULT_LOCATON.y;
  let height = options.height;
  let width = options.width;
  if (windows[id]) {
    x = windows[id].location.x;
    y = windows[id].location.y;
    if (windows[id].size) {
      height = windows[id].size.height;
      width = windows[id].size.width;
    }
  }

  newWindow.setAttribute("id", id);
  newWindow.setAttribute("class", "window");
  newWindow.setAttribute(
    "style",
    `left:${x}px;top:${y}px;width:${width};height:${height}`
  );
  newWindow.innerHTML = `
  <div class="window-toolbar" id="${id}-toolbar" >
    <div class="window-toolbar-title">${title}</div>
    <div class="window-toolbar-lines"></div>
    <button class="close-button" onclick='removeWindow("${id}")'></button>
  </div>
  <div class="window-content">${content}</div>
  `;

  document.getElementById("desktop").appendChild(newWindow);

  const cleanup = enableDragable(id + "-toolbar", id, "desktop");
  if (windows[id]) {
    windows[id].cleanup = cleanup;
  }
}

function createWebpageWindow(id, title, url) {
  console.log(id);
  if (!id) id = genId();

  if (!windows[id]) {
    windows[id] = {
      title,
      url,
      location: { x: DEFAULT_LOCATON.x, y: DEFAULT_LOCATON.y },
    };
    saveWindows();
  }

  createWindow(
    id,
    windows[id].title,
    `<iframe class="webpage-iframe" src="${windows[id].url}" title="${windows[id].title}"></iframe>`,
    { width: "900px", height: "600px" }
  );
}

function createConfigWindow() {
  createWindow(
    CONFIG_ID,
    "Settings",
    `<div class="padded-content">
      <div class="input-field">
        <label>Wallpaper</label>
        <input id="wallpaper-input" value="${config.wallpaper || ""}"/>
      </div>

      <div class="input-field">
        <label>Display Webpages Internally?</label>
        <button
          id="internal-webpages-input"
          class="button ${config.internalWebpages ? "active" : ""}"
          onclick="toggleInternalWebpagesButton()"
        >
          ${config.internalWebpages ? "Interal" : "External"}
        </button>
      </div>

      <div class="button-field">
        <button class="button" onclick="updateConfig()">SAVE</button>
      </div>
    </div>`
  );
}

function createAddBookmarkWindow(id, options = {}) {
  createWindow(
    ADD_BOOKMARK_ID,
    "Create Bookmark",
    `<div class="padded-content">
      <div class="input-field">
        <label>Name</label>
        <input id="name-input" />
      </div>
      <div class="input-field">
        <label>URL</label>
        <input id="href-input" />
      </div>
      <div class="button-field">
        <button class="button" onclick="removeWindow('${ADD_BOOKMARK_ID}')">Cancel</button>
        <button class="button" onclick="addBookmark('${id}')">OK</button>
      </div>
    </div>`,
    { width: "300px", height: "auto", ...options }
  );
}

function createBookmarkWindow(id, options = {}) {
  if (!id) id = genId();

  if (!windows[id]) {
    windows[id] = {
      title: "New Window",
      bookmarks: [],
      location: { x: DEFAULT_LOCATON.x, y: DEFAULT_LOCATON.y },
    };
    saveWindows();
  }

  createWindow(
    id,
    windows[id].title,
    bookmarkContent(id, windows[id].bookmarks),
    options
  );
}

function bookmarkContent(id, bookmarks) {
  const lis = bookmarks.map((b, idx) => {
    console.log(config);
    if (config.internalWebpages) {
      return `
        <li
          class="bookmark"
          role="button"
          
        >
            <button class="close-button" onclick='removeBookmark("${id}", "${idx}")'></button>
            <div onclick="createWebpageWindow('', '${b.label}', '${b.href}')">
              <div class="bookmark-icon"></div>
              <p class="bookmark-title">${b.label}</p>
            </div>
        </li>
      `;
    }
    return `
      <li class="bookmark">
        <button class="close-button" onclick='removeBookmark("${id}", "${idx}")'></button>
        <a href="${b.href}">
          <div class="bookmark-icon"></div>
          <p class="bookmark-title">${b.label}</p>
        </a>
      </li>
    `;
  });

  return `
    <div class="bookmark-toolbar">
      <p class="toolbar-text">${bookmarks.length} items</p>
      <p class="toolbar-text">${bookmarks.length * 128}K in Folder</p>
      <button class="toolbar-button" onclick="createAddBookmarkWindow('${id}')">
        Add Bookmark
      </button>
    </div>
    <ul class="bookmark-list">${lis.join("")}</ul>
  `;
}
