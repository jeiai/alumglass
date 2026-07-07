const form = document.querySelector("[data-quote-form]");
const statusNode = document.querySelector("[data-form-status]");
const productSelect = document.querySelector("[data-product-select]");
const widthInput = document.querySelector("[data-width-input]");
const heightInput = document.querySelector("[data-height-input]");
const quantityInput = document.querySelector("[data-quantity-input]");
const markupInput = document.querySelector("[data-markup-input]");
const hardwareInput = document.querySelector("[data-hardware-input]");
const includeHardwareInput = document.querySelector("[data-include-hardware]");
const freeTypeInput = document.querySelector("[data-free-type-input]");
const freeMeasuresInput = document.querySelector("[data-free-measures-input]");
const freeAmountInput = document.querySelector("[data-free-amount-input]");
const autoRows = document.querySelectorAll("[data-auto-row]");
const freeRows = document.querySelectorAll("[data-free-row]");
const addItemButton = document.querySelector("[data-add-item]");
const resetItemButton = document.querySelector("[data-reset-item]");
const copyQuoteButton = document.querySelector("[data-copy-quote]");
const downloadPdfButton = document.querySelector("[data-download-pdf]");
const clearQuoteButton = document.querySelector("[data-clear-quote]");
const previewTotal = document.querySelector("[data-preview-total]");
const previewBreakdown = document.querySelector("[data-preview-breakdown]");
const previewSource = document.querySelector("[data-preview-source]");
const templateNote = document.querySelector("[data-template-note]");
const itemsTable = document.querySelector("[data-items-table]");
const grandTotalNode = document.querySelector("[data-grand-total]");

const money = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0
});

const messages = {
  valueMissing: "Este campo es obligatorio.",
  typeMismatch: "Revisa el formato de este dato.",
  patternMismatch: "Usa un teléfono válido.",
  rangeUnderflow: "Usa un valor mayor.",
  tooShort: "Agrega un poco mas de informacion."
};

const quoteItems = [];
const freeQuoteId = "cotizacionLibre";

function positive(value) {
  return Math.max(Number(value) || 0, 0);
}

function cmToMeters(value) {
  return positive(value) / 100;
}

function profileLine(material, centimeters, barLengthMeters, unitCost) {
  const meters = cmToMeters(centimeters);
  const tramos = barLengthMeters ? meters / barLengthMeters : 0;
  const cost = tramos * unitCost;
  return { material, meters, tramos, unitCost, cost };
}

function directLine(material, quantity, unitCost, unitLabel = "pza") {
  const amount = positive(quantity);
  return {
    material,
    meters: amount,
    tramos: amount,
    unitCost,
    unitLabel,
    cost: amount * unitCost
  };
}

function glassLine(material, squareMeters, unitCost) {
  const meters = positive(squareMeters);
  return {
    material,
    meters,
    tramos: meters / 4.32,
    unitCost,
    unitLabel: "m2",
    cost: meters * unitCost
  };
}

function calculateWindowNational2({ width, height, includeHardware, hardware }) {
  const fixedWidth = positive((width - 16) / 2);
  const leafWidthTotal = fixedWidth * 2;
  const cercoTotal = positive(height - 3) + positive(height - 4);
  const jambaTotal = width + positive(height - 2) * 2;
  const mosqVertical = positive(height - 2) * 2;
  const mosqHorizontal = positive((width - 3) / 2) * 2;
  const glassM2 = (width * height) / 10000;

  const lines = [
    profileLine("CABEZAL", leafWidthTotal, 6.1, 369),
    profileLine("ZOCLO PUERTA", leafWidthTotal, 6.1, 678),
    profileLine("CERCO 610", cercoTotal, 6.1, 345),
    profileLine("TRASLAPE 460", cercoTotal, 6.1, 373),
    profileLine("JAMBA C/MOSQ", jambaTotal, 6.1, 725),
    profileLine("RIEL S/MOSQ", width, 6.1, 410),
    profileLine("ADAPTADOR MOSQ", width, 6.1, 196),
    profileLine("VERTICAL 460", mosqVertical, 4.6, 346),
    profileLine("HORIZONTAL", mosqHorizontal, 6.1, 406),
    glassLine("VIDRIO", glassM2, 400)
  ];

  if (includeHardware) lines.push(directLine("HERRAJES", 1, hardware || 500));
  return lines;
}

