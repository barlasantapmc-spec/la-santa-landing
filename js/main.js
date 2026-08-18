/* ============================================================
   LA SANTA — Lógica de la landing
   No necesitas tocar este archivo: los datos van en config.js
   ============================================================ */
(function () {
  "use strict";

  var C = window.LA_SANTA || {};
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 1. Volcar la config en el HTML ---------- */
  var enlaces = {
    instagram: C.instagram,
    facebook:  C.facebook,
    tiktok:    C.tiktok,
    maps:      C.maps,
    whatsapp:  C.whatsapp ? "https://wa.me/" + C.whatsapp : "",
    tel:       C.telefono ? "tel:" + C.telefono.replace(/[^\d+]/g, "") : ""
  };

  $$("[data-link]").forEach(function (a) {
    var url = enlaces[a.dataset.link];
    if (url) { a.href = url; a.hidden = false; }
    else { a.hidden = true; }              // sin dato configurado → se oculta
  });

  $$("[data-telefono]").forEach(function (el) { el.textContent = C.telefono || ""; });
  $$("[data-direccion]").forEach(function (el) { el.textContent = C.direccion || ""; });
  $$("[data-anio]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  var B = C.buffet || {};
  var PRECIOS = B.precios || [];
  $$("[data-buffet-dias]").forEach(function (el) { if (B.dias) el.textContent = B.dias; });

  var listaPrecios = $("[data-buffet-precios]");
  if (listaPrecios && PRECIOS.length) {
    listaPrecios.innerHTML = PRECIOS.map(function (p) {
      var gratis = !p.monto ? " es-gratis" : "";
      return '<li class="' + gratis.trim() + '"><span>' + p.quien +
             '</span><strong>' + p.valor + "</strong></li>";
    }).join("");
  }

  /* ---------- Feed de Instagram (Behold) ----------
     Si no hay ID configurado, no cargamos nada de terceros y
     dejamos la invitación a seguir el perfil.               */
  var feedId = (C.instagramFeedId || "").trim();
  var cajaFeed = $("[data-ig-feed]");
  var cajaFallback = $("[data-ig-fallback]");

  if (feedId && cajaFeed) {
    var widget = document.createElement("behold-widget");
    widget.setAttribute("feed-id", feedId);
    cajaFeed.appendChild(widget);
    cajaFeed.hidden = false;
    if (cajaFallback) cajaFallback.hidden = true;

    var s = document.createElement("script");
    s.type = "module";
    s.src = "https://w.behold.so/widget.js";
    s.onerror = function () {
      // Si Behold no carga (sin red, bloqueador), volvemos a la invitación
      cajaFeed.hidden = true;
      if (cajaFallback) cajaFallback.hidden = false;
    };
    document.head.appendChild(s);
  }

  // El @usuario del pie sale solo de la URL de Instagram
  var pieIG = $("[data-ig-usuario]");
  if (pieIG) {
    var u = (C.instagram || "").replace(/[?#].*$/, "").replace(/\/+$/, "").split("/").pop();
    if (u) pieIG.textContent = "@" + u;
  }

  var listaTurnos = $("[data-buffet-turnos]");
  if (listaTurnos && B.turnos) {
    listaTurnos.innerHTML = B.turnos.map(function (t, i) {
      var etiqueta = B.turnos.length > 1 ? "Turno " + (i + 1) : "Horario";
      return "<li>" + t + " <span>" + etiqueta + "</span></li>";
    }).join("");
  }
  $$("[data-buffet-aviso]").forEach(function (el) {
    el.textContent = "Reserva con al menos " + (B.anticipoHoras || 24) + " horas de anticipación.";
  });

  var selTurno = $("#turno");
  if (selTurno && B.turnos) {
    selTurno.innerHTML = B.turnos.map(function (t) {
      return '<option value="' + t + '">' + t + "</option>";
    }).join("");
  }

  var listaHorarios = $("[data-horarios]");
  if (listaHorarios && C.horarios) {
    listaHorarios.innerHTML = C.horarios.map(function (h) {
      return '<li class="' + (h.cerrado ? "cerrado" : "") + '">' +
             '<span class="dia">' + h.dia + '</span>' +
             '<span class="hs">' + h.horas + "</span></li>";
    }).join("");
  }

  var pers = $("#personas");
  if (pers && C.reservas) {
    pers.min = C.reservas.minPersonas;
    pers.max = C.reservas.maxPersonas;
  }

  /* Ventana horaria para reservar mesa (los días de buffet mandan los turnos) */
  var R = C.reservas || {};
  var HORA_MIN = R.horaApertura || "18:00";
  var HORA_MAX = R.horaMaxReserva || "22:00";

  var inpHora = $("#hora");
  if (inpHora) {
    inpHora.min = HORA_MIN;
    inpHora.max = HORA_MAX;
  }
  $$("[data-hora-ayuda]").forEach(function (el) {
    el.textContent = "Entre " + HORA_MIN + " y " + HORA_MAX +
      (R.esperaHasta ? ". Te esperamos hasta las " + R.esperaHasta + "." : ".");
  });

  /* ---------- 1b. La carta: visor + lightbox ---------- */
  var CARTA = C.carta || {};
  var PAGINAS = CARTA.paginas || [];
  var rutaCarta = function (i, thumb) {
    var n = String(i + 1).padStart(2, "0");
    return "assets/carta/carta-" + n + (thumb ? "-thumb" : "") + ".jpg";
  };

  $$("[data-carta-pdf]").forEach(function (a) {
    if (CARTA.pdf) { a.href = CARTA.pdf; } else { a.hidden = true; }
  });

  var listaPaginas = $("[data-carta-paginas]");
  if (listaPaginas && PAGINAS.length) {
    listaPaginas.innerHTML = PAGINAS.map(function (titulo, i) {
      return '<li><button type="button" data-pagina="' + i + '">' +
             '<img src="' + rutaCarta(i, true) + '" alt="Carta de La Santa, página ' +
             (i + 1) + ": " + titulo + '" loading="lazy">' +
             "<span>" + titulo + "</span></button></li>";
    }).join("");
  }

  var lb      = $("#lightbox"),
      lbImg   = $("#lbImg"),
      lbCap   = $("#lbCap"),
      lbPrev  = $("#lbPrev"),
      lbNext  = $("#lbNext"),
      lbCerrar = $("#lbCerrar");
  var paginaActual = 0, ultimoFoco = null;

  function mostrarPagina(i) {
    paginaActual = Math.min(Math.max(i, 0), PAGINAS.length - 1);
    lbImg.src = rutaCarta(paginaActual, false);
    lbImg.alt = "Carta de La Santa, página " + (paginaActual + 1) + ": " + PAGINAS[paginaActual];
    lbCap.textContent = (paginaActual + 1) + " / " + PAGINAS.length + " · " + PAGINAS[paginaActual];
    lbPrev.disabled = paginaActual === 0;
    lbNext.disabled = paginaActual === PAGINAS.length - 1;
  }

  function abrirLightbox(i) {
    ultimoFoco = document.activeElement;
    mostrarPagina(i);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    lbCerrar.focus();
  }

  function cerrarLightbox() {
    lb.hidden = true;
    document.body.style.overflow = "";
    if (ultimoFoco) ultimoFoco.focus();
  }

  if (listaPaginas) {
    listaPaginas.addEventListener("click", function (e) {
      var b = e.target.closest("[data-pagina]");
      if (b) abrirLightbox(parseInt(b.dataset.pagina, 10));
    });
  }
  if (lb) {
    lbPrev.addEventListener("click", function () { mostrarPagina(paginaActual - 1); });
    lbNext.addEventListener("click", function () { mostrarPagina(paginaActual + 1); });
    lbCerrar.addEventListener("click", cerrarLightbox);
    lb.addEventListener("click", function (e) { if (e.target === lb) cerrarLightbox(); });

    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape")     cerrarLightbox();
      if (e.key === "ArrowLeft")  mostrarPagina(paginaActual - 1);
      if (e.key === "ArrowRight") mostrarPagina(paginaActual + 1);
    });
  }

  /* ---------- 2. Navegación ---------- */
  var nav = $("#nav"), burger = $("#burger"), menu = $("#mobileMenu");

  window.addEventListener("scroll", function () {
    nav.classList.toggle("is-stuck", window.scrollY > 24);
  }, { passive: true });

  function cerrarMenu() {
    menu.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menú");
  }
  burger.addEventListener("click", function () {
    var abierto = burger.getAttribute("aria-expanded") === "true";
    if (abierto) { cerrarMenu(); return; }
    menu.hidden = false;
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Cerrar menú");
  });
  $$("#mobileMenu a").forEach(function (a) { a.addEventListener("click", cerrarMenu); });

  /* ---------- 3. Tabs de reserva ---------- */
  var TIPOS = {
    diaria: {
      titulo: "RESERVA DE MESA",
      nota: "Mesa para la noche. Te guardamos el lugar por 20 minutos desde la hora reservada."
    },
    buffet: {
      titulo: "RESERVA SANTOS PALITOS LIBRES (SUSHI LIBRE)",
      nota: "Sushi libre 2 horas, solo los jueves de 19:00 a 21:00. Los primeros 30 minutos son Rolls Premium. Cupos limitados."
    },
    cumple: {
      titulo: "RESERVA DE CUMPLEAÑOS",
      nota: "Marca los beneficios que quieres activar. Reserva con 48 h de anticipación para dejar todo listo."
    }
  };
  var tipoActual = "diaria";
  var nota = $("#notaTipo");

  function aplicarTipo(tipo) {
    if (!TIPOS[tipo]) tipo = "diaria";
    tipoActual = tipo;

    $$(".tab").forEach(function (t) {
      var on = t.dataset.tab === tipo;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
      if (on) $("#formReserva").setAttribute("aria-labelledby", t.id);
    });

    $$("[data-solo]").forEach(function (el) {
      var visible = el.dataset.solo.split(" ").indexOf(tipo) !== -1;
      el.hidden = !visible;
      // los campos ocultos no deben bloquear el envío
      $$("input,select,textarea", el).forEach(function (f) { f.disabled = !visible; });
    });

    nota.textContent = TIPOS[tipo].nota;

    // El sushi libre es solo un día de la semana: proponemos el próximo.
    var f = $("#fecha");
    if (tipo === "buffet" && B.diaSemana != null && f.value && diaDe(f.value) !== B.diaSemana) {
      f.value = proximoDiaSemana(f.value, B.diaSemana);
    }

    revisarCortesia();
  }

  /* ---------- Cortesía del día (solo mesa diaria) ----------
     Se pide hasta la hora tope. Si la reserva es más tarde, en vez de
     dejar marcar y rechazar después, bloqueamos la casilla y explicamos.  */
  var TOPE = (C.reservas && C.reservas.topeCortesia) || "22:30";
  var chkCortesia = $("#cortesia");
  var notaCortesia = $("#notaCortesia");

  function aMinutos(hhmm) {
    var p = (hhmm || "").split(":");
    if (p.length !== 2) return null;
    var h = +p[0], m = +p[1];
    if (isNaN(h) || isNaN(m)) return null;
    // Después de medianoche cuenta como el día siguiente (01:00 = 25:00)
    return (h < 6 ? h + 24 : h) * 60 + m;
  }

  function cortesiaATiempo() {
    var h = aMinutos($("#hora").value);
    var tope = aMinutos(TOPE);
    return h === null || tope === null || h <= tope;
  }

  function revisarCortesia() {
    if (!chkCortesia || !notaCortesia) return;
    if (tipoActual !== "diaria") return; // fuera de la pestaña lo maneja aplicarTipo

    var aTiempo = cortesiaATiempo();
    chkCortesia.disabled = !aTiempo;
    if (!aTiempo) chkCortesia.checked = false;

    chkCortesia.closest(".check").classList.toggle("is-bloqueado", !aTiempo);
    notaCortesia.classList.toggle("es-aviso", !aTiempo);
    notaCortesia.innerHTML = aTiempo
      ? "Cambia cada semana. Se solicita <strong>hasta las " + TOPE + "</strong>."
      : "La cortesía del día se pide <strong>hasta las " + TOPE + "</strong>. " +
        "Para tu hora ya no alcanza, pero la mesa se reserva igual.";
  }

  var campoHora = $("#hora");
  if (campoHora) campoHora.addEventListener("input", revisarCortesia);

  function proximoDiaSemana(iso, objetivo) {
    var p = iso.split("-");
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    d.setDate(d.getDate() + ((objetivo - d.getDay() + 7) % 7 || 7));
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var dd = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + dd;
  }

  $$(".tab").forEach(function (t) {
    t.addEventListener("click", function () { aplicarTipo(t.dataset.tab); });
  });

  // Botones que saltan al formulario con un tab preseleccionado
  $$("[data-abrir-tab]").forEach(function (b) {
    b.addEventListener("click", function () {
      aplicarTipo(b.dataset.abrirTab);
      setTimeout(function () { $("#nombre").focus({ preventScroll: true }); }, 700);
    });
  });

  aplicarTipo("diaria");

  /* ---------- 3b. Beneficios de cumpleaños por tamaño de grupo ----------
     4        → 1 tabla + 1 trago para el cumpleañero/a
     5 a 9    → 1 tabla cada 4 personas + 1 jarra de mojito
     10 o más → 1 tabla cada 4 personas + Happy Hour especial toda la noche
                + 1 trago de regalo al cumpleañero/a cada 1 hora
  --------------------------------------------------------------------- */
  function beneficiosPara(n) {
    if (!n || n < 4) return [];

    var tablas = Math.floor(n / 4);
    var lista = [tablas === 1 ? "1 tabla de cortesía" : tablas + " tablas de cortesía"];

    if (n === 4) {
      lista.push("1 trago para el cumpleañero/a");
    } else if (n <= 9) {
      lista.push("1 jarra de mojito para la mesa");
    } else {
      lista.push("Happy Hour especial de cumpleaños toda la noche");
      lista.push("1 trago de regalo al cumpleañero/a cada 1 hora");
    }
    return lista;
  }

  var resumen = $("#resumenBeneficios");

  function pintarResumen() {
    if (!resumen) return;
    var n = parseInt(($("#personas").value || "").trim(), 10);
    var lista = beneficiosPara(n);
    var ul = $(".resumen__lista", resumen);

    if (!lista.length) {
      resumen.classList.add("is-vacio");
      $(".resumen__titulo", resumen).textContent = "Beneficios de cumpleaños";
      ul.innerHTML = "<li>Desde 4 personas se activan los beneficios. " +
                     "Ajusta el número de personas para verlos.</li>";
      return;
    }
    resumen.classList.remove("is-vacio");
    $(".resumen__titulo", resumen).textContent =
      "Con " + n + " personas les corresponde";
    ul.innerHTML = lista.map(function (b) { return "<li>" + b + "</li>"; }).join("");
  }

  /* ---------- 3c. Total estimado del sushi libre ---------- */
  var TARIFA_ADULTO = (PRECIOS[0] && PRECIOS[0].monto) || 0;
  var TARIFA_NINO   = (PRECIOS[1] && PRECIOS[1].monto) || 0;

  function pesos(n) { return "$" + n.toLocaleString("es-CL"); }

  function num(id) { return Math.max(0, parseInt($("#" + id).value, 10) || 0); }

  function calcularBuffet() {
    var total = num("personas"), n712 = num("ninos712"), n6 = num("ninos6");
    var adultos = total - n712 - n6;
    return {
      total: total, n712: n712, n6: n6, adultos: adultos,
      excede: adultos < 0,
      monto: Math.max(0, adultos) * TARIFA_ADULTO + n712 * TARIFA_NINO
    };
  }

  function detalleBuffet() {
    var b = calcularBuffet();
    if (b.excede || !b.total) return null;
    var l = [];
    if (b.adultos) l.push(b.adultos + " adulto" + (b.adultos > 1 ? "s" : "") +
                          " × " + pesos(TARIFA_ADULTO) + " = " + pesos(b.adultos * TARIFA_ADULTO));
    if (b.n712)    l.push(b.n712 + " niño" + (b.n712 > 1 ? "s" : "") + " de 7 a 12" +
                          " × " + pesos(TARIFA_NINO) + " = " + pesos(b.n712 * TARIFA_NINO));
    if (b.n6)      l.push(b.n6 + " niño" + (b.n6 > 1 ? "s" : "") + " hasta 6 años · sin costo");
    return { lineas: l, monto: b.monto };
  }

  var resumenBuffet = $("#resumenBuffet");

  function pintarBuffet() {
    if (!resumenBuffet) return;
    var ul = $(".resumen__lista", resumenBuffet);
    var tit = $(".resumen__titulo", resumenBuffet);
    var d = detalleBuffet();

    if (!d) {
      resumenBuffet.classList.add("is-vacio");
      tit.textContent = "Total estimado";
      ul.innerHTML = "<li>Los niños no pueden superar el total de personas.</li>";
      return;
    }
    resumenBuffet.classList.remove("is-vacio");
    tit.textContent = "Total estimado: " + pesos(d.monto);
    ul.innerHTML = d.lineas.map(function (x) { return "<li>" + x + "</li>"; }).join("");
  }

  ["personas", "ninos712", "ninos6"].forEach(function (id) {
    $("#" + id).addEventListener("input", pintarBuffet);
  });

  $("#personas").addEventListener("input", pintarResumen);
  pintarResumen();
  pintarBuffet();

  /* ---------- 4. Fecha mínima = hoy ---------- */
  function hoyISO() {
    var d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }
  var fecha = $("#fecha");
  fecha.min = hoyISO();
  fecha.value = hoyISO();

  /* ---------- 5. Validación + envío a WhatsApp ---------- */
  var form = $("#formReserva");

  function setError(id, msg) {
    var campo = $("#" + id);
    var caja = campo.closest(".field");
    var span = $('[data-error-for="' + id + '"]');
    if (caja) caja.classList.toggle("is-error", !!msg);
    if (span) span.textContent = msg || "";
    return !msg;
  }

  /* canal: "whatsapp" exige teléfono; "instagram" no, porque el bar
     responde por DM y puede que la persona no tenga WhatsApp. */
  function validar(canal) {
    var ok = true;
    var v = function (id) { return ($("#" + id).value || "").trim(); };

    ok = setError("nombre", v("nombre").length < 3 ? "Escribe tu nombre completo." : "") && ok;

    /* El correo es obligatorio salvo cuando la persona elige irse por
       chat: ahí la conversación misma hace de comprobante. */
    var correo = v("correo");
    var correoOk = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(correo);
    var msgCorreo = "";
    if (canal === "correo") {
      msgCorreo = !correo ? "Necesitamos tu correo para enviarte la reserva."
                : !correoOk ? "Ese correo no parece válido. Revísalo." : "";
    } else if (correo && !correoOk) {
      msgCorreo = "Ese correo no parece válido. Revísalo.";
    }
    ok = setError("correo", msgCorreo) && ok;

    var tel = v("telefono").replace(/[^\d]/g, "");
    var msgTel = "";
    if (canal === "whatsapp") {
      msgTel = tel.length < 8 ? "Ingresa un teléfono válido para reservar por WhatsApp." : "";
    } else if (tel.length && tel.length < 8) {
      msgTel = "Ese teléfono parece incompleto. Bórralo o corrígelo.";
    }
    ok = setError("telefono", msgTel) && ok;

    var msgFecha = "";
    if (!v("fecha")) {
      msgFecha = "Elige una fecha.";
    } else if (tipoActual === "buffet" && B.diaSemana != null && diaDe(v("fecha")) !== B.diaSemana) {
      msgFecha = "El sushi libre es solo los jueves. Elige un jueves.";
    }
    ok = setError("fecha", msgFecha) && ok;

    var n = parseInt(v("personas"), 10);
    var min = (C.reservas && C.reservas.minPersonas) || 1;
    var max = (C.reservas && C.reservas.maxPersonas) || 30;
    ok = setError("personas",
      (!n || n < min) ? "Mínimo " + min + " persona(s)." :
      (n > max) ? "Para grupos de más de " + max + " escríbenos por WhatsApp." : ""
    ) && ok;

    if (tipoActual !== "buffet") {
      var h = aMinutos(v("hora"));
      var msgHora = "";
      if (!v("hora")) {
        msgHora = "Elige una hora.";
      } else if (h > aMinutos(HORA_MAX)) {
        msgHora = "La última reserva es a las " + HORA_MAX +
                  ". Si llegas más tarde, escríbenos por WhatsApp.";
      } else if (h < aMinutos(HORA_MIN)) {
        msgHora = "Abrimos a las " + HORA_MIN + ".";
      }
      ok = setError("hora", msgHora) && ok;
    } else {
      ok = setError("ninos712",
        calcularBuffet().excede
          ? "La suma de niños no puede superar el total de personas."
          : ""
      ) && ok;
    }
    return ok;
  }

  function diaDe(iso) {
    var p = iso.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]).getDay(); // 0=domingo … 4=jueves
  }

  function fechaLarga(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return d.toLocaleDateString("es-CL", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
  }

  function armarMensaje() {
    var v = function (id) { var e = $("#" + id); return e ? (e.value || "").trim() : ""; };
    var L = [];

    L.push("*LA SANTA · " + TIPOS[tipoActual].titulo + "*");
    L.push("");
    L.push("👤 Nombre: " + v("nombre"));
    if (v("correo")) L.push("✉️ Correo: " + v("correo"));
    if (v("telefono")) L.push("📞 Teléfono: " + v("telefono"));
    L.push("📅 Fecha: " + fechaLarga(v("fecha")));

    if (tipoActual === "buffet") {
      L.push("🕘 Turno: " + v("turno"));
    } else {
      L.push("🕘 Hora: " + v("hora"));
    }
    L.push("👥 Personas: " + v("personas"));

    if (tipoActual === "diaria" && chkCortesia && chkCortesia.checked) {
      L.push("🎁 Solicita la cortesía del día");
    }

    if (tipoActual === "buffet") {
      var d = detalleBuffet();
      if (d) {
        L.push("");
        L.push("*🍣 Santos Palitos Libres (sushi libre):*");
        d.lineas.forEach(function (x) { L.push("• " + x); });
        L.push("*Total estimado: " + pesos(d.monto) + "*");
      }
    }

    if (tipoActual === "cumple") {
      if (v("cumpleanero")) L.push("🎂 Cumpleañero/a: " + v("cumpleanero"));
      if (v("fechaCumple")) L.push("🗓️ Fecha de cumpleaños: " + fechaLarga(v("fechaCumple")));
      if ($("#decoracion").checked) L.push("🎈 Decoración de cumpleaños: SÍ");

      var bens = beneficiosPara(parseInt(v("personas"), 10));
      if (bens.length) {
        L.push("");
        L.push("*Beneficios que corresponden:*");
        bens.forEach(function (b) { L.push("• " + b); });
      }
    }

    if (v("comentarios")) {
      L.push("");
      L.push("📝 Comentarios: " + v("comentarios"));
    }

    L.push("");
    L.push("_Enviado desde la web de La Santa_");
    return L.join("\n");
  }

  /* Abrir un enlace externo sin quedar a merced del bloqueador de pop-ups:
     si window.open devuelve null, navegamos en la misma pestaña. */
  function abrirEnlace(url) {
    var w;
    try { w = window.open(url, "_blank", "noopener"); } catch (err) { w = null; }
    if (!w) window.location.href = url;
  }

  var aviso = $("#avisoCanal");
  var copiaCaja = $("#copiaManual");
  var copiaTexto = $("#copiaTexto");

  function avisar(texto, tipo) {
    if (!aviso) return;
    aviso.textContent = texto;
    aviso.className = "aviso-canal" + (tipo ? " es-" + tipo : "");
    aviso.hidden = !texto;
  }

  function limpiarAvisos() {
    avisar("");
    if (copiaCaja) copiaCaja.hidden = true;
  }

  function irAlPrimerError() {
    var primero = $(".field.is-error input, .field.is-error select");
    if (!primero) return;
    primero.focus({ preventScroll: true });
    primero.scrollIntoView({ behavior: "smooth", block: "center" });
    avisar("Revisa los campos marcados en rojo y vuelve a intentarlo.", "error");
  }

  /* ---------- Envío principal: guardar en la hoja ----------
     Manda los datos al Apps Script, que escribe la fila y envía
     el correo al cliente. Si algo falla, ofrecemos WhatsApp para
     que la reserva no se pierda.                              */
  var btnEnviar = $("#btnEnviar");
  var respaldo = $("#respaldo");
  var enviando = false;

  function datosReserva() {
    var v = function (id) { return ($("#" + id).value || "").trim(); };
    var d = {
      tipo: TIPOS[tipoActual].titulo,
      nombre: v("nombre"),
      correo: v("correo"),
      telefono: v("telefono"),
      fecha: v("fecha"),
      fechaTexto: fechaLarga(v("fecha")),
      personas: v("personas"),
      comentarios: v("comentarios"),
      mensaje: armarMensaje(),
      trampa: v("sitioWeb") // los robots la llenan; las personas no la ven
    };

    if (tipoActual === "buffet") {
      d.hora = v("turno");
      var det = detalleBuffet();
      d.detalle = det ? det.lineas.join(" · ") : "";
      d.total = det ? pesos(det.monto) : "";
    } else {
      d.hora = v("hora");
    }

    if (tipoActual === "diaria") {
      d.cortesia = chkCortesia && chkCortesia.checked ? "Sí" : "No";
    }

    if (tipoActual === "cumple") {
      d.cumpleanero = v("cumpleanero");
      d.fechaCumple = v("fechaCumple");
      d.decoracion = $("#decoracion").checked ? "Sí" : "No";
      d.detalle = beneficiosPara(parseInt(v("personas"), 10)).join(" · ");
    }
    return d;
  }

  function cargando(on) {
    enviando = on;
    btnEnviar.disabled = on;
    $(".btn__txt", btnEnviar).textContent = on ? "Enviando…" : "Enviar reserva";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (enviando) return;
    limpiarAvisos();
    if (!validar("correo")) return irAlPrimerError();

    // Sin hoja configurada todavía: nos vamos por WhatsApp como antes.
    if (!C.hojaUrl) {
      enviarPorWhatsapp();
      return;
    }

    cargando(true);
    avisar("Enviando tu reserva…", "cargando");

    fetch(C.hojaUrl, {
      method: "POST",
      // text/plain evita el preflight de CORS, que Apps Script no responde
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(datosReserva())
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res || !res.ok) throw new Error(res && res.error ? res.error : "sin respuesta");
        cargando(false);
        exito();
      })
      .catch(function () {
        cargando(false);
        avisar("No pudimos guardar tu reserva. Envíala por WhatsApp y la tomamos igual.", "error");
        if (respaldo) respaldo.hidden = false;
      });
  });

  function exito() {
    avisar("¡Listo! Tu reserva quedó confirmada. " +
           "Te enviamos el detalle a tu correo.", "ok");
    if (respaldo) respaldo.hidden = true;
    btnEnviar.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* --- Respaldo 1: WhatsApp (el mensaje va escrito) --- */
  function enviarPorWhatsapp() {
    limpiarAvisos();
    if (!validar("whatsapp")) return irAlPrimerError();

    if (!C.whatsapp) {
      avisar("Falta configurar el número de WhatsApp en js/config.js", "error");
      return;
    }
    abrirEnlace("https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(armarMensaje()));
    avisar("Abrimos WhatsApp con tu mensaje listo. Solo tienes que enviarlo.", "ok");
  }

  var btnWA = $("#btnWhatsapp");
  if (btnWA) btnWA.addEventListener("click", enviarPorWhatsapp);

  // Los canales de chat siempre disponibles si no hay hoja configurada
  if (!C.hojaUrl && respaldo) respaldo.hidden = false;

  /* --- Canal 2: DM de Instagram ---------------------------------
     Instagram no deja prellenar el mensaje por URL (a diferencia de
     wa.me), así que lo copiamos al portapapeles y abrimos el chat
     directo para que la persona solo pegue y envíe.              */
  var btnIG = $("#btnInstagram");
  var IG_USUARIO = (C.instagram || "").replace(/[?#].*$/, "").replace(/\/+$/, "").split("/").pop();

  if (btnIG) {
    if (!IG_USUARIO) {
      btnIG.hidden = true;
    } else {
      btnIG.addEventListener("click", function () {
        limpiarAvisos();
        if (!validar("instagram")) return irAlPrimerError();

        var mensaje = armarMensaje();

        // El copiado se lanza dentro del gesto del clic; la ventana también,
        // sin esperar la promesa, para que no la bloquee el navegador.
        var copiado = null;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            copiado = navigator.clipboard.writeText(mensaje);
          }
        } catch (err) { copiado = null; }

        abrirEnlace("https://ig.me/m/" + IG_USUARIO);

        if (copiado) {
          copiado.then(function () {
            avisar("Mensaje copiado. Pégalo en el chat de Instagram que acabamos de abrir.", "ok");
          }).catch(mostrarCopiaManual);
        } else {
          mostrarCopiaManual();
        }

        function mostrarCopiaManual() {
          if (!copiaCaja || !copiaTexto) return;
          copiaTexto.value = mensaje;
          copiaCaja.hidden = false;
          copiaTexto.focus();
          copiaTexto.select();
          avisar("No pudimos copiarlo solos: copia el texto de abajo y pégalo en el chat.", "error");
        }
      });
    }
  }

  // Limpiar el error de un campo apenas el usuario lo corrige
  $$("#formReserva input, #formReserva select").forEach(function (f) {
    f.addEventListener("input", function () {
      var caja = f.closest(".field");
      if (caja && caja.classList.contains("is-error")) {
        caja.classList.remove("is-error");
        var span = $('[data-error-for="' + f.id + '"]');
        if (span) span.textContent = "";
      }
    });
  });

  /* ---------- 6. Animación de entrada ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  }
})();
