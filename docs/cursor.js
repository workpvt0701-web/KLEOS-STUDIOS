/* =====================================================================
   KLEOS — cursor.js
   Draws the custom gold cursor: a small dot that tracks the mouse exactly,
   and a larger ring that follows with a slight lag and expands on hover.
   Touch devices are skipped (they keep the normal finger interaction).
   ===================================================================== */
(function () {
  // Only run on devices with a real mouse pointer.
  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hasMouse) return;

  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;   // true mouse position
  let ringX = 0,  ringY = 0;    // ring's lagging position

  // Update the target position whenever the mouse moves.
  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // dot tracks instantly
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Animation loop — eases the ring toward the mouse for a "lag" feel.
  function loop() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(loop);
  }
  loop();

  // Expand the ring over clickable things.
  const clickables = 'a, button, .clickable, input, textarea, .work-card, .filter-tab';
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(clickables)) ring.classList.add('hovered');
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(clickables)) ring.classList.remove('hovered');
  });
})();
