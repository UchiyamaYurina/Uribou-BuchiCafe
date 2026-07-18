(() => {
  const form = document.querySelector(".contact-form");
  const status = document.querySelector(".form-status");
  const dateField = document.querySelector("#contact-date");
  const purposeField = document.querySelector("#contact-purpose");
  const reservationFields = [
    dateField,
    document.querySelector("#contact-time"),
    document.querySelector("#contact-guests")
  ].filter(Boolean);

  if (!form || !status) return;

  if (dateField) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const localTomorrow = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
    dateField.min = localTomorrow;
  }

  const updateReservationRequirements = () => {
    const isReservation = purposeField?.value === "reserve";
    reservationFields.forEach((field) => {
      field.required = isReservation;
      field.setAttribute("aria-required", String(isReservation));
    });
  };

  purposeField?.addEventListener("change", updateReservationRequirements);
  updateReservationRequirements();

  form.addEventListener("input", () => {
    status.hidden = true;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      form.querySelector(":invalid")?.focus();
      return;
    }

    status.hidden = false;
    status.focus();
  });
})();
