# Alumglass

Sitio web empresarial estático para captar clientes potenciales de trabajos de vidrio y aluminio en La Piedad, Michoacán, Santa Ana Pacueco y alrededores.

## Estructura

- `index.html`: sitio público con servicios, galería, ubicación, FAQ y llamadas a WhatsApp.
- `admin/cotizacion.html`: cotizador interno, sin enlace público y con `noindex`.
- `assets/css/styles.css`: estilos responsive, accesibles y listos para producción.
- `assets/js/main.js`: navegación móvil.
- `assets/js/gallery-data.js`: datos generados de la galería por categorías.
- `assets/js/gallery.js`: filtros y visor de imágenes de la galería.
- `assets/js/quote-form.js`: lógica del cotizador interno, validaciones, partidas y resumen preparado para conectar backend/correo.
- `assets/images/`: favicon y hero local.
- `assets/images/gallery/`: imágenes optimizadas de trabajos por categoría.
- `tools/build_gallery.py`: script para regenerar la galería desde un ZIP con carpetas por categoría.
- `robots.txt` y `sitemap.xml`: SEO tecnico basico.

## Correr localmente

Puedes abrir `index.html` directamente en el navegador. Para probarlo como sitio:

```powershell
python -m http.server 4173
```

Luego visita:

- `http://127.0.0.1:4173/`
- `http://127.0.0.1:4173/admin/cotizacion.html`

## Regenerar galería

El ZIP debe tener una carpeta por categoría y sus imágenes dentro. Ejecuta:

```powershell
python tools\build_gallery.py "C:\ruta\galeria.zip" "C:\Users\CORE\Documents\alumglass"
```

El script crea imágenes `.webp` optimizadas en `assets/images/gallery/` y actualiza `assets/js/gallery-data.js`.

## Produccion

Antes de publicar, reemplaza `https://alumglass.example/` en `index.html`, `robots.txt` y `sitemap.xml` por el dominio real.

El formulario interno no debe considerarse protegido por estar en una carpeta. En producción debe servirse detrás de autenticación real, por ejemplo:

- autenticación del hosting,
- middleware del framework,
- backend con sesion/JWT,
- o un panel privado separado.

Cuando exista backend, conecta el envío final de la cotización en `assets/js/quote-form.js` con un `fetch()` al endpoint real y valida nuevamente en servidor.

## Cotizador interno

El cotizador de `admin/cotizacion.html` toma como base el archivo de referencia `cotizacion.xlsx`. Incluye plantillas para:

- ventana nacional 2 pulgadas,
- ventana nacional 3 pulgadas,
- ventana europea S1400,
- puerta ligera 3 pulgadas,
- ventana de proyección.

Los cálculos se hacen en centímetros, convierten perfiles a metros/tramos y aplican margen/mano de obra según la plantilla original. Los precios de materiales están en `assets/js/quote-form.js` para que puedan ajustarse fácilmente.

## Checklist antes de publicar

- Probar enlaces de llamada y WhatsApp.
- Confirmar dirección, horario y teléfono.
- Reemplazar dominio canónico, sitemap y robots.
- Activar HTTPS.
- Proteger `/admin/` con autenticación real en el servidor/hosting.
- Validar formulario con datos correctos e incorrectos.
- Revisar responsive en móvil, tablet y escritorio.
- Ejecutar Lighthouse y revisar rendimiento, accesibilidad, SEO y buenas practicas.
- Comprimir imágenes si el hosting no lo hace automáticamente.
- Conectar analítica y eventos de conversión para WhatsApp/teléfono.