function calculateWindowNational3({ width, height, includeHardware, hardware }) {
  const fixedWidth = positive((width - 18) / 2);
  const leafWidthTotal = fixedWidth * 2;
  const cercoTotal = positive(height - 3) + positive(height - 4);
  const jambaTotal = width + positive(height - 2) * 2;
  const mosqVertical = positive(height - 2) * 2;
  const mosqHorizontal = positive((width - 3) / 2) * 2;
  const glassM2 = (width * height) / 10000;

  const lines = [
    profileLine("INTERMEDIO", leafWidthTotal, 6.1, 463),
    profileLine("ZOCLO PUERTA", leafWidthTotal, 6.1, 890),
    profileLine("CERCO", cercoTotal, 6.1, 611),
    profileLine("TRASLAPE", cercoTotal, 6.1, 675),
    profileLine("JAMBA C/MOSQ", jambaTotal, 6.1, 912),
    profileLine("RIEL S/MOSQ", width, 6.1, 540),
    profileLine("ADAPTADOR MOSQ", width, 6.1, 190),
    profileLine("VERTICAL 610", mosqVertical, 6.1, 458),
    profileLine("HORIZONTAL", mosqHorizontal, 6.1, 406),
    glassLine("VIDRIO", glassM2, 400)
  ];

  if (includeHardware) lines.push(directLine("HERRAJES", 1, hardware || 500));
  return lines;
}

function calculateEuropeanWindow({ width, height, includeHardware, hardware }) {
  const glassM2 = (width * height) / 10000;
  const lines = [
    profileLine("HOJA PERIMETRAL", width * 2 + height * 4, 6, 1340),
    profileLine("HOJA MOSQ", width + height * 2, 6, 1300),
    profileLine("RIEL", width * 2 + height * 2, 6, 1540),
    profileLine("TRASLAPE", height * 2, 6, 400),
    glassLine("VIDRIO", glassM2, 350)
  ];

  if (includeHardware) lines.push(directLine("HERRAJE", 1, hardware || 1000));
  return lines;
}

function calculateLightDoor({ width, height, includeHardware, hardware }) {
  const batienteVertical = positive(height - 1.3);
  const batienteHorizontal = width;
  const cerco = positive(height - 2.8);
  const zoclo = positive(width - 13.8);

  const lines = [
    profileLine("BATIENTE", batienteHorizontal + batienteVertical * 2, 6.1, 400),
    profileLine("CERCO", cerco * 2, 4.5, 611),
    profileLine("ZOCLO", zoclo * 3, 6.1, 890),
    directLine("DUELA", (height / 12) * width / 610, 700, "pza")
  ];

  if (includeHardware) lines.push(directLine("HERRAJES", 1, hardware || 500));
  return lines;
}

function calculateProjectionWindow({ width, height, includeHardware, hardware }) {
  const frameWidth = positive(width - 5);
  const frameHeight = positive(height - 5);
  const glassM2 = (frameWidth * frameHeight) / 10000;
  const lines = [
    profileLine("MARCO OVALADO", frameWidth * 2 + frameHeight * 2, 6.1, 610),
    profileLine("CONTRA MARCO #35", width * 2 + height * 2, 6.1, 590),
    glassLine("VIDRIO / PLASTICO", glassM2, 350)
  ];

  if (includeHardware) lines.push(directLine("HERRAJES", 1, hardware || 700));
  return lines;
}

