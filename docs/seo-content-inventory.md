# Inventario de contenido — SEO/GEO (Fase 1)

Parte de #1 / #2. Snapshot del estado actual del contenido público antes de aplicar cambios de SEO técnico, metadata, schema.org y GEO.

Notas generales válidas para **todas** las filas:

- **Canonical**: no implementado — `Layout.astro` acepta `canonical?: string` pero ninguna página lo pasa y no hay fallback automático (ver issue #3 — canonical automático).
- **Hreflang**: no implementado — el sitio es monolingüe (es-MX) y no declara `hreflang` en ninguna página (ver issue #5).
- **Meta description**: cuando una página no pasa `description` explícito a `Layout`, hereda el default global: *"Urólogo certificado UNAM. Cirugía de próstata con láser HoLEP y ThuFLEP. Consultorios en CDMX y Estado de México."* — marcado abajo como **(default)**.

## Páginas públicas

| URL | Título actual | Meta description actual | H1 | H2 | Canonical | Hreflang |
|---|---|---|---|---|---|---|
| `/` | Dr. Abraham López Venegas — Urólogo Metropolitano CDMX *(default)* | (default) | "Cirugía de próstata con láser" | Ninguno explícito (TrustStrip no tiene heading propio; Procedimientos que realizamos [h2 vía SectionTag]; Dr. Abraham López Venegas — Urólogo certificado UNAM [h2]; 3 sedes en CDMX y Estado de México [h2]; Más de 1,300 opiniones reales de pacientes [h2]; Información para pacientes [h2]; ¿Listo para agendar tu consulta? [h2, CtaBanner]) | No | No |
| `/prostata` | Próstata — Dr. Abraham López Venegas · Urólogo CDMX | (default) | "Cirugía de próstata con láser" | ¿Qué es la próstata? [h2]; Especialización en próstata [h2]; ¿Cuándo acudir con un urólogo? [h2]; Dudas comunes sobre la próstata [h2] | No | No |
| `/perfil` | Dr. Abraham López Venegas — Perfil y Trayectoria · Urólogo CDMX | (default) | "Dr. Abraham López Venegas" | Trayectoria académica [h2]; Certificaciones vigentes [h2]; En qué es especialista [h2]; Más de 1,300 opiniones verificadas [h2] | No | No |
| `/ubicaciones` | Consultorios — Dr. Abraham López Venegas · CDMX y EdoMex | (default) | "Consultorios en CDMX y Estado de México" | Un `<h2>` por sede vía `SedeDetailCard` (Lindavista, La Viga · Iztapalapa, Chalco — 3 en total); Trabajamos con tu seguro médico [h2] | No | No |
| `/404` | Página no encontrada — Dr. Abraham López Venegas | (default) | "Esta página no existe" | Ninguno | No | No |

## Blog

| URL | Título actual | Meta description actual | H1 | H2 | Canonical | Hreflang |
|---|---|---|---|---|---|---|
| `/blog` | Blog de urología — Dr. Abraham López Venegas · Información para pacientes | Artículos médicos sobre próstata, cálculos urinarios y salud masculina, escritos por el Dr. Abraham López Venegas, urólogo certificado UNAM. | "Blog de urología — Información para pacientes" | Artículos recientes [h2]; Explorar por categoría [h2] | No | No |
| `/blog/categorias` | Categorías del blog — Dr. Abraham López Venegas · Urólogo CDMX | Explora los artículos del blog del Dr. Abraham López Venegas organizados por categoría. | "Explora el blog por categoría" | Todas las categorías [h2] | No | No |
| `/blog/prostata` (única categoría existente) | {Categoría} — Blog Dr. Abraham López Venegas | Artículos sobre {categoría} escritos por el Dr. Abraham López Venegas, urólogo certificado UNAM. | "Categoría: Próstata" | Artículos sobre Próstata [h2] | No | No |
| `/blog/prostata/que-es-el-antigeno-prostatico` | Qué es el antígeno prostático (PSA) y cuándo importa — Dr. Abraham López Venegas — Blog Dr. Abraham López Venegas *(metaTitle duplica el sufijo del Layout)* | El PSA en sangre es una prueba simple que forma parte del chequeo urológico anual desde los 50 años. Aprende qué mide, qué significan sus niveles y cuándo hacerte la prueba. | "Qué es el antígeno prostático y cuándo importa" | 6 H2 internos: ¿Qué es el antígeno prostático específico (PSA)?; ¿Para qué sirve la prueba de PSA?; ¿Qué significan los niveles de PSA?; ¿Qué otras condiciones pueden elevar el PSA?; ¿A partir de qué edad debo hacerme la prueba?; ¿Qué pasa si mi PSA sale elevado? | No | No |
| `/blog/prostata/por-que-se-eleva-el-antigeno-prostatico` | Por qué se eleva el antígeno prostático (PSA) — Dr. Abraham López Venegas — Blog Dr. Abraham López Venegas *(mismo problema de doble sufijo)* | El antígeno prostático específico (PSA) es una proteína producida por la próstata. Su elevación puede indicar diversas condiciones que requieren evaluación médica. Aprende cuándo preocuparte y cuándo no. | "Por qué se eleva el antígeno prostático (PSA)" | 5 H2 internos: El PSA sube por más de una razón; Las causas más frecuentes de un PSA elevado; ¿Qué tanto debe elevarse para preocupar?; ¿Qué hace el urólogo cuando el PSA sale alto?; La importancia del chequeo anual | No | No |

## Hallazgos para las siguientes fases

1. **Canonical / hreflang**: ausentes en el 100% de las páginas → confirma el alcance de los issues de canonical automático y hreflang.
2. **Meta description por default**: `/`, `/prostata`, `/perfil`, `/ubicaciones` y `/404` usan la description genérica del Layout en vez de una específica por página → input directo para el issue de "sistema de metadata por página".
3. **Título duplicado en posts del blog**: el `title` del post (`metaTitle ?? title`) ya incluye contexto y el Layout le concatena `" — Blog Dr. Abraham López Venegas"`, generando títulos largos y redundantes (ej. "Qué es el antígeno prostático (PSA) y cuándo importa — Dr. Abraham López Venegas — Blog Dr. Abraham López Venegas"). Revisar al implementar el issue de metadata.
4. **H1 único por página**: se cumple en todas las páginas revisadas (una sola etiqueta `<h1>` por página).
5. **Jerarquía H1→H2**: no se detectaron saltos a H3 sin H2 intermedio en el contenido revisado, salvo tarjetas/ítems internos que usan `<h3>` dentro de una sección ya encabezada por su propio `<h2>` (Procedures, BentoStats) — esto es correcto semánticamente y no requiere corrección.
6. **`/ubicaciones`**: correcto — cada sede tiene su propio `<h2>` vía `SedeDetailCard.astro`, más el `<h2>` de la sección de aseguradoras. No se detectaron problemas de jerarquía en esta página.
