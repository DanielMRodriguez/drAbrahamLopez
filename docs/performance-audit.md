# Auditoría de Core Web Vitals — SEO (Fase 11)

Parte de #1 / #22. Lighthouse (desktop preset, throttling simulado por defecto de Lighthouse) contra un build de producción (`astro build` + `astro preview`/static server), sobre 5 páginas: home, `/prostata/`, `/perfil/`, `/blog/` y un post del blog (`/blog/prostata/que-es-el-antigeno-prostatico/`).

Nota importante: estas son **métricas de laboratorio** (lab data, con red/CPU simulados), no datos de campo (CrUX). Sirven para comparar antes/después de un cambio, no como medición exacta de la experiencia real de un usuario en una conexión normal — el sitio real, sin el throttling simulado de Lighthouse, es sensiblemente más rápido que estos números.

## Objetivos (Fase 11)

- LCP < 2.5s
- CLS < 0.1
- INP < 200ms (Lighthouse lab no mide INP real; se usa **Total Blocking Time** como proxy)

## Resultados

| Página | Performance (antes → después) | LCP (antes → después) | CLS | TBT (proxy INP) |
|---|---|---|---|---|
| `/` (home) | 73 → 75 | 3.37s → 3.12s | 0.027 | 0ms |
| `/prostata/` | 74 → 74 | 3.50s → 3.51s | 0.005 | 0ms |
| `/perfil/` | 81 → 81 | 2.35s → 2.35s ✅ | 0.001 | 0ms |
| `/blog/` | 74 → 74 | 3.40s → 3.40s | 0.003 | 0ms |
| Post de blog | 74 → 76 | 3.45s → 3.12s | 0.002 | 0ms |

## Diagnóstico

- **CLS**: excelente en las 5 páginas (0.001–0.027, muy por debajo del umbral de 0.1). No se requirió ninguna corrección.
- **TBT / INP**: 0ms en las 5 páginas — no hay JS bloqueante relevante en el hilo principal.
- **LCP**: por encima de 2.5s en 4 de 5 páginas. Lighthouse identificó dos causas:
  1. Las imágenes hero (el elemento LCP en cada página) no tenían `fetchpriority="high"` ni estaban explícitamente priorizadas.
  2. 3 hojas de estilo render-blocking en `Layout.astro` (Bootstrap CDN, Google Fonts, `/style.css` local) retrasan el primer render de la página completa, incluyendo el elemento LCP (`elementRenderDelay` ~600–640ms solo en esa fase, aparte del tiempo de descarga).

## Correcciones aplicadas en esta issue

- `fetchpriority="high"` en el elemento LCP real de cada página (confirmado con `lcp-discovery-insight` de Lighthouse antes de tocar nada):
  - Home → `Hero.astro` (retrato del doctor, `.hero-dr-img`)
  - `/prostata/` → `prostata/Hero.astro` (fondo de hero)
  - `/perfil/` → `perfil/Hero.astro` (retrato, `.u-photo`)
  - `/blog/` y `/blog/categorias/` y `/blog/[categoria]/` → `blog/Hero.astro` (fondo de hero)
  - Posts del blog → `blog/PostHero.astro` (fondo de hero)
  - `/ubicaciones/` → `ubicaciones/Hero.astro` (fondo de hero), por consistencia aunque no estaba en las 5 páginas auditadas
- `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` agregado en `Layout.astro` — faltaba (solo existía el preconnect a `fonts.googleapis.com`), y es donde realmente se sirven los archivos de fuente.

Resultado: mejora real pero acotada (home y el post bajaron ~0.3s de LCP); `/prostata/`, `/perfil/` y `/blog/` no cambiaron de forma medible porque su cuello de botella real es el render-blocking CSS, no la prioridad de la imagen.

## Qué queda abierto

El LCP de `/`, `/prostata/`, `/blog/` y el post sigue por encima de 2.5s (lab). La causa dominante restante — 3 hojas de estilo render-blocking (Bootstrap CDN + Google Fonts + `/style.css`) — requiere un cambio de arquitectura de carga de CSS que afecta a todo el sitio (self-host de Bootstrap, posible extracción de CSS crítico) y conlleva riesgo real de regresión visual si se hace de forma apurada. Se abrió como issue de seguimiento dedicado: **#42**.

`/perfil/` ya cumple el umbral de LCP (2.35s) sin cambios adicionales.