const templates = {
  [freeQuoteId]: {
    name: "Cotización libre",
    source: "Importe manual",
    note: "Captura el tipo de trabajo, las medidas y el monto final de la partida.",
    isFreeQuote: true
  },
  nacional2: {
    name: 'Ventana nacional 2"',
    source: 'Hoja Excel: nacional 2"',
    note: "Usa cabezal, zoclo, cerco, traslape, mosquitero y vidrio. Margen base del Excel: 100%.",
    defaultMarkup: 100,
    defaultHardware: 500,
    includeHardwareDefault: false,
    calculate: calculateWindowNational2
  },
  nacional3: {
    name: 'Ventana nacional 3"',
    source: 'Hoja Excel: nacional 3"',
    note: "Usa perfiles de 3 pulgadas, mosquitero, vidrio y herraje fijo. Margen base del Excel: 100%.",
    defaultMarkup: 100,
    defaultHardware: 500,
    includeHardwareDefault: true,
    calculate: calculateWindowNational3
  },
  europea1400: {
    name: "Ventana europea S1400",
    source: "Hoja Excel: ventana europea s1400",
    note: "Usa hoja perimetral, hoja mosquitero, riel, traslape, vidrio y herraje. Margen base del Excel: 85%.",
    defaultMarkup: 85,
    defaultHardware: 1000,
    includeHardwareDefault: true,
    calculate: calculateEuropeanWindow
  },
  puertaLigera3: {
    name: 'Puerta ligera 3"',
    source: 'Hoja Excel: puerta ligera s3"',
    note: "Usa batiente, cerco, zoclo, duela y herrajes. El Excel duplica el subtotal como margen/precio final.",
    defaultMarkup: 100,
    defaultHardware: 500,
    includeHardwareDefault: true,
    calculate: calculateLightDoor
  },
  proyeccion: {
    name: "Ventana de proyección",
    source: "Hoja Excel: ventana proyección",
    note: "Usa marco ovalado, contra marco, vidrio/plástico y herrajes. El Excel duplica el subtotal como margen/precio final.",
    defaultMarkup: 100,
    defaultHardware: 700,
    includeHardwareDefault: true,
    calculate: calculateProjectionWindow
  }
};

