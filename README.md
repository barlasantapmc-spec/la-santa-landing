# La Santa — Landing page

Sitio estático (HTML + CSS + JS). Sin dependencias, sin build, sin servidor.
Se abre haciendo doble clic en `index.html` y se publica gratis en Netlify, Vercel o GitHub Pages.

```
la-santa-landing/
├── index.html          ← estructura y textos
├── css/styles.css      ← diseño
├── js/config.js        ← ⭐ LO ÚNICO QUE DEBES EDITAR
├── js/main.js          ← lógica (no hace falta tocarlo)
└── assets/
    ├── img/            ← logo y fotos (ya optimizadas para web)
    └── carta/          ← 10 páginas de la carta + el PDF original
```

---

## 1. Antes de publicar — edita `js/config.js`

Los datos son **de ejemplo**. Cambia como mínimo:

| Campo | Qué poner | Ojo con esto |
|---|---|---|
| `whatsapp` | Número que recibe las reservas | Solo dígitos, con código de país, **sin `+` ni espacios**. Chile: `56` + `9` + 8 dígitos → `56912345678` |
| `telefono` | El mismo número, bonito | Se muestra en pantalla |
| `instagram` | URL completa del perfil | Con `https://` |
| `tiktok` | URL o `""` | Si lo dejas vacío, el botón desaparece solo |
| `direccion` | Dirección del local | |
| `maps` | Link de Google Maps | Búscalo en Maps → Compartir → Copiar vínculo |
| `horarios` | Días y horas | Agrega `cerrado: true` para pintar el día en gris |
| `buffet` | Precio, días y turnos de Santos Palitos Libres | Si agregas o quitas turnos, el `<select>` del formulario se actualiza solo |

Lo demás (beneficios de cumpleaños y textos) está en `index.html` y se
edita como texto normal.

## 2. Las fotos

Ya están puestas y optimizadas (las 22 originales pesaban ~230 MB; en el sitio pesan 1,9 MB
en total). Salieron de tus carpetas `Documentos/fotos sociales la santa` y
`Documentos/santos palitos libres`:

| Archivo en el sitio | Dónde aparece | Original |
|---|---|---|
| `hero-barra.jpg` | Fondo del hero | `DSC07275` (bartender) |
| `lugar-1` … `lugar-6` | Galería "El lugar" | fotos sociales |
| `sushi-1` … `sushi-3` | Tira bajo Sushi Libre | fotos del buffet |
| `cumple-1.jpg` | Bloque de decoración | `DSC09019` |

**Para cambiar una foto** basta con sobrescribir el archivo en `assets/img/` manteniendo el
nombre. Si la nueva viene de cámara (10 MB+), redúcela antes con este comando:

```bash
sips -Z 1200 -s format jpeg -s formatOptions 68 foto-original.jpg --out /Users/cristiantoledo/la-santa-landing/assets/img/lugar-2.jpg
```

Si cambias el **texto alternativo**, edítalo en el `alt` de cada `<img>` en `index.html`:
es lo que leen Google y los lectores de pantalla.

### Sumar una red social más adelante

El sitio muestra solo Instagram. Para agregar otra (Facebook, TikTok, la que sea) hacen
falta dos cosas:

1. La URL en `js/config.js` (`tiktok` ya está listo, vacío).
2. Un `<a data-link="nombre">` con su ícono en el `<footer>` de `index.html` — copia el
   bloque de Instagram y cámbiale el `data-link`, el `aria-label` y el `<svg>`.

El resto es automático: si la URL está vacía el botón se oculta, y si tiene valor aparece.

## 2c. El feed de Instagram

