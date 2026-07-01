# Alumglass

Sitio web empresarial estatico para captar clientes potenciales de trabajos de vidrio y aluminio en La Piedad, Michoacan, Santa Ana Pacueco y alrededores.

## Estructura

- `index.html`: sitio publico con servicios, galeria, ubicacion, FAQ y llamadas a WhatsApp.
- `admin/cotizacion.html`: formulario interno de cotizacion, sin enlace publico y con `noindex`.
- `assets/css/styles.css`: estilos responsive, accesibles y listos para produccion.
- `assets/js/main.js`: navegacion movil.
- `assets/js/quote-form.js`: validaciones y estructura preparada para conectar backend/correo.
- `assets/images/`: favicon y hero local.
- `robots.txt` y `sitemap.xml`: SEO tecnico basico.

## Correr localmente

Puedes abrir `index.html` directamente en el navegador. Para probarlo como sitio:

```powershell
python -m http.server 4173
```

Luego visita:

- `http://127.0.0.1:4173/`
- `http://127.0.0.1:4173/admin/cotizacion.html`

## Produccion

Antes de publicar, reemplaza `https://alumglass.example/` en `index.html`, `robots.txt` y `sitemap.xml` por el dominio real.

El formulario interno no debe considerarse protegido por estar en una carpeta. En produccion debe servirse detras de autenticacion real, por ejemplo:

- autenticacion del hosting,
- middleware del framework,
- backend con sesion/JWT,
- o un panel privado separado.

Cuando exista backend, cambia `sendQuote()` en `assets/js/quote-form.js` por un `fetch()` al endpoint real y valida nuevamente en servidor.

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
