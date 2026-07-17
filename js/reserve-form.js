(() => {
  const form = document.querySelector(".contact-form");
  const status = document.querySelector(".form-status");
  const dateField = document.querySelector("#contact-date");

  if (!form || !status) return;

  if (dateField) {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
    dateField.min = localToday;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    status.hidden = false;
    status.focus();
  });
})();
