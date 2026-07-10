# Auditoría de `alt` en imágenes — SEO (Fase 7)

Parte de #1 / #11. Revisión de las 21 etiquetas `<img>` del sitio (no hay uso de `<Image />` de `astro:assets` en el proyecto actualmente).

## Metodología

- Búsqueda de todo `<img` en `src/**/*.astro`.
- Para cada bloque `<img>...>` se verificó que exista el atributo `alt` (ninguno lo omite).
- Para cada `alt` se revisó el valor real pasado desde la página/dato que lo alimenta (no solo el nombre del prop).
- Búsqueda de `background-image`, `<picture>` y `<Image />` para descartar imágenes fuera de `<img>` — no se encontró ninguna.
- Los mapas de `/ubicaciones` y la home usan `<iframe>` de Google Maps, no `<img>`, por lo que quedan fuera del alcance de este issue (accesibilidad de iframes es un tema aparte, no cubierto por la Fase 7).

## Resultado

**Ninguna imagen informativa carece de `alt` descriptivo, y ninguna imagen decorativa tiene un `alt` ruidoso.** Detalle por categoría:

### Decorativas (fondos de hero) → `alt=""` ✅

| Componente | Uso |
|---|---|
| `section/blog/Hero.astro` | Fondo de hero del blog |
| `section/blog/PostHero.astro` | Fondo de hero de un post |
| `section/perfil/Hero.astro` | Fondo de hero de perfil |
| `section/prostata/Hero.astro` | Fondo de hero de próstata |
| `section/ubicaciones/Hero.astro` | Fondo de hero de ubicaciones |

Todas correctamente marcadas como decorativas (el texto relevante ya está en el `<h1>`/`<p>` superpuesto, no en la imagen).

### Retratos e imágenes informativas → `alt` descriptivo ✅

| Imagen | `alt` actual |
|---|---|
| Logo (Navbar, Footer) | `Dr. Abraham López Venegas — Urólogo Metropolitano` / `Dr. Abraham López Venegas` |
| Retrato del doctor (Hero home, perfil, Specialties, Specialist) | `Dr. Abraham López Venegas` |
| Foto de consultorio (`prostata/Intro.astro`) | `Consultorio Dr. Abraham López Venegas` |
| Foto tecnología láser (`prostata/Faq.astro`) | `Tecnología láser para cirugía de próstata` |
| Condiciones (`prostata.astro`) | `Hiperplasia prostática`, `Síntomas de próstata`, `Cirugía láser HoLEP` |
| Logos de aseguradoras (`Insurers.astro` × 2) | `GNP Seguros`, `AXA`, `Mapfre`, `BBVA Seguros` |
| Miniaturas de blog en home (`BlogPreview.astro`) | `Por qué se eleva el antígeno prostático`, `Qué es el antígeno prostático`, `Engrosamiento de pene quirúrgico` |
| Miniaturas/hero de artículos del blog (`ArticleCard`, `FeaturedArticleCard`, `Articles.astro`, `RelatedArticles.astro`) | `imageAlt={post.data.title}` — título real del post desde el content collection |

Ningún `alt` usa placeholders genéricos como `"imagen"`, `"foto"` o cadena vacía por omisión donde la imagen es informativa.

## Conclusión

No se requirieron cambios de código: la auditoría confirma que el sitio ya cumple la Fase 7 del plan SEO/GEO. Este documento queda como evidencia/checklist para futuras imágenes que se agreguen (nuevas fotos de sedes, nuevos posts del blog, etc.) — deben seguir el mismo criterio: `alt=""` solo para fondos puramente decorativos, `alt` descriptivo y específico para todo lo demás.
