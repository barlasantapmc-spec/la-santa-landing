# Contenido del sitio

`sitio.json` es **la fuente de verdad** de todo lo editable: precios, horarios,
teléfonos, redes, carta y reglas de reserva. Es lo que modifica el panel de
administración.

`_tecnico.json` guarda lo que el administrador no debería tocar (la URL del
Apps Script y el identificador del feed de Instagram).

`js/config.js` quedó como **respaldo**: si `sitio.json` no carga por cualquier
motivo, el sitio sigue funcionando con esos valores en vez de quedar en blanco.
Conviene actualizarlo de vez en cuando para que el respaldo no envejezca.
