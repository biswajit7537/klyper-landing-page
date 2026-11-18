(function () {
  var list = document.getElementById("contactFaqList");
  if (!list) return;

  var items = Array.prototype.slice.call(list.querySelectorAll(".contact-faq__item"));

  items.forEach(function (item) {
    var trigger = item.querySelector(".contact-faq__trigger");
    if (!trigger) return;

    trigger.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");

      items.forEach(function (other) {
        other.classList.remove("is-open");
        var otherTrigger = other.querySelector(".contact-faq__trigger");
        if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
})();
