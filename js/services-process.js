(function () {
  "use strict";

  var rowConnector = document.querySelector(".svc-process__row-connector");
  if (!rowConnector) return;

  if (!("IntersectionObserver" in window)) {
    rowConnector.classList.add("is-animate");
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          rowConnector.classList.add("is-animate");
          observer.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(rowConnector);
})();