function fieldMessage(field) {
  if (field.validity.valueMissing) return messages.valueMissing;
  if (field.validity.typeMismatch) return messages.typeMismatch;
  if (field.validity.patternMismatch) return messages.patternMismatch;
  if (field.validity.rangeUnderflow) return messages.rangeUnderflow;
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

function currentInput() {
  const template = templates[productSelect?.value];
  const freeType = freeTypeInput?.value.trim() || "";
  const freeMeasures = freeMeasuresInput?.value.trim() || "";
  const freeAmount = positive(freeAmountInput?.value);
  const width = positive(widthInput?.value);
  const height = positive(heightInput?.value);
  const quantity = Math.max(parseInt(quantityInput?.value, 10) || 1, 1);
  const markup = positive(markupInput?.value);
  const includeHardware = Boolean(includeHardwareInput?.checked);
  const hardware = positive(hardwareInput?.value);
  return { template, freeType, freeMeasures, freeAmount, width, height, quantity, markup, includeHardware, hardware };
}

function calculateCurrent() {
  const input = currentInput();
  if (!input.template) return null;

  if (input.template.isFreeQuote) {
    if (!input.freeType || !input.freeMeasures || !input.freeAmount) return null;
    return {
      ...input,
      template: { ...input.template, name: input.freeType },
      width: input.freeMeasures,
      height: "",
      quantity: 1,
      lines: [],
      material: input.freeAmount,
      labor: 0,
      total: input.freeAmount,
      isFreeQuote: true
    };
  }

  if (!input.width || !input.height) return null;

  const singleLines = input.template.calculate(input);
  const singleMaterial = singleLines.reduce((sum, line) => sum + line.cost, 0);
  const material = singleMaterial * input.quantity;
  const labor = material * (input.markup / 100);
  const total = material + labor;
  const lines = singleLines.map((line) => ({
    ...line,
    meters: line.meters * input.quantity,
    tramos: line.tramos * input.quantity,
    cost: line.cost * input.quantity
  }));

  return { ...input, lines, material, labor, total };
}

function formatMeasure(line) {
  if (line.unitLabel === "m2") return `${line.meters.toFixed(2)} m2`;
  if (line.unitLabel === "pza") return `${line.tramos.toFixed(2)} pza`;
  return `${line.meters.toFixed(2)} m / ${line.tramos.toFixed(2)} tramos`;
}

function renderPreview() {
  const result = calculateCurrent();
  if (!result) {
    if (previewTotal) previewTotal.textContent = money.format(0);
    if (previewBreakdown) previewBreakdown.innerHTML = '<tr><td colspan="3">Selecciona producto y medidas.</td></tr>';
    if (previewSource) previewSource.textContent = "Basado en la plantilla seleccionada.";
    if (templateNote) templateNote.textContent = "Selecciona un producto para ver su lógica de cálculo.";
    return;
  }

  previewTotal.textContent = money.format(result.total);
  previewSource.textContent = result.template.source;
  templateNote.textContent = result.template.note;
  previewBreakdown.innerHTML = `
    <tr>
      <td>${result.template.name}</td>
      <td>${result.isFreeQuote ? result.width : `${result.width} x ${result.height} cm, cant. ${result.quantity}`}</td>
      <td><strong>${money.format(result.total)}</strong></td>
    </tr>
  `;
}

function renderItems() {
  const total = quoteItems.reduce((sum, item) => sum + item.total, 0);
  if (grandTotalNode) grandTotalNode.textContent = money.format(total);

  if (!itemsTable) return;
  if (!quoteItems.length) {
    itemsTable.innerHTML = '<tr><td colspan="5">Aun no hay partidas agregadas.</td></tr>';
    return;
  }

  itemsTable.innerHTML = quoteItems
    .map((item, index) => `
      <tr>
        <td><strong>${item.template.name}</strong><small>${item.notes || ""}</small></td>
        <td>${item.isFreeQuote ? item.width : `${item.width} x ${item.height} cm`}</td>
        <td>${item.isFreeQuote ? "-" : item.quantity}</td>
        <td><strong>${money.format(item.total)}</strong></td>
        <td><button class="table-action" type="button" data-remove-item="${index}">Quitar</button></td>
      </tr>
    `)
    .join("");
}

function populateProducts() {
  if (!productSelect) return;
  const freeTemplate = templates[freeQuoteId];
  const automaticTemplates = Object.entries(templates).filter(([id]) => id !== freeQuoteId);
  productSelect.insertAdjacentHTML(
    "beforeend",
    `
      <optgroup label="Cotización libre">
        <option value="${freeQuoteId}">${freeTemplate.name}</option>
      </optgroup>
      <optgroup label="Plantillas automáticas">
        ${automaticTemplates.map(([id, template]) => `<option value="${id}">${template.name}</option>`).join("")}
      </optgroup>
    `
  );
}

function applyTemplateDefaults() {
  const template = templates[productSelect?.value];
  if (!template) {
    autoRows.forEach((row) => { row.hidden = false; });
    freeRows.forEach((row) => { row.hidden = true; });
    [widthInput, heightInput, quantityInput, markupInput].forEach((field) => {
      if (field) field.required = true;
    });
    [freeTypeInput, freeMeasuresInput, freeAmountInput].forEach((field) => {
      if (field) field.required = false;
    });
    return;
  }
  const isFreeQuote = Boolean(template.isFreeQuote);
  autoRows.forEach((row) => { row.hidden = isFreeQuote; });
  freeRows.forEach((row) => { row.hidden = !isFreeQuote; });
  [widthInput, heightInput, quantityInput, markupInput].forEach((field) => {
    if (field) field.required = !isFreeQuote;
  });
  [freeTypeInput, freeMeasuresInput, freeAmountInput].forEach((field) => {
    if (field) field.required = isFreeQuote;
    if (!isFreeQuote) {
      field?.setAttribute("aria-invalid", "false");
      const error = document.querySelector(`[data-error-for="${field?.name}"]`);
      if (error) error.textContent = "";
    }
  });
  if (isFreeQuote) {
    if (previewSource) previewSource.textContent = template.source;
    if (templateNote) templateNote.textContent = template.note;
    renderPreview();
    return;
  }
  if (markupInput) markupInput.value = template.defaultMarkup;
  if (hardwareInput) hardwareInput.value = template.defaultHardware;
  if (includeHardwareInput) includeHardwareInput.checked = template.includeHardwareDefault;
}

function resetItemForm() {
  const template = templates[productSelect?.value];
  if (template?.isFreeQuote) {
    if (freeTypeInput) freeTypeInput.value = "";
    if (freeMeasuresInput) freeMeasuresInput.value = "";
    if (freeAmountInput) freeAmountInput.value = "";
  } else {
    if (widthInput) widthInput.value = 100;
    if (heightInput) heightInput.value = 100;
    if (quantityInput) quantityInput.value = 1;
  }
  if (template) applyTemplateDefaults();
  renderPreview();
}

function addCurrentItem() {
  const template = templates[productSelect?.value];
  const requiredFields = template?.isFreeQuote
    ? [productSelect, freeTypeInput, freeMeasuresInput, freeAmountInput].filter(Boolean)
    : [productSelect, widthInput, heightInput, quantityInput, markupInput].filter(Boolean);
  const isValid = requiredFields.map(setFieldError).every(Boolean);
  const result = calculateCurrent();
  if (!isValid || !result) {
    statusNode.className = "form-status error";
    statusNode.textContent = template?.isFreeQuote
      ? "Revisa tipo de trabajo, medidas y monto antes de agregar."
      : "Revisa producto, medidas, cantidad y margen antes de agregar.";
    return;
  }

  quoteItems.push({
    ...result,
    notes: result.isFreeQuote ? "" : document.querySelector("#descripcion")?.value.trim() || ""
  });
  renderItems();
  statusNode.className = "form-status success";
  statusNode.textContent = "Partida agregada.";
}

function buildQuoteText() {
  const data = Object.fromEntries(new FormData(form).entries());
  const total = quoteItems.reduce((sum, item) => sum + item.total, 0);
  const lines = quoteItems.map((item, index) => (
    `${index + 1}. ${item.template.name} ${item.isFreeQuote ? item.width : `${item.width} x ${item.height} cm, cant. ${item.quantity}`}: ${money.format(item.total)}`
  ));

  return [
    "Cotización Alumglass",
    `Cliente: ${data.nombre || ""}`,
    `Teléfono: ${data.telefono || ""}`,
    data.correo ? `Correo: ${data.correo}` : "",
    data.obra ? `Obra: ${data.obra}` : "",
    "",
    ...lines,
    "",
    `Total: ${money.format(total)}`,
    data.comentarios ? `Comentarios: ${data.comentarios}` : ""
  ].filter(Boolean).join("\n");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function quoteDocumentHtml() {
  const data = Object.fromEntries(new FormData(form).entries());
  const total = quoteItems.reduce((sum, item) => sum + item.total, 0);
  const today = new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const logoUrl = new URL("../assets/images/logo-alumglass.png", window.location.href).href;

  const rows = quoteItems.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>
        <strong>${escapeHtml(item.template.name)}</strong>
        ${item.notes ? `<small>${escapeHtml(item.notes)}</small>` : ""}
      </td>
      <td>${escapeHtml(item.isFreeQuote ? item.width : `${item.width} x ${item.height} cm`)}</td>
      <td>${escapeHtml(item.isFreeQuote ? "-" : item.quantity)}</td>
      <td><strong>${money.format(item.total)}</strong></td>
    </tr>
  `).join("");

  return `<!doctype html>
    <html lang="es-MX">
      <head>
        <meta charset="utf-8">
        <title>Cotización Alumglass</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 28px;
            color: #10212a;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.45;
          }
          header {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            align-items: flex-start;
            padding-bottom: 18px;
            border-bottom: 3px solid #087f8c;
          }
          .logo { width: 230px; height: auto; }
          .company { text-align: right; font-size: 13px; color: #465962; }
          h1 { margin: 24px 0 8px; font-size: 28px; }
          h2 { margin: 0 0 10px; font-size: 15px; color: #087f8c; text-transform: uppercase; }
          .meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin: 18px 0;
          }
          .box {
            padding: 14px;
            border: 1px solid #d9e3e6;
            border-radius: 8px;
          }
          .box p { margin: 4px 0; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
            font-size: 12px;
          }
          th, td {
            padding: 9px 8px;
            border-bottom: 1px solid #d9e3e6;
            vertical-align: top;
            text-align: left;
          }
          th {
            color: #465962;
            background: #edf3f4;
            text-transform: uppercase;
            font-size: 11px;
          }
          td:nth-child(4),
          td:nth-child(5) { text-align: right; }
          small { display: block; margin-top: 3px; color: #5d6b72; }
          .total {
            display: flex;
            justify-content: flex-end;
            margin-top: 22px;
            font-size: 24px;
            font-weight: 800;
            color: #087f8c;
          }
          .notes {
            margin-top: 22px;
            padding-top: 14px;
            border-top: 1px solid #d9e3e6;
            color: #465962;
          }
          @page { margin: 14mm; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <header>
          <img class="logo" src="${logoUrl}" alt="AlumGlass Aluminios y Vidrios">
          <div class="company">
            <strong>Alumglass</strong><br>
            Aluminios y vidrios<br>
            Cel / WhatsApp: +52 351 313 2925<br>
            Calle Salamanca 138, Santa Ana Pacueco, Guanajuato
          </div>
        </header>

        <h1>Cotización</h1>
        <div class="meta">
          <section class="box">
            <h2>Cliente</h2>
            <p><strong>Nombre:</strong> ${escapeHtml(data.nombre || "Sin nombre")}</p>
            <p><strong>Teléfono:</strong> ${escapeHtml(data.telefono || "Sin teléfono")}</p>
            <p><strong>Correo:</strong> ${escapeHtml(data.correo || "No indicado")}</p>
            <p><strong>Obra:</strong> ${escapeHtml(data.obra || "No indicada")}</p>
          </section>
          <section class="box">
            <h2>Datos de cotización</h2>
            <p><strong>Fecha:</strong> ${escapeHtml(today)}</p>
            <p><strong>Contacto Alumglass:</strong> +52 351 313 2925</p>
            <p><strong>WhatsApp:</strong> +52 351 313 2925</p>
          </section>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Medidas</th>
              <th>Cant.</th>
              <th>Importe</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <div class="total">Total: ${money.format(total)}</div>
        ${data.comentarios ? `<div class="notes"><strong>Comentarios:</strong><br>${escapeHtml(data.comentarios).replaceAll("\n", "<br>")}</div>` : ""}
      </body>
    </html>`;
}

function downloadQuotePdf() {
  const requiredFields = Array.from(form.elements).filter((field) => field.required);
  const isValid = requiredFields.map(setFieldError).every(Boolean);

  if (!isValid) {
    statusNode.className = "form-status error";
    statusNode.textContent = "Revisa los campos obligatorios antes de generar el PDF.";
    return;
  }

  if (!quoteItems.length) {
    statusNode.className = "form-status error";
    statusNode.textContent = "Agrega al menos una partida para descargar el PDF.";
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    statusNode.className = "form-status error";
    statusNode.textContent = "El navegador bloqueó la ventana del PDF. Permite ventanas emergentes para este sitio.";
    return;
  }

  printWindow.document.open();
  printWindow.document.write(quoteDocumentHtml());
  printWindow.document.close();
  printWindow.addEventListener("load", () => {
    printWindow.focus();
    printWindow.print();
  });

  statusNode.className = "form-status success";
  statusNode.textContent = "Se abrió la cotización para guardarla como PDF.";
}

async function copyQuote() {
  if (!quoteItems.length) {
    statusNode.className = "form-status error";
    statusNode.textContent = "Agrega al menos una partida para copiar el resumen.";
    return;
  }

  try {
    await navigator.clipboard.writeText(buildQuoteText());
    statusNode.className = "form-status success";
    statusNode.textContent = "Resumen copiado al portapapeles.";
  } catch (error) {
    statusNode.className = "form-status error";
    statusNode.textContent = "No se pudo copiar automáticamente. Selecciona el resumen manualmente.";
  }
}

function clearQuote() {
  quoteItems.splice(0, quoteItems.length);
  renderItems();
  statusNode.className = "form-status success";
  statusNode.textContent = "Cotización vaciada.";
}

function prepareQuote(event) {
  event.preventDefault();
  const requiredFields = Array.from(form.elements).filter((field) => field.required);
  const isValid = requiredFields.map(setFieldError).every(Boolean);

  if (!isValid) {
    statusNode.className = "form-status error";
    statusNode.textContent = "Revisa los campos obligatorios.";
    return;
  }

  if (!quoteItems.length) {
    statusNode.className = "form-status error";
    statusNode.textContent = "Agrega al menos una partida a la cotización.";
    return;
  }

  localStorage.setItem("alumglass-last-quote", buildQuoteText());
  statusNode.className = "form-status success";
  statusNode.textContent = "Cotización preparada y guardada localmente en este navegador.";
}

if (form && statusNode) {
  populateProducts();
  renderPreview();
  renderItems();

  form.addEventListener("input", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement) {
      setFieldError(event.target);
      renderPreview();
    }
  });

  productSelect?.addEventListener("change", () => {
    applyTemplateDefaults();
    renderPreview();
  });

  addItemButton?.addEventListener("click", addCurrentItem);
  resetItemButton?.addEventListener("click", resetItemForm);
  copyQuoteButton?.addEventListener("click", copyQuote);
  downloadPdfButton?.addEventListener("click", downloadQuotePdf);
  clearQuoteButton?.addEventListener("click", clearQuote);

  itemsTable?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-item]");
    if (!button) return;
    quoteItems.splice(Number(button.dataset.removeItem), 1);
    renderItems();
  });

  form.addEventListener("submit", prepareQuote);
}
