const form = document.querySelector("[data-quote-form]");
const statusNode = document.querySelector("[data-form-status]");

const messages = {
  valueMissing: "Este campo es obligatorio.",
  typeMismatch: "Revisa el formato de este dato.",
  patternMismatch: "Usa un telefono valido.",
  tooShort: "Agrega un poco mas de informacion."
};

function fieldMessage(field) {
  if (field.validity.valueMissing) return messages.valueMissing;
  if (field.validity.typeMismatch) return messages.typeMismatch;
  if (field.validity.patternMismatch) return messages.patternMismatch;
  if (field.validity.tooShort) return messages.tooShort;
  return "";
}

function setFieldError(field) {
  const error = document.querySelector(`[data-error-for="${field.name}"]`);
  const message = fieldMessage(field);
  if (error) error.textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");
  return !message;
}

function serializeQuote(formElement) {
  return Object.fromEntries(new FormData(formElement).entries());
}

async function sendQuote(payload) {
  // Replace this with fetch("/api/quotes", { method: "POST", body: JSON.stringify(payload) })
  // when the backend or email service endpoint is available.
  await new Promise((resolve) => window.setTimeout(resolve, 450));
  return { ok: true, payload };
}

if (form && statusNode) {
  form.addEventListener("input", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement) {
      setFieldError(event.target);
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fields = Array.from(form.elements).filter((field) => "validity" in field);
    const isValid = fields.map(setFieldError).every(Boolean);

    statusNode.className = "form-status";
    statusNode.textContent = "";

    if (!isValid) {
      statusNode.classList.add("error");
      statusNode.textContent = "Revisa los campos marcados antes de continuar.";
      return;
    }

    try {
      const response = await sendQuote(serializeQuote(form));
      if (!response.ok) throw new Error("No se pudo preparar la solicitud.");
      statusNode.classList.add("success");
      statusNode.textContent = "Solicitud lista. Ya puede conectarse al backend o servicio de correo.";
      form.reset();
      fields.forEach((field) => field.removeAttribute("aria-invalid"));
    } catch (error) {
      statusNode.classList.add("error");
      statusNode.textContent = "Ocurrio un error. Intenta nuevamente o revisa la conexion con el servicio.";
    }
  });
}
