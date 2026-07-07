## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Layout: patrón de secciones con Bootstrap

Este proyecto usa Bootstrap (CDN, cargado en `src/layouts/Layout.astro`) para el grid, combinado con el CSS custom del diseño original (`public/style.css`). Toda sección de página nueva debe seguir este esqueleto:

```astro
<section class="container-fluid <clase-tema>">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="<nombre>-wrapper">
          <!-- contenido -->
        </div>
      </div>
    </div>
  </div>
</section>
```

- **`container-fluid` (outer)**: fondo/tema a todo el ancho del viewport (ej. `trust`, `bento`, `cta-banner`, secciones `dark`/`fog`).
- **`container` (inner)**: constriñe el ancho real del contenido, igual que el resto del sitio.
- **`row > col-12`**: capa de grid de Bootstrap; los grids internos (tarjetas, columnas de texto/foto, etc.) van dentro de este `col-12` con sus propios `row`/`col-*`.
- **`.<nombre>-wrapper`**: div semántico que conserva las clases de diseño originales (`.trust-wrapper`, `.insur-wrapper`, `.cta-wrapper`, etc.) — aquí vive el CSS custom del diseño, no en el `container-fluid`/`container`/`row`/`col-12`.

No mezclar: nunca poner `container` directo dentro de una sección sin el `row > col-12`, ni omitir el wrapper semántico interno. Para grids de contenido repetido (cards de reseñas, ubicaciones, blog, etc.) usar `row g-*` + `col-12 col-md-*` envolviendo el componente, con los datos en un array en el frontmatter y renderizados vía `.map()`.

## Componentización

- Componentes reutilizables (botones, tarjetas, headings) van en `src/components/ui/`.
- Componentes de sección completa (Hero, etc.) van en `src/components/section/`.
- Preferir un componente concreto (ej. `WhatsAppButton.astro`) sobre una variante de un componente genérico (`Button` con `variant="wa"`) cuando el elemento tiene markup/ícono propio, no solo un cambio de clase.
- Contenido repetido (reviews, blog posts, ubicaciones) se define como array en el frontmatter de la página y se renderiza con `.map()`, no copiando el mismo bloque de markup varias veces.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
