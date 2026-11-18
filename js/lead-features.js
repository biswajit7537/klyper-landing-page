/* Lead Management — Key Features infinite carousel */
(function () {
  var root = document.querySelector("[data-lead-features]");
  if (!root) return;

  var viewport = root.querySelector("[data-lead-feat-viewport]");
  var track = root.querySelector("[data-lead-feat-track]");
  var prevBtn = root.querySelector("[data-lead-feat-prev]");
  var nextBtn = root.querySelector("[data-lead-feat-next]");
  if (!viewport || !track || !prevBtn || !nextBtn) return;

  var busy = false;
  var autoTimer = null;
  var autoDelay = 3600;
  var hovered = false;
  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var pointerId = null;
  var startX = 0;
  var deltaX = 0;
  var dragging = false;

  function gapPx() {
    var styles = window.getComputedStyle(track);
    return parseFloat(styles.columnGap || styles.gap) || 24;
  }

  function stepSize() {
    var first = track.querySelector(".lead-feat");
    if (!first) return 0;
    return first.getBoundingClientRect().width + gapPx();
  }

  function slide(direction) {
    if (busy) return;
    var cards = track.querySelectorAll(".lead-feat");
    if (cards.length < 2) return;

    var distance = stepSize();
    if (!distance) return;

    if (reduceMotion) {
      if (direction > 0) track.appendChild(cards[0]);
      else track.insertBefore(cards[cards.length - 1], cards[0]);
      track.style.transform = "translate3d(0,0,0)";
      return;
    }

    busy = true;
    var ease = "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)";

    if (direction < 0) {
      track.insertBefore(cards[cards.length - 1], cards[0]);
      track.style.transition = "none";
      track.style.transform = "translate3d(-" + distance + "px,0,0)";
      void track.offsetWidth;
      track.style.transition = ease;
      track.style.transform = "translate3d(0,0,0)";
    } else {
      track.style.transition = ease;
      track.style.transform = "translate3d(-" + distance + "px,0,0)";
    }

    var finish = function () {
      if (direction > 0) {
        var first = track.querySelector(".lead-feat");
        if (first) track.appendChild(first);
      }
      track.style.transition = "none";
      track.style.transform = "translate3d(0,0,0)";
      void track.offsetWidth;
      track.style.transition = "";
      busy = false;
    };

    var onEnd = function (event) {
      if (event.target !== track || event.propertyName !== "transform") return;
      track.removeEventListener("transitionend", onEnd);
      finish();
    };

    track.addEventListener("transitionend", onEnd);
    window.setTimeout(function () {
      if (!busy) return;
      track.removeEventListener("transitionend", onEnd);
      finish();
    }, 780);
  }

  function stopAuto() {
    if (autoTimer) {
      window.clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function startAuto() {
    stopAuto();
    if (reduceMotion || hovered || document.hidden) return;
    autoTimer = window.setInterval(function () {
      slide(1);
    }, autoDelay);
  }

  function restartAuto() {
    stopAuto();
    startAuto();
  }

  prevBtn.addEventListener("click", function () {
    slide(-1);
    restartAuto();
  });

  nextBtn.addEventListener("click", function () {
    slide(1);
    restartAuto();
  });

  root.addEventListener("mouseenter", function () {
    hovered = true;
    stopAuto();
  });

  root.addEventListener("mouseleave", function () {
    hovered = false;
    startAuto();
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopAuto();
    else startAuto();
  });

  function onPointerDown(event) {
    if (busy || event.button === 2) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    deltaX = 0;
    dragging = true;
    viewport.classList.add("is-dragging");
    stopAuto();
    try {
      viewport.setPointerCapture(pointerId);
    } catch (e) {}
  }

  function onPointerMove(event) {
    if (!dragging || event.pointerId !== pointerId) return;
    deltaX = event.clientX - startX;
    if (Math.abs(deltaX) > 6 && !reduceMotion) {
      track.style.transition = "none";
      track.style.transform = "translate3d(" + deltaX * 0.55 + "px,0,0)";
    }
  }

  function onPointerUp(event) {
    if (!dragging || event.pointerId !== pointerId) return;
    dragging = false;
    viewport.classList.remove("is-dragging");
    try {
      viewport.releasePointerCapture(pointerId);
    } catch (e) {}
    pointerId = null;

    track.style.transition = "";
    track.style.transform = "translate3d(0,0,0)";

    var threshold = Math.min(72, stepSize() * 0.22);
    if (Math.abs(deltaX) > threshold) {
      slide(deltaX < 0 ? 1 : -1);
    }
    deltaX = 0;
    startAuto();
  }

  viewport.addEventListener("pointerdown", onPointerDown);
  viewport.addEventListener("pointermove", onPointerMove);
  viewport.addEventListener("pointerup", onPointerUp);
  viewport.addEventListener("pointercancel", onPointerUp);

  viewport.addEventListener(
    "touchmove",
    function (event) {
      if (dragging && Math.abs(deltaX) > 8) event.preventDefault();
    },
    { passive: false }
  );

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      track.style.transition = "none";
      track.style.transform = "translate3d(0,0,0)";
      void track.offsetWidth;
      track.style.transition = "";
      restartAuto();
    }, 150);
  });

  startAuto();
})();
