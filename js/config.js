/* ============================================================
   LA SANTA — CONFIGURACIÓN
   Este es el ÚNICO archivo que necesitas editar para poner
   la landing en producción. Cambia los datos y listo.
   ============================================================ */

window.LA_SANTA = {
  /* --- Contacto ---------------------------------------------
     WhatsApp: solo números, con código de país, SIN +, sin espacios.
     Chile: 56 + 9 + 8 dígitos  →  ejemplo: "56912345678"
  ----------------------------------------------------------- */
  whatsapp: "56988996199",
  telefono: "+56 9 8899 6199",
  correoBar: "bar.lasanta.pm@gmail.com",

  /* --- Guardado de reservas en Google Sheets ----------------
     Pega acá la URL que te da Apps Script al publicar el script
     (termina en /exec). Mientras esté vacía, el formulario sigue
     funcionando por WhatsApp / Instagram como antes.
     Instrucciones completas en apps-script/INSTRUCCIONES.md
  ----------------------------------------------------------- */
  hojaUrl: "https://script.google.com/macros/s/AKfycbyEYDdZRhWXuQdjIMnM4HLVnC78sPdV6wFjvf-8NU2-BiiAZgiZDgZrRtK1ozFDiO8z/exec",

  /* --- Redes sociales --------------------------------------
     Deja "" en las que no tengan: el botón desaparece solo.
     (Facebook se quitó a propósito; ver el README si algún día
      quieren volver a sumarlo.)
  ----------------------------------------------------------- */
  instagram: "https://www.instagram.com/bar.lasantapm/",
  tiktok: "", // pega la URL y el botón aparece solo

  /* --- Ubicación ------------------------------------------- */
  direccion: "Egaña 121, Puerto Montt",
  maps: "https://maps.app.goo.gl/2uDXzxT6aX11jRHz7",

  /* --- Horarios (se imprimen tal cual en la sección Visítanos) --- */
  horarios: [
    { dia: "Lunes a Jueves", horas: "18:00 – 02:00" },
    { dia: "Viernes",        horas: "18:00 – 04:00" },
    { dia: "Sábado",         horas: "19:00 – 04:00" },
    { dia: "Domingo",        horas: "Cerrado", cerrado: true }
  ],

  /* --- Feed de Instagram -----------------------------------
     La sección "Lo último en Instagram" usa Behold (behold.so),
     que se conecta a la cuenta y refresca el feed solo.

     Pega acá el ID del feed que te da Behold en "Embed Code".
     Mientras esté vacío, la sección muestra una invitación a
     seguir el perfil en vez de un hueco. Ver el README.
  ----------------------------------------------------------- */
  instagramFeedId: "02fkCGEWuTb0kVOEzBqy",

  /* --- Santos Palitos Libres (sushi libre) -----------------
     Si algún día abren un segundo turno, agrégalo al array
     "turnos" y el formulario lo toma solo.
  ----------------------------------------------------------- */
  buffet: {
    dias: "Todos los jueves",
    /* diaSemana: 0=domingo, 1=lunes ... 4=jueves ... 6=sábado.
       Si lo defines, el formulario rechaza fechas que no sean ese día.
       Ponlo en null si algún día el buffet se hace en varios días.     */
    diaSemana: 4,
    turnos: ["19:00 – 21:00"],
    duracion: "2 horas",
    anticipoHoras: 24, // aviso de anticipación mínima para reservar

    /* Tarifas. "valor" es lo que se muestra; "monto" se usa para
       estimar el total en el mensaje de WhatsApp (0 = gratis).    */
    precios: [
      { quien: "Adultos",              valor: "$9.990", monto: 9990 },
      { quien: "Niños de 7 a 12 años", valor: "$7.990", monto: 7990 },
      { quien: "Niños hasta 6 años",   valor: "Gratis", monto: 0 }
    ]
  },

  /* --- La carta --------------------------------------------
     Las páginas se muestran en el visor en este orden. Para
     actualizar la carta: reemplaza los .jpg de assets/carta/
     y el PDF, manteniendo los mismos nombres.
  ----------------------------------------------------------- */
  carta: {
    pdf: "assets/carta/carta-la-santa.pdf",
    paginas: [
      "Cócteles La Santa",
      "Happy Hour",
      "Sin alcohol y cócteles",
      "Destilados, vinos y clásicos",
      "Cervezas, botellas y litros",
      "Santa Pizza",
      "Santa Comida",
      "Santa Burger XXVI",
      "Santa Gula",
      "Holy Signature (sushi)"
    ]
  },

  /* --- Reservas -------------------------------------------- */
  reservas: {
    minPersonas: 1,
    maxPersonas: 30,
    horaApertura: "18:00",
    horaCierre: "02:00",

    /* Última hora a la que se puede reservar una mesa (días sin buffet).
       Los días de sushi libre mandan los turnos de "buffet.turnos". */
    horaMaxReserva: "22:00",

    /* Cuánto se guarda la mesa si el grupo llega atrasado. */
    esperaHasta: "22:30",

    /* Hora tope para pedir la cortesía del día (solo mesa diaria).
       Si la reserva es más tarde que esto, la casilla se bloquea sola. */
    topeCortesia: "22:30"
  }
};
