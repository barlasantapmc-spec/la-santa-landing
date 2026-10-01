# Conectar las reservas con Google Sheets

Tiempo: unos 10 minutos, una sola vez.

Al terminar, cada reserva del sitio va a:
1. Escribirse como una fila en tu hoja de cálculo
2. Enviarle al cliente un correo de confirmación

No se envía aviso interno al bar: las reservas se revisan en la hoja.

---

## Paso 1 — Crear la hoja

1. Entra a [sheets.google.com](https://sheets.google.com) **con la cuenta `bar.lasanta.pm@gmail.com`**.
   Esto importa: los correos van a salir desde la cuenta que crea el script.
2. Crea una hoja nueva y llámala **Reservas La Santa**.

No hace falta crear columnas ni encabezados: el script arma la pestaña `Reservas`
con sus títulos la primera vez que llega una reserva.

## Paso 2 — Pegar el script

1. En la hoja: menú **Extensiones → Apps Script**.
2. Se abre un editor con un archivo `Código.gs` que trae unas pocas líneas. **Bórralas todas.**
3. Abre el archivo `Codigo.gs` de esta carpeta, copia **todo** su contenido y pégalo ahí.
4. Guarda con el ícono del disquete (o `Cmd + S`).

## Paso 3 — Probarlo antes de publicar

Conviene comprobar que funciona antes de conectarlo al sitio.

1. Arriba, en el desplegable de funciones, elige **`probar`**.
2. Dale al botón **Ejecutar** (▶).
3. La primera vez Google pide permisos:
   - **Revisar permisos** → elige la cuenta `bar.lasanta.pm@gmail.com`
   - Aparece **"Google no ha verificado esta aplicación"**. Es normal: la aplicación
     eres tú mismo. Pincha en **Configuración avanzada** → **Ir a (nombre del proyecto)**
   - **Permitir**

Si todo salió bien: en la hoja aparece una fila de prueba y te llega un correo.
Borra esa fila cuando termines.

> Si el correo no llega, mira en Spam. Es habitual que el primero caiga ahí.

## Paso 4 — Publicar el script

1. Arriba a la derecha: **Implementar → Nueva implementación**.
2. En el ícono del engranaje, elige el tipo **Aplicación web**.
3. Completa así — **estos dos valores son los importantes**:

   | Campo | Valor |
   |---|---|
   | Ejecutar como | **Yo** (`bar.lasanta.pm@gmail.com`) |
   | Quién tiene acceso | **Cualquier persona** |

   "Cualquier persona" suena riesgoso, pero es necesario: quien reserva en el sitio no
   tiene cuenta de Google. Lo único que ese acceso permite es *enviar* una reserva —
   nadie puede leer la hoja desde ahí.

4. **Implementar**. Copia la **URL de la aplicación web** (termina en `/exec`).

## Paso 5 — Pegar la URL en el sitio

Abre `js/config.js` y pega la URL:

```js
hojaUrl: "https://script.google.com/macros/s/AKfy.../exec",
```

Listo. Prueba una reserva desde el sitio.

---

## Compartir la hoja con el equipo

En la hoja, botón **Compartir**, y agrega **los correos de cada colaborador** con permiso
de *Lector* (o *Editor* si van a marcar reservas como atendidas).

> ⚠️ **No la compartas como "Cualquier persona con el enlace".** La hoja tiene nombres,
> teléfonos y correos de tus clientes: eso sería filtrar sus datos.

## Límite de correos

Una cuenta Gmail normal envía **100 correos al día**. Cada reserva usa 1 (solo al cliente),
así que el techo son **100 reservas diarias** por la web. Con Google Workspace sube a 1.500.

## Cambios que quizá quieras hacer

**El texto del correo** está en la función `enviarCorreoCliente` de `Codigo.gs`.

> ⚠️ El correo dice que la reserva **está confirmada**. El sistema no lleva control de
> cupos: si dos grupos piden la misma hora y solo queda una mesa, ambos reciben la
> confirmación. Revisen la hoja a diario para detectarlo a tiempo.

**Datos extra en el correo:** los cumpleaños, la cortesía del día y el total del buffet
aparecen solo si corresponden. Si prefieres el correo más escueto, borra el bloque marcado
como `extras` dentro de `enviarCorreoCliente`.

**A dónde responde el cliente si contesta el correo:** la variable `CORREO_BAR`.

## Si algo deja de funcionar

En el editor de Apps Script, sección **Ejecuciones** (menú izquierdo): ahí queda el
registro de cada envío y el detalle de los que fallaron.

**Importante:** si editas `Codigo.gs`, los cambios **no se aplican solos**. Hay que ir a
**Implementar → Administrar implementaciones**, editar la existente (ícono del lápiz) y
elegir **Nueva versión**. Si en vez de eso creas una implementación nueva, la URL cambia
y habría que actualizarla en `config.js`.

---

## Pausar las reservas (panel de administración)

El panel está en **barlasanta.cl/admin/reservas**.

### Configurar la contraseña (una sola vez)

La contraseña **no está en el código**. Se guarda en las propiedades del script:

1. En el editor de Apps Script: **Configuración del proyecto** (el engranaje, menú izquierdo)
2. Baja hasta **Propiedades de la secuencia de comandos** → **Agregar propiedad**
3. Propiedad: `CLAVE_ADMIN` · Valor: la contraseña que quieras
4. **Guardar propiedades**

> Mientras no exista esa propiedad, **nadie puede entrar al panel**: el script
> rechaza cualquier contraseña. Es a propósito.

Para cambiarla después, editas el valor en esa misma pantalla. No hace falta
volver a implementar.

### Cómo se usa

| Acción | Resultado |
|---|---|
| Apagar el interruptor | El formulario desaparece del sitio y el servidor rechaza envíos |
| Editar el mensaje | Es el texto que ven los clientes mientras está pausado |
| Guardar cambios | Se aplica de inmediato, sin volver a publicar el sitio |

El ajuste queda guardado en las propiedades del script: **no se pierde** aunque
pase el tiempo o Google reinicie algo.

### Las dos barreras

1. **En la página**: al cargar, consulta el estado y oculta el formulario si está pausado.
2. **En el servidor**: `doPost` revisa el ajuste **antes** de guardar o enviar correos.

La segunda es la que importa. Protege de quien tenía la página abierta desde antes
de que pausaras, y de cualquiera que intente enviar datos saltándose el formulario.

Si la consulta del punto 1 falla (sin internet, Google caído), **el formulario se
muestra igual**. Es deliberado: un corte de red no debe costarte una reserva, y la
barrera del servidor sigue ahí de todos modos.

### Protección contra intentos de adivinar la contraseña

Tras **5 intentos fallidos**, el panel se bloquea **15 minutos**. Los valores están
arriba de `Codigo.gs`, en `MAX_INTENTOS` y `BLOQUEO_MIN`.
