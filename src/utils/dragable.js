function enableDragable(handle, target, container) {
  let xOffset;
  let yOffset;

  function dragStart(e) {
    const el = document.getElementById(target);
    const rect = el.getBoundingClientRect();
    const containerEl = document.getElementById(container);
    const containerRect = containerEl.getBoundingClientRect();

    switch (e.type) {
      case 'mousedown':
        xOffset = e.clientX - rect.left + containerRect.left;
        yOffset = e.clientY - rect.top;
        break;
      case 'touchstart':
        xOffset = e.targetTouches[0].clientX - rect.left + containerRect.left;
        yOffset = e.targetTouches[0].clientY - rect.top; //+ containerRect.top;
        break;
      default:
        break;
    }

    el.style.position = 'absolute';
    // el.classList.add('active-window'); // TODO: handle window stacking
    window.addEventListener('mousemove', drag, true);
    window.addEventListener('touchmove', drag, true);
    window.onmouseup = dragEnd;
  }

  function drag(e) {
    let x;
    let y;
    switch (e.type) {
      case 'mousemove':
        x = e.clientX - xOffset;
        y = e.clientY - yOffset;
        break;
      case 'touchmove':
        x = e.targetTouches[0].clientX - xOffset;
        y = e.targetTouches[0].clientY - yOffset;
        break;
      default:
        break;
    }

    const el = document.getElementById(target);
    const rect = el.getBoundingClientRect();
    const containerEl = document.getElementById(container);
    const containerRect = containerEl.getBoundingClientRect();

    if (x > containerRect.right - rect.width)
      x = containerRect.right - rect.width;
    if (y > containerRect.bottom - rect.height)
      y = containerRect.bottom - rect.height;
    if (x < containerRect.left) x = containerRect.left;
    if (y < containerRect.top) y = containerRect.top;

    if (windows[target]) {
      windows[target].location = { x, y };
      saveWindows();
    }

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  }

  function dragEnd() {
    window.removeEventListener('mousemove', drag, true);
    window.removeEventListener('touchmove', drag, true);
    window.onmouseup = null;
  }

  function handleResize() {
    const el = document.getElementById(target);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (windows[target]) {
        windows[target].size = {
          height: `${rect.height}px`,
          width: `${rect.width}px`,
        };
        saveWindows();
      }
    }
  }

  function cleanup() {
    const el = document.getElementById(target);
    // el.removeEventListener("resize", handleResize);
    const handleEl = document.getElementById(handle);
    handleEl.removeEventListener('mousedown', dragStart, true);
    handleEl.removeEventListener('touchstart', dragStart, true);
  }

  const handleEl = document.getElementById(handle);
  handleEl.addEventListener('mousedown', dragStart, true);
  handleEl.addEventListener('touchstart', dragStart, true);

  const el = document.getElementById(target);
  new ResizeObserver(handleResize).observe(el);
  el.onmousedown = onFocus;

  return cleanup;
}