La sección "Lo último en Instagram" muestra las publicaciones del perfil y **se actualiza
sola**. Usa [Behold](https://behold.so), un servicio que se conecta a Instagram y mantiene
el permiso vigente (si se conectara la API a mano, se caería cada 60 días).

### Requisito previo

La cuenta de Instagram debe ser **Business o Creator**, no personal. Se cambia gratis desde
la app: *Configuración → Tipo de cuenta*. No hace falta página de Facebook.

### Cómo activarlo

1. Crear cuenta en [behold.so](https://behold.so) y conectar `bar.lasantapm`.
2. Crear un feed y abrir **Embed Code**.
3. Copiar **solo el ID**. Si el código dice `feed-id="abc123XYZ"`, el ID es `abc123XYZ`.
4. Pegarlo en `js/config.js`:

```js
instagramFeedId: "abc123XYZ",
```

Listo. No hay que tocar el HTML: el sitio arma el widget y carga el script de Behold solo.

### Qué pasa si no está configurado

Mientras `instagramFeedId` esté vacío, la sección muestra una invitación a seguir el perfil
y **no carga nada de terceros** — ni un solo pedido a Behold. Lo mismo si el script falla
(sin internet, bloqueador de anuncios): vuelve sola a la invitación en vez de dejar un hueco.

### Para que combine con el diseño

Behold deja elegir colores y separación desde su panel. Conviene poner el fondo en
transparente o `#131110` y el texto en `#F4EDE1`, para que no corte con el resto del sitio.

## 2b. La carta

La sección `id="carta"` tiene dos partes:

1. **Ocho tarjetas de categorías** escritas a mano en `index.html` (Cócteles La Santa,
   Happy Hour, Holy Signature, Santa Burger XXVI, Santa Pizza, Santa Gula, Santa Comida y
   Barra completa). Si cambian precios o platos destacados, se editan ahí.
2. **El visor de las 10 páginas**, que se abre a pantalla completa al tocar cualquiera
   (flechas del teclado para navegar, Esc para cerrar), más un botón de descarga del PDF.

**Para actualizar la carta** cuando saquen una versión nueva: deja el PDF nuevo en el
Escritorio y regenera las imágenes con el script `pdf2png` (o vuelve a pedírmelo). Los
nombres deben quedar como `assets/carta/carta-01.jpg` (grande) y `carta-01-thumb.jpg`
(miniatura), y los títulos de cada página se listan en `carta.paginas` de `js/config.js`.

## 3. Cómo funcionan las reservas

No hay base de datos ni backend. El formulario **arma un mensaje y abre WhatsApp** con
todo escrito; ustedes confirman respondiendo. Es lo más simple y lo que la gente ya usa.

Hay tres tipos, en pestañas sobre el mismo formulario:

### Dos canales: WhatsApp o Instagram

El formulario ofrece los dos, para quien no use WhatsApp:

- **WhatsApp** abre el chat con el mensaje ya escrito (`wa.me`). Exige teléfono.
- **Instagram** copia el mensaje al portapapeles y abre el DM (`ig.me/m/usuario`), para que
  la persona solo pegue y envíe. **No exige teléfono**, porque el bar responde por DM.

Instagram no permite prellenar un mensaje por URL como sí hace WhatsApp — de ahí el copiado.
Si el navegador bloquea el portapapeles, aparece solo un cuadro con el texto para copiar a mano.

El usuario de Instagram para el DM **se saca automáticamente** de la URL en `config.js`; no hay
que configurarlo aparte.

- **Mesa diaria** — fecha, hora, personas y la **cortesía del día**.
- **Santos Palitos Libres** — cambia hora por *turno*, pide el desglose de niños y muestra
  el **total estimado** en vivo. Si la fecha no es jueves, la corrige sola al próximo jueves
  y bloquea el envío si el usuario insiste.
- **Cumpleaños** — agrega nombre del cumpleañero, fecha real y la opción de decoración.
  Los beneficios **se calculan solos** según el número de personas y viajan en el mensaje.

### La cortesía del día

Solo en *mesa diaria*. Es una casilla simple — **no dice cuál es la cortesía**, porque cambia
semana a semana y habría que editar el sitio cada vez. Se la cuentan al confirmar por WhatsApp.

Tiene **hora tope: 22:30**. Si la reserva es más tarde, la casilla se bloquea sola y aparece
un aviso explicando por qué, en vez de dejar pedirla y rechazarla después. Si alguien la marca
y luego cambia la hora a una más tardía, se desmarca automáticamente.

El tope se cambia en `reservas.topeCortesia` de `js/config.js`. Las horas de madrugada
se entienden bien: 00:30 y 01:00 cuentan como *después* de las 22:30, no antes.

### Beneficios de cumpleaños (regla aplicada)

| Personas | Beneficios |
|---|---|
| Menos de 4 | No aplica |
| 4 | 1 tabla de cortesía + 1 trago para el cumpleañero/a |
| 5 a 9 | 1 tabla por cada 4 personas + 1 jarra de mojito |
| 10 o más | 1 tabla por cada 4 personas + Happy Hour especial toda la noche + 1 trago de regalo al cumpleañero/a cada 1 hora |

Las tablas se calculan con `Math.floor(personas / 4)`: 8 personas → 2 tablas, 12 → 3, 20 → 5.
La decoración es opcional y se pide con un checkbox al reservar.

Si cambian las reglas, se editan en la función `beneficiosPara()` de `js/main.js` y en las
tres tarjetas de la sección `id="cumples"` de `index.html`.

### Santos Palitos Libres (sushi libre)

Sushi libre 2 horas, **solo los jueves** de 19:00 a 21:00. Los primeros 30 minutos salen
Rolls Premium. Adultos $9.990, niños de 7 a 12 años $7.990, hasta 6 años gratis.

Todo eso vive en `buffet` dentro de `js/config.js`:

- `diaSemana: 4` es lo que restringe las reservas al jueves (0 = domingo … 6 = sábado).
  Si algún día lo hacen en más días, ponlo en `null` y desaparece la restricción.
- `turnos` es un array: con un solo turno la tarjeta dice "Horario"; con dos o más pasa
  a decir "Turno 1", "Turno 2"… y el `<select>` del formulario se llena solo.
- `precios` alimenta a la vez la tabla de la sección y el cálculo del total estimado
  (`monto: 0` = gratis, y esa fila no suma).

Los botones "Reservar Palitos Libres" y "Reservar mi cumpleaños" saltan al formulario ya
con la pestaña correcta seleccionada.

Validaciones incluidas: nombre mínimo, teléfono válido, fecha no anterior a hoy, y tope de
personas (sobre el máximo, invita a escribir por WhatsApp).

## 4. Probar en el computador

```bash
python3 -m http.server 4321 --directory /Users/cristiantoledo/la-santa-landing
```

Luego abre `http://localhost:4321`.

## 5. Publicar

**Netlify (lo más rápido, gratis):** entra a [app.netlify.com/drop](https://app.netlify.com/drop)
y arrastra la carpeta completa. Queda online en segundos con un dominio tipo
`lasanta.netlify.app`; después puedes conectar el dominio propio.

**GitHub Pages:** sube la carpeta a un repo → Settings → Pages → Branch `main` / carpeta raíz.

---

## Pendientes cuando tengas el material

- [x] WhatsApp, Instagram, dirección (Egaña 121, Puerto Montt) y horarios
- [x] Beneficios de cumpleaños por tramo de personas
- [x] Santos Palitos Libres: sushi libre, jueves, precios y Rolls Premium
- [x] Fotos reales en hero, galería, sushi libre y cumpleaños
- [x] Sección de carta con las 10 páginas y descarga del PDF
- [x] Redes: solo Instagram (Facebook descartado por decisión del local)
- [x] Reserva por WhatsApp **o** por DM de Instagram
- [x] Feed de Instagram conectado y funcionando
- [x] Cortesía del día en la reserva de mesa diaria (tope 22:30)
- [ ] Revisar el choque de horarios: la carta dice que el Happy Hour va de **martes a sábado
      18:00–22:00**, pero los horarios de atención que me diste son de **lunes a jueves,
      viernes y sábado** (domingo cerrado). El sábado además abre a las 19:00, después de que
      el Happy Hour ya empezó.
- [ ] Imagen para compartir en redes: crear `assets/img/og-lasanta.jpg` (1200×630, logo sobre
      foto del local) y apuntar ahí el `og:image` del `<head>`

> **Si editas algo y no ves el cambio en el navegador**, es la caché: recarga con
> `Cmd + Shift + R`. Pasa sobre todo con `config.js` y `styles.css`.
