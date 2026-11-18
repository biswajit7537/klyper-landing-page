document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // --- Light theme only ---
  var root = document.documentElement;
  root.setAttribute("data-theme", "light");
  try {
    localStorage.setItem("klyper-theme", "light");
  } catch (e) {}
  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.hidden = true;
    themeToggle.setAttribute("aria-hidden", "true");
  }

  // --- Header scroll effect ---
  var header = document.getElementById("header");
  var heroContent = document.querySelector(".hero-content");
  var heroSection =
    document.querySelector(".hero") ||
    document.querySelector(".about-hero") ||
    document.querySelector(".products-hero") ||
    document.querySelector(".hrms-hero") ||
    document.querySelector(".inventory-hero") ||
    document.querySelector(".lead-hero") ||
    document.querySelector(".ecommerce-hero") ||
    document.querySelector(".contact-hero") ||
    document.querySelector(".services-hero") ||
    document.querySelector(".legal-hero");

  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;
    var heroH = heroSection ? heroSection.offsetHeight : 160;

    if (header) {
      if (scrollY > Math.max(heroH * 0.35, 24)) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    if (heroContent && heroSection && heroSection.classList.contains("hero")) {
      var progress = Math.min(scrollY / heroH, 1);
      heroContent.style.opacity = String(1 - progress * 1.2);
      heroContent.style.transform = "translateY(" + scrollY * 0.3 + "px)";
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // --- Mobile menu ---
  var mobileToggle = document.getElementById("mobileToggle");
  var navLinks = document.getElementById("navLinks");
  var navBackdrop = document.querySelector(".nav-backdrop");

  if (!navBackdrop) {
    navBackdrop = document.createElement("div");
    navBackdrop.className = "nav-backdrop";
    navBackdrop.setAttribute("aria-hidden", "true");
    document.body.appendChild(navBackdrop);
  }

  function closeMobileNav() {
    if (!navLinks || !mobileToggle) return;
    navLinks.classList.remove("open");
    mobileToggle.classList.remove("active");
    mobileToggle.setAttribute("aria-expanded", "false");
    if (header) header.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    document.body.style.overflow = "";
    navBackdrop.classList.remove("is-visible");
    document.querySelectorAll(".has-dropdown.open").forEach(function (item) {
      item.classList.remove("open");
    });
  }

  function openMobileNav() {
    if (!navLinks || !mobileToggle) return;
    navLinks.classList.add("open");
    mobileToggle.classList.add("active");
    mobileToggle.setAttribute("aria-expanded", "true");
    if (header) header.classList.add("is-open");
    document.body.classList.add("nav-open");
    document.body.style.overflow = "hidden";
    navBackdrop.classList.add("is-visible");
  }

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", function () {
      if (navLinks.classList.contains("open")) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    navBackdrop.addEventListener("click", closeMobileNav);

    navLinks.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 1024 && !link.closest(".has-dropdown")) {
          closeMobileNav();
        }
      });
    });

    navLinks.querySelectorAll(".nav-mobile-cta a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });
  }

  document.querySelectorAll(".has-dropdown > .nav-link").forEach(function (trigger) {
    trigger.addEventListener("click", function (e) {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        e.stopPropagation();
        var parent = trigger.parentElement;
        var wasOpen = parent.classList.contains("open");
        document.querySelectorAll(".has-dropdown.open").forEach(function (item) {
          if (item !== parent) item.classList.remove("open");
        });
        parent.classList.toggle("open", !wasOpen);
      }
    });
  });

  document.querySelectorAll(".dropdown a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 1024) {
        closeMobileNav();
      }
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1024) {
      closeMobileNav();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMobileNav();
  });

  // --- Section reveals ---
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el, index) {
      el.style.transitionDelay = (index % 5) * 100 + "ms";
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // --- Stat counters ---
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var countObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseInt(el.getAttribute("data-count"), 10) || 0;
          var start = performance.now();
          function tick(now) {
            var p = Math.min((now - start) / 1200, 1);
            el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          obs.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) {
      countObserver.observe(el);
    });
  }

  // --- Why Choose: dynamic continuous connector geometry ---
  (function initWhyConnectors() {
    var diagram = document.querySelector("[data-why-diagram]");
    if (!diagram) return;

    var svg = diagram.querySelector("[data-why-connectors]");
    var pathsG = diagram.querySelector("[data-why-paths]");
    var flowsG = diagram.querySelector("[data-why-flows]");
    var nodesG = diagram.querySelector("[data-why-nodes]");
    var hub = diagram.querySelector(".why-hub");
    var leftCards = diagram.querySelectorAll(".why-col--left .why-card");
    var rightCards = diagram.querySelectorAll(".why-col--right .why-card");
    if (!svg || !pathsG || !flowsG || !nodesG || !hub) return;

    var mq = window.matchMedia("(max-width: 1024px)");
    var rafId = 0;

    function rel(rect, base) {
      return {
        left: rect.left - base.left,
        top: rect.top - base.top,
        width: rect.width,
        height: rect.height,
        right: rect.right - base.left,
        bottom: rect.bottom - base.top,
        cx: rect.left - base.left + rect.width / 2,
        cy: rect.top - base.top + rect.height / 2
      };
    }

    function curvePath(x0, y0, x1, y1) {
      var dx = x1 - x0;
      var dy = y1 - y0;
      // Smooth cubic: start tangent follows circle radial, end stays horizontal to card
      var c1x = x0 + dx * 0.38;
      var c1y = y0 + dy * 0.08;
      var c2x = x1 - dx * 0.38;
      var c2y = y1;
      return (
        "M " +
        x0.toFixed(2) +
        " " +
        y0.toFixed(2) +
        " C " +
        c1x.toFixed(2) +
        " " +
        c1y.toFixed(2) +
        ", " +
        c2x.toFixed(2) +
        " " +
        c2y.toFixed(2) +
        ", " +
        x1.toFixed(2) +
        " " +
        y1.toFixed(2)
      );
    }

    function build() {
      if (mq.matches) {
        pathsG.innerHTML = "";
        flowsG.innerHTML = "";
        nodesG.innerHTML = "";
        return;
      }

      var base = diagram.getBoundingClientRect();
      var w = Math.max(1, diagram.clientWidth);
      var h = Math.max(1, diagram.clientHeight);
      svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      svg.setAttribute("width", String(w));
      svg.setAttribute("height", String(h));

      // Connect to the solid central circle (halo), not decorative outer rings
      var hubRing = hub.querySelector(".why-hub__halo") || hub;
      var hubBox = rel(hubRing.getBoundingClientRect(), base);
      var hubR = Math.min(hubBox.width, hubBox.height) / 2;

      var links = [];
      leftCards.forEach(function (card) {
        links.push({ card: card, side: "left" });
      });
      rightCards.forEach(function (card) {
        links.push({ card: card, side: "right" });
      });

      var pathHtml = "";
      var flowHtml = "";
      var nodeHtml = "";

      links.forEach(function (link) {
        var cardBox = rel(link.card.getBoundingClientRect(), base);
        // Card endpoint: inner edge toward hub, vertical center
        var cardX = link.side === "left" ? cardBox.right : cardBox.left;
        var cardY = cardBox.cy;

        var dx = cardX - hubBox.cx;
        var dy = cardY - hubBox.cy;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        // Hub endpoint: on central circle edge, aimed at card centerline
        var hubX = hubBox.cx + (dx / dist) * hubR;
        var hubY = hubBox.cy + (dy / dist) * hubR;

        var d = curvePath(hubX, hubY, cardX, cardY);

        pathHtml +=
          '<path class="why-connectors__path" pathLength="1" d="' + d + '" />';
        flowHtml +=
          '<path class="why-connectors__flow" pathLength="1" d="' + d + '" />';
        // Glowing dots only at endpoints
        nodeHtml +=
          '<circle class="why-connectors__node why-connectors__node--hub" cx="' +
          hubX.toFixed(2) +
          '" cy="' +
          hubY.toFixed(2) +
          '" r="4" />';
        nodeHtml +=
          '<circle class="why-connectors__node why-connectors__node--card" cx="' +
          cardX.toFixed(2) +
          '" cy="' +
          cardY.toFixed(2) +
          '" r="3.5" />';
      });

      pathsG.innerHTML = pathHtml;
      flowsG.innerHTML = flowHtml;
      nodesG.innerHTML = nodeHtml;
    }

    function schedule() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(function () {
        rafId = 0;
        build();
      });
    }

    build();
    window.addEventListener("resize", schedule);
    if (mq.addEventListener) mq.addEventListener("change", schedule);
    else if (mq.addListener) mq.addListener(schedule);

    if ("ResizeObserver" in window) {
      var ro = new ResizeObserver(schedule);
      var hubHalo = hub.querySelector(".why-hub__halo");
      ro.observe(diagram);
      ro.observe(hub);
      if (hubHalo) ro.observe(hubHalo);
    }

    // Rebuild once fonts/images settle so hub/card boxes are final
    window.addEventListener("load", schedule);
    setTimeout(schedule, 120);
    setTimeout(schedule, 400);
  })();

  // --- Industries carousel ---
  (function initIndustriesCarousel() {
    var root = document.querySelector("[data-industries-carousel]");
    if (!root) return;

    var track = root.querySelector("[data-industries-track]");
    var prevBtn = document.querySelector("[data-industries-prev]");
    var nextBtn = document.querySelector("[data-industries-next]");
    if (!track || !prevBtn || !nextBtn) return;

    var busy = false;
    var reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function gapPx() {
      var styles = window.getComputedStyle(track);
      return parseFloat(styles.columnGap || styles.gap) || 22;
    }

    function stepSize() {
      var first = track.querySelector(".industry-card");
      if (!first) return 0;
      return first.getBoundingClientRect().width + gapPx();
    }

    function slide(direction) {
      if (busy) return;
      var cards = track.querySelectorAll(".industry-card");
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
        // Force reflow, then animate back to 0
        void track.offsetWidth;
        track.style.transition = ease;
        track.style.transform = "translate3d(0,0,0)";
      } else {
        track.style.transition = ease;
        track.style.transform = "translate3d(-" + distance + "px,0,0)";
      }

      var onEnd = function (event) {
        if (event.target !== track || event.propertyName !== "transform") return;
        track.removeEventListener("transitionend", onEnd);
        if (direction > 0) {
          var first = track.querySelector(".industry-card");
          if (first) track.appendChild(first);
        }
        track.style.transition = "none";
        track.style.transform = "translate3d(0,0,0)";
        void track.offsetWidth;
        track.style.transition = "";
        busy = false;
      };

      track.addEventListener("transitionend", onEnd);
      window.setTimeout(function () {
        if (!busy) return;
        track.removeEventListener("transitionend", onEnd);
        if (direction > 0) {
          var firstCard = track.querySelector(".industry-card");
          if (firstCard) track.appendChild(firstCard);
        }
        track.style.transition = "none";
        track.style.transform = "translate3d(0,0,0)";
        void track.offsetWidth;
        track.style.transition = "";
        busy = false;
      }, 700);
    }

    prevBtn.addEventListener("click", function () {
      slide(-1);
    });

    nextBtn.addEventListener("click", function () {
      slide(1);
    });
  })();

  // --- Floating call + WhatsApp ---
  (function () {
    if (document.querySelector(".float-actions")) return;

    var wrap = document.createElement("div");
    wrap.className = "float-actions";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Quick contact");

    var call = document.createElement("a");
    call.className = "float-actions__btn call-float";
    call.href = "tel:+917855079698";
    call.setAttribute("aria-label", "Call Klyper at +91 78550 79698");
    call.title = "Call +91 78550 79698";
    call.innerHTML =
      '<span class="float-actions__label">Call</span>' +
      '<svg class="float-actions__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.4 21 3 13.6 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.02l-2.2 2.19z"/>' +
      "</svg>";

    var wa = document.createElement("a");
    wa.className = "float-actions__btn wa-float";
    wa.href = "https://wa.me/917855079698";
    wa.target = "_blank";
    wa.rel = "noopener noreferrer";
    wa.setAttribute("aria-label", "Chat with Klyper on WhatsApp at +91 78550 79698");
    wa.title = "Chat on WhatsApp";
    wa.innerHTML =
      '<span class="float-actions__label">WhatsApp</span>' +
      '<svg class="float-actions__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>' +
      "</svg>";

    wrap.appendChild(call);
    wrap.appendChild(wa);
    document.body.appendChild(wrap);
  })();
});
