/* ============================================================
   LA SANTA — Recepción de reservas
   Pega este archivo completo en Extensiones → Apps Script
   de tu hoja de cálculo. Instrucciones: INSTRUCCIONES.md
   ============================================================ */

/* --- Lo único que quizá quieras cambiar -------------------- */
var CORREO_BAR  = "barlasantapmc@gmail.com"; // a dónde responde el cliente si contesta
var NOMBRE_HOJA = "Reservas";                // pestaña donde se escriben las filas

var COLUMNAS = [
  "Recibida", "Tipo", "Fecha", "Hora", "Personas",
  "Nombre", "Correo", "Teléfono",
  "Cortesía del día", "Cumpleañero/a", "Fecha cumpleaños", "Decoración",
  "Detalle", "Total estimado", "Comentarios"
];

/* --- Punto de entrada: el sitio hace POST acá -------------- */
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);

    // Trampa anti-spam: si viene llena, es un robot. Respondemos ok
    // para que no reintente, pero no guardamos nada.
    if (d.trampa) return json({ ok: true });

    if (!d.nombre || !d.correo) {
      return json({ ok: false, error: "Faltan datos obligatorios" });
    }

    guardarFila(d);
    enviarCorreoCliente(d);

    return json({ ok: true });
  } catch (err) {
    // Queda en Ejecuciones del editor de Apps Script por si hay que revisar
    console.error(err);
    return json({ ok: false, error: String(err) });
  }
}

