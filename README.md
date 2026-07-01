# Alumglass

Sitio web empresarial estatico para captar clientes potenciales de trabajos de vidrio y aluminio en La Piedad, Michoacan, Santa Ana Pacueco y alrededores.

## Estructura

- `index.html`: sitio publico con servicios, galeria, ubicacion, FAQ y llamadas a WhatsApp.
- `admin/cotizacion.html`: cotizador interno, sin enlace publico y con `noindex`.
- `assets/css/styles.css`: estilos responsive, accesibles y listos para produccion.
- `assets/js/main.js`: navegacion movil.
- `assets/js/gallery-data.js`: datos generados de la galeria por categorias.
- `assets/js/gallery.js`: filtros y visor de imagenes de la galeria.
- `assets/js/quote-form.js`: logica del cotizador interno, validaciones, partidas y resumen preparado para conectar backend/correo.
- `assets/images/`: favicon y hero local.
- `assets/images/gallery/`: imagenes optimizadas de trabajos por categoria.
- `tools/build_gallery.py`: script para regenerar la galeria desde un ZIP con carpetas por categoria.
- `robots.txt` y `sitemap.xml`: SEO tecnico basico.

## Correr localmente

Puedes abrir `index.html` directamente en el navegador. Para probarlo como sitio:

```powershell
python -m http.server 4173
```

Luego visita:

- `http://127.0.0.1:4173/`
- `http://127.0.0.1:4173/admin/cotizacion.html`

## Regenerar galeria

El ZIP debe tener una carpeta por categoria y sus imagenes dentro. Ejecuta:

```powershell
python tools\build_gallery.py "C:\ruta\galeria.zip" "C:\Users\CORE\Documents\alumglass"
```

El script crea imagenes `.webp` optimizadas en `assets/images/gallery/` y actualiza `assets/js/gallery-data.js`.

## Produccion

Antes de publicar, reemplaza `https://alumglass.example/` en `index.html`, `robots.txt` y `sitemap.xml` por el dominio real.

El formulario interno no debe considerarse protegido por estar en una carpeta. En produccion debe servirse detras de autenticacion real, por ejemplo:

- autenticacion del hosting,
- middleware del framework,
- backend con sesion/JWT,
- o un panel privado separado.

Cuando exista backend, conecta el envio final de la cotizacion en `assets/js/quote-form.js` con un `fetch()` al endpoint real y valida nuevamente en servidor.

## Cotizador interno

El cotizador de `admin/cotizacion.html` toma como base el archivo de referencia `cotizacion.xlsx`. Incluye plantillas para:

- ventana nacional 2 pulgadas,
- ventana nacional 3 pulgadas,
- ventana europea S1400,
- puerta ligera 3 pulgadas,
- ventana de proyeccion.

Los calculos se hacen en centimetros, convierten perfiles a metros/tramos y aplican margen/mano de obra segun la plantilla original. Los precios de materiales estan en `assets/js/quote-form.js` para que puedan ajustarse facilmente.

## Checklist antes de publicar

- Probar enlaces de llamada y WhatsApp.
- Confirmar direccion, horario y telefono.
- Reemplazar dominio canonico, sitemap y robots.
- Activar HTTPS.
- Proteger `/admin/` con autenticacion real en el servidor/hosting.
- Validar formulario con datos correctos e incorrectos.
- Revisar responsive en movil, tablet y escritorio.
- Ejecutar Lighthouse y revisar rendimiento, accesibilidad, SEO y buenas practicas.
- Comprimir imagenes si el hosting no lo hace automaticamente.
- Conectar analitica y eventos de conversion para WhatsApp/telefono.
