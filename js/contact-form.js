(function () {
  var form = document.getElementById("contactForm");
  if (!form) return;

  var statusEl = document.getElementById("contactFormStatus");
  var submitBtn = document.getElementById("contactFormSubmit");
  var submitLabel = submitBtn
    ? submitBtn.querySelector(".contact-form__submit-label")
    : null;
  var defaultLabel = submitLabel ? submitLabel.textContent : "Send Message";

  function setStatus(type, message) {
    if (!statusEl) return;
    statusEl.hidden = false;
    statusEl.className = "contact-form__status is-" + type;
    statusEl.textContent = message;
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle("is-loading", isLoading);
    if (submitLabel) {
      submitLabel.textContent = isLoading ? "Sending..." : defaultLabel;
    }
  }

  // Support classic redirect flow from the previous site (?success=true)
  try {
    var params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setStatus(
        "success",
        "Thank you! Your message has been sent. We'll get back to you within 24 hours."
      );
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  } catch (e) {}

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setLoading(true);
    if (statusEl) {
      statusEl.hidden = true;
      statusEl.textContent = "";
      statusEl.className = "contact-form__status";
    }

    var formData = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok && result.data && result.data.success) {
          setStatus(
            "success",
            "Thank you! Your message has been sent. We'll get back to you within 24 hours."
          );
          form.reset();
          return;
        }

        var errorMessage =
          (result.data && (result.data.message || result.data.error)) ||
          "Something went wrong. Please try again or email info@klypertechnology.com.";
        setStatus("error", errorMessage);
      })
      .catch(function () {
        setStatus(
          "error",
          "Unable to send right now. Please check your connection or email info@klypertechnology.com."
        );
      })
      .finally(function () {
        setLoading(false);
      });
  });
})();