/* Permite abrir la URL en el navegador para comprobar que está viva */
function doGet() {
  return json({ ok: true, mensaje: "Reservas de La Santa en línea" });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* --- Escribir la fila -------------------------------------- */
function guardarFila(d) {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = libro.getSheetByName(NOMBRE_HOJA);

  // La primera vez creamos la pestaña y los encabezados solos
  if (!hoja) {
    hoja = libro.insertSheet(NOMBRE_HOJA);
    hoja.appendRow(COLUMNAS);
    var cab = hoja.getRange(1, 1, 1, COLUMNAS.length);
    cab.setFontWeight("bold").setBackground("#1B1817").setFontColor("#E6CB8B");
    hoja.setFrozenRows(1);
  }

  hoja.appendRow([
    new Date(),
    d.tipo || "",
    d.fechaTexto || d.fecha || "",
    d.hora || "",
    d.personas || "",
    d.nombre || "",
    d.correo || "",
    d.telefono || "",
    d.cortesia || "",
    d.cumpleanero || "",
    d.fechaCumple || "",
    d.decoracion || "",
    d.detalle || "",
    d.total || "",
    d.comentarios || ""
  ]);
}

/* --- Correo al cliente ------------------------------------- */
function enviarCorreoCliente(d) {
  var nombre   = primerNombre(d.nombre);
  var fecha    = d.fechaTexto || d.fecha || "";
  var hora     = d.hora || "";
  var personas = d.personas || "";

  /* Datos extra que solo aparecen si corresponden. Si prefieres el
     correo más escueto, borra este bloque y la variable "extras". */
  var lineas = [];
  if (d.cortesia === "Sí")   lineas.push(["🎁", "Cortesía del día", "Solicitada"]);
  if (d.cumpleanero)         lineas.push(["🎂", "Cumpleañero/a", d.cumpleanero]);
  if (d.decoracion === "Sí") lineas.push(["🎈", "Decoración", "Solicitada"]);
  if (d.detalle)             lineas.push(["✦", "Incluye", d.detalle]);
  if (d.total)               lineas.push(["💰", "Total estimado", d.total]);

  var extras = lineas.length
    ? '<div style="margin-top:22px;padding-top:20px;border-top:1px solid rgba(201,162,74,.18)">' +
        lineas.map(function (l) {
          return '<p style="margin:0 0 10px;color:#A79E92;font-size:14px;line-height:1.5">' +
            l[0] + ' <strong style="color:#F4EDE1;font-weight:500">' + escapar(l[1]) +
            ':</strong> ' + escapar(l[2]) + '</p>';
        }).join('') +
      '</div>'
    : '';

  var dato = function (icono, etiqueta, valor) {
    return '<tr>' +
      '<td style="padding:11px 0;font-size:15px;color:#A79E92;width:46%">' +
        icono + ' <strong style="color:#F4EDE1;font-weight:500">' + etiqueta + '</strong>' +
      '</td>' +
      '<td style="padding:11px 0;font-size:16px;color:#E6CB8B;font-weight:500">' +
        escapar(valor) + '</td>' +
    '</tr>';
  };

  var html =
  '<div style="background:#0B0A09;padding:32px 18px;font-family:Helvetica,Arial,sans-serif">' +
    '<div style="max-width:520px;margin:0 auto;background:#131110;border:1px solid rgba(201,162,74,.22);border-radius:14px;overflow:hidden">' +

      '<div style="padding:32px 30px 24px;text-align:center;border-bottom:1px solid rgba(201,162,74,.18)">' +
        '<p style="margin:0 0 10px;color:#C9A24A;font-size:11px;letter-spacing:3px;text-transform:uppercase">Bar La Santa</p>' +
        '<h1 style="margin:0;color:#F4EDE1;font-size:25px;font-weight:400">' +
          '¡Hola, ' + escapar(nombre) + '! 👋</h1>' +
      '</div>' +

      '<div style="padding:28px 30px">' +
        '<p style="margin:0 0 24px;color:#A79E92;font-size:15px;line-height:1.65">' +
          '¡Tenemos todo listo! Tu reserva en <strong style="color:#F4EDE1">Bar La Santa</strong> ' +
          'ha sido confirmada correctamente. 🙌' +
        '</p>' +

        '<table style="width:100%;border-collapse:collapse;background:rgba(201,162,74,.05);' +
               'border:1px solid rgba(201,162,74,.2);border-radius:10px">' +
          '<tr><td colspan="2" style="height:8px"></td></tr>' +
          dato('📅', 'Fecha', fecha) +
          dato('🕐', 'Hora', hora) +
          dato('👥', 'Personas', personas) +
          dato('📍', 'Dónde', 'Egaña 121, Puerto Montt') +
          '<tr><td colspan="2" style="height:8px"></td></tr>' +
        '</table>' +

        extras +

        '<p style="margin:24px 0 16px;color:#A79E92;font-size:14px;line-height:1.65">' +
          'Te recomendamos llegar a la hora indicada para mantener tu mesa disponible.' +
        '</p>' +
        '<p style="margin:0 0 24px;color:#A79E92;font-size:14px;line-height:1.65">' +
          'Si necesitas <strong style="color:#F4EDE1">modificar o cancelar tu reserva</strong>, ' +
          'contáctanos con anticipación para poder ayudarte.' +
        '</p>' +

        '<p style="margin:0;padding:16px;background:rgba(201,162,74,.08);border-radius:10px;' +
                  'text-align:center;color:#E6CB8B;font-size:15px">' +
          '🔥 <strong>Ahora solo queda venir y disfrutar.</strong>' +
        '</p>' +
      '</div>' +

      '<div style="padding:22px 30px 28px;border-top:1px solid rgba(201,162,74,.18);text-align:center">' +
        '<p style="margin:0 0 12px;color:#F4EDE1;font-size:15px">' +
          '¡Nos vemos en <strong>La Santa</strong>! 🍸</p>' +
        '<p style="margin:0 0 14px;color:#C9A24A;font-size:13px;letter-spacing:1px">Equipo La Santa</p>' +
        '<p style="margin:0;color:#A79E92;font-size:13px">' +
          '+56 9 8899 6199 · ' +
          '<a href="https://www.instagram.com/bar.lasantapm/" style="color:#E6CB8B;text-decoration:none">@bar.lasantapm</a>' +
        '</p>' +
      '</div>' +
    '</div>' +

    '<p style="max-width:520px;margin:16px auto 0;color:#6C645C;font-size:11px;text-align:center;line-height:1.5">' +
      'Recibiste este correo porque reservaste en nuestro sitio. Si no fuiste tú, puedes ignorarlo.' +
    '</p>' +
  '</div>';

  MailApp.sendEmail({
    to: d.correo,
    subject: "¡Tu reserva en La Santa está confirmada! 🍸",
    htmlBody: html,
    body: textoPlano(d),          // respaldo para clientes sin HTML
    name: "Bar La Santa",
    replyTo: CORREO_BAR
  });
}

/* --- Utilidades -------------------------------------------- */
function textoPlano(d) {
  return [
    "¡Hola, " + primerNombre(d.nombre) + "!",
    "",
    "¡Tenemos todo listo! Tu reserva en Bar La Santa ha sido confirmada correctamente.",
    "",
    "Fecha: " + (d.fechaTexto || d.fecha),
    "Hora: " + d.hora,
    "Personas: " + d.personas,
    "Bar La Santa · Egaña 121, Puerto Montt",
    d.cortesia === "Sí" ? "Cortesía del día: solicitada" : "",
    d.cumpleanero ? "Cumpleañero/a: " + d.cumpleanero : "",
    d.decoracion === "Sí" ? "Decoración: solicitada" : "",
    d.detalle ? "Incluye: " + d.detalle : "",
    d.total ? "Total estimado: " + d.total : "",
    "",
    "Te recomendamos llegar a la hora indicada para mantener tu mesa disponible.",
    "Si necesitas modificar o cancelar tu reserva, contáctanos con anticipación.",
    "",
    "Ahora solo queda venir y disfrutar. ¡Nos vemos en La Santa!",
    "",
    "Equipo La Santa",
    "+56 9 8899 6199 · @bar.lasantapm"
  ].filter(String).join("\n");
}

function primerNombre(nombre) {
  return String(nombre || "").trim().split(/\s+/)[0] || "";
}

function escapar(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* --- Para probar sin el sitio ------------------------------
   Selecciona "probar" arriba y dale al play. Escribe una fila
   de prueba y te manda los correos.                          */
function probar() {
  doPost({ postData: { contents: JSON.stringify({
    tipo: "RESERVA DE MESA",
    nombre: "Prueba Interna",
    correo: CORREO_BAR,
    telefono: "+56 9 0000 0000",
    fecha: "2026-08-20",
    fechaTexto: "jueves, 20 de agosto de 2026",
    hora: "21:00",
    personas: "4",
    cortesia: "Sí",
    comentarios: "Fila de prueba, se puede borrar."
  }) } });
}
