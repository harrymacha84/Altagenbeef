# AltaGEN Beef — Instalación como app (Android)

Este paquete convierte la herramienta en una app instalable, con soporte para
recibir el Excel compartido directo desde WhatsApp.

## Archivos incluidos

- `index.html` — la app (con licencia, informe e índice de selección)
- `manifest.json` — metadata de la app + configuración del "share target"
- `service-worker.js` — permite instalar la app y recibir archivos compartidos
- `icon-192.png` / `icon-512.png` — íconos de la app

**Los 5 archivos van todos juntos en la raíz del repositorio** (no en subcarpetas),
porque están linkeados entre sí con rutas relativas (`./manifest.json`, etc.).

---

## Paso 1 — Subir a GitHub

1. Entrá a GitHub y creá un repositorio nuevo (público — GitHub Pages gratis
   requiere que sea público, salvo que tengas plan pago).
2. Subí los 5 archivos de este paquete a la raíz del repo (arrastrándolos en
   la interfaz web de GitHub, o con git).

## Paso 2 — Activar GitHub Pages

1. En el repo: **Settings → Pages**.
2. En "Source" elegí **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. Guardá. GitHub te va a dar una URL tipo:
   `https://tu-usuario.github.io/nombre-del-repo/`
4. Esperá 1-2 minutos y entrá a esa URL desde el celular para confirmar que
   carga bien.

## Paso 3 — Instalar en Android

1. Abrí la URL de GitHub Pages en **Chrome para Android** (tiene que ser
   Chrome, no un navegador dentro de WhatsApp/Instagram).
2. Activá la app con tu clave (mismo sistema de siempre).
3. Va a aparecer un botón **"📲 Instalar app"** en la barra superior — o
   también podés instalarla desde el menú ⋮ de Chrome → "Instalar app" /
   "Agregar a pantalla de inicio".
4. Listo — queda como ícono en el celular, se abre a pantalla completa como
   cualquier app.

## Paso 4 — Compartir el Excel desde WhatsApp

**Importante: esto solo funciona con la app ya instalada** (Paso 3), no
sirve si solo la tenés abierta como pestaña del navegador.

1. En WhatsApp, abrí el Excel que te mandaron (o mantené presionado el
   archivo en el chat) y tocá **Compartir**.
2. En la lista de apps para compartir, debería aparecer **AltaGEN Beef**.
3. Al tocarla, la app se abre sola con el Excel ya cargado, lista para
   generar el informe o el índice — sin tener que guardarlo aparte y
   subirlo manualmente.

---

## Limitaciones a tener en cuenta

- **El "compartir desde WhatsApp" es una función de Android/Chrome.** En
  iPhone (iOS) no funciona igual — Apple no soporta recibir archivos
  compartidos en una PWA de esta forma. En iPhone siempre va a quedar
  disponible la carga manual (botón de subir Excel), que funciona en
  cualquier dispositivo.
- La primera vez que se instala necesita conexión a internet (para bajar
  las librerías de gráficos/Excel/PDF). Una vez instalada, si volvés a
  abrirla sin conexión, va a intentar usar la versión que quedó guardada
  en el celular — pero para procesar un Excel nuevo sí o sí hace falta señal
  la primera vez que se usa en ese dispositivo.
- Cuando actualices el `index.html` en el futuro (nueva versión de la app),
  los celus que ya la tienen instalada pueden tardar en ver el cambio,
  porque el service worker guarda una copia en caché. Si hace falta forzar
  la actualización: en Chrome → Configuración → Sitios → buscar el sitio →
  "Borrar datos", y volver a abrir la app.
