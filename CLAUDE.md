## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Patrón de páginas: composición por secciones

Referencia canónica: `src/pages/index.astro`. Toda página nueva debe seguir esta misma anatomía.

### 1. La página es solo datos + composición

El archivo `.astro` de una página **no contiene markup de layout ni texto hardcodeado en el body**. Se limita a:

1. Importar `Layout` y los componentes de sección que usa.
2. Definir en el frontmatter los datos (strings, arrays, objetos) que esas secciones necesitan — títulos, textos, imágenes, íconos SVG en crudo, arrays de items repetidos.
3. Renderizar dentro de `<Layout>` una lista plana de `<Seccion prop={dato} />`, en el mismo orden visual en que aparecen en la página.

```astro
---
import Layout from "../layouts/Layout.astro";
import Hero from "../components/section/Hero.astro";
import TrustStrip from "../components/section/index/TrustStrip.astro";
// ...resto de imports de secciones

const trustItems = [{ icon: `<svg .../>`, title: "...", subtitle: "..." }];
// ...resto de datos
---

<Layout>
  <Hero />
  <TrustStrip items={trustItems} ctaHref="/perfil" ctaText="Perfil completo" />
  <!-- resto de secciones -->
</Layout>
```

Si al escribir una página aparece un `<div class="container-fluid">`, un `<section>`, o un bloque de texto/SVG suelto directo en el `.astro` de la página, es señal de que falta extraer una sección o pasar ese contenido como prop.

### 2. Dos tipos de sección, dos ubicaciones

- **Compartidas** (se reutilizan en 2+ páginas, ej. `Hero`, `CtaBanner`): van directo en `src/components/section/NombreSeccion.astro`.
- **Exclusivas de una página**: van en `src/components/section/<nombre-de-la-página>/NombreSeccion.astro` (ej. `src/components/section/index/TrustStrip.astro` para `pages/index.astro`). El nombre de la carpeta coincide con el nombre del archivo de la página (sin extensión).

Antes de crear una sección, preguntar: ¿este bloque visual se va a repetir tal cual (o con solo datos distintos) en otra página? Si sí → compartida. Si es propia de la narrativa de esta página → carpeta de la página.

### 3. Cada sección es dueña de su esqueleto Bootstrap

El componente de sección (no la página) contiene el wrapper completo:

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

No mezclar: nunca poner `container` directo sin el `row > col-12`, ni omitir el wrapper semántico interno. Para grids de contenido repetido (cards de reseñas, ubicaciones, blog, etc.) usar `row g-*` + `col-12 col-md-*` envolviendo el componente de `ui/`, iterando con `.map()` sobre el array recibido por prop.

### 4. Contenido repetido → array de datos + componente `ui/`

Cuando una sección renderiza N items iguales (reviews, ubicaciones, posts de blog, logos), la sección recibe el array completo por prop y hace `.map()`, delegando cada item a un componente de `src/components/ui/` (`ReviewCard`, `LocationCard`, `BlogCard`). Nunca copiar el mismo bloque de markup 3 veces ni a nivel página ni a nivel sección.

### 5. Texto enriquecido e íconos

- Texto con markup inline (`<br>`, `<em>`, `<strong>`) se pasa como string HTML por prop y se renderiza con `set:html` (ver `Hero`, `SectionTag`, `CtaBanner`).
- Íconos SVG se pasan como string crudo por prop (definidos junto a los demás datos en la página) y se renderizan con `set:html` sobre un contenedor (`.t-icon`, `.ic-icon`); no se crean componentes `.astro` individuales por ícono.

### 6. Estadísticas numéricas: count-up automático

Todo número que se muestre como stat (700+, 4.9★, 1,300+, folios, etc.) debe animarse al entrar en pantalla usando el sistema ya integrado (`src/scripts/countup.js`, importado una vez en `Layout.astro`):

```astro
<span data-countup="1300" data-countup-decimals="0">0</span>
```

- El valor en el dato de la página va **sin comas/separadores** (`"1300"`, no `"1,300"`); el script los agrega vía `toLocaleString('es-MX')`.
- `data-countup-decimals` para valores como `4.9` (decimals="1").
- El sufijo (`+`, `★`) se pasa aparte (`stat.suffix`) y se renderiza como texto estático junto al `<span data-countup>`, nunca dentro del número animado.
- El contenido inicial del elemento debe ser `0` (placeholder antes de que corra el observer).

## Componentización

- Componentes reutilizables de un solo elemento (botones, tarjetas, headings) van en `src/components/ui/`.
- Componentes de sección completa van en `src/components/section/` (compartidos) o `src/components/section/<página>/` (exclusivos) — ver "Patrón de páginas" arriba.
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
