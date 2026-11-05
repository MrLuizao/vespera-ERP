# DS-002 · Spec UI — "Análisis IA en Auditoría SAT"

> Feature: `/sat` + `GET /api/cfo/sat/audit` (`aiAnalysis` por anomalía) · Registro Impeccable: **product** · Tokens: `DESIGN.md` + `app/assets/css/main.css` (sin colores nuevos; toda desviación marca *Propuesta*) · Consumidor: `@frontend-nuxt` · Sin código de implementación.

## 1. Bloque "Análisis IA" dentro de la tarjeta

**Decisión — reemplaza, no se apoya debajo.** Cuando `item.aiAnalysis` existe, el bloque **ocupa exactamente el slot de `item.detail`** (misma posición en la columna izquierda, después del proveedor RFC); `detail` no se renderiza. Cuando `aiAnalysis` ausente → `detail` tal cual hoy, sin contenedor (ver §3).
**Justificación:** son dos explicaciones del mismo hecho fiscal; renderizarlas juntas obliga al CFO a elegir cuál leer y duplica la altura de la tarjeta. El bloque AI es la versión enriquecida del mismo slot (estado degradado = versión base), no una capa adicional. Mantiene la tarjeta estable en `flex-col → md:flex-row`.

**Contenedor** (solo cuando hay `aiAnalysis`): `rounded-2xl bg-black/[0.04] dark:bg-white/[0.05] p-4 space-y-3` — superficie anidada permitida (datos dinámicos dentro de fila `rounded-[1.5rem] bg-white/50 dark:bg-black/25`); sin bordes laterales, sin vidrio nuevo (no es una card).

**Orden de los 5 campos** (arriba → abajo, todos en la columna izquierda `max-w-2xl`):

| # | Campo | Rol visual | Label / estilo |
|---|---|---|---|
| 1 | `plainExplanation` | Cuerpo del bloque, sustituye a `detail` | sin label · `text-sm text-sage-600 dark:text-gray-300` |
| 2 | `legalReference` | Badge en la fila de cabecera del bloque, extremo derecho | §5 |
| 3 | `fiscalRisk` | Texto de riesgo con penalización | label `Riesgo fiscal` · `text-xs uppercase tracking-wider font-semibold text-sage-600 dark:text-gray-300`; cuerpo `text-sm font-medium text-carbon-900 dark:text-white` |
| 4 | `recommendedAction` | Acción concreta | label `Acción recomendada` (mismo estilo label); cuerpo `text-sm font-medium text-carbon-900 dark:text-white` |
| 5 | `confidencePct` | Píldora inline bajo el label `Confianza` | §4 |

**Cabecera del bloque (fila 1):** `flex items-center justify-between gap-2 flex-wrap` → izquierda: label `Análisis IA` (`text-xs uppercase tracking-wider font-semibold text-sage-600 dark:text-gray-300`) precedido de icono `i-lucide-sparkles` `w-4 h-4 text-primary-500 dark:text-[#D4E157]`; derecha: badge de procedencia.

**Badge de procedencia (transparencia obligatoria):** `UBadge color="primary" variant="soft" size="sm" class="rounded-full"` con icono `i-lucide-sparkles` `w-3.5 h-3.5` + texto **`Generado por IA`**. Icono `aria-hidden="true"`. Debajo del bloque (última línea): micro-nota `text-[11px] text-sage-600 dark:text-gray-300`: *"Texto generado por inteligencia artificial; no sustituye asesoría fiscal."* — el cliente siempre sabe que es IA (badge visible + disclaimer).

**Iconografía por campo:** `i-lucide-scale` junto al label `Riesgo fiscal`; `i-lucide-arrow-right` junto a `Acción recomendada`; `i-lucide-gauge` dentro de la píldora de confianza — todos `w-4 h-4`, `aria-hidden="true"`. Solo `i-lucide-*` (§8.4).

**Regla de no duplicación:** si `category === 'LISTA_NEGRA_EFOS_69B'` (la tarjeta ya muestra el badge sólido `Art. 69-B EFOS` arriba), **no** se repite `legalReference` como badge en §5; el artículo sigue citado dentro del texto de `fiscalRisk`. En las demás categorías sí se muestra el badge.

## 2. Estado loading (latencia real Gemini: 8–25 s)

**Decisión: `GlobalLoader` (spinner + texto), no skeletons por tarjeta.** El sync es una acción global que reescribe todas las tarjetas a la vez y el endpoint devuelve todo en una sola respuesta → pintar skeletons por tarjeta sugeriría llegada parcial de datos que no existe.

- Mantener `showLoader(...)` durante todo el tiempo de `GET /api/cfo/sat/audit` (hoy simulado con `setTimeout`; el copy asume la cola real de 8–25 s).
- **Copy exacto del loader** (reemplaza al actual *"Descargando y auditando XMLs del SAT..."*): **`Analizando CFDIs con IA… puede tomar hasta 30 segundos.`** — expectation honesta: promesa de 30 s cubre el peor caso (25 s) sin mentir si hay reintentos.
- El botón `Sincronizar SAT` (desktop y móvil) queda deshabilitado durante todo el bloqueo (`disabled:opacity-50 disabled:cursor-not-allowed`, patrón §5 vigente) — ya no hay sync "relámpago" de 900 ms.
- Tras `hideLoader()`, las tarjetas se pintan en su estado final (con `aiAnalysis` o degradado) — **sin skeleton, sin parpadeo**: el bloque AI entra directo, sin animación de entrada (registro product: motion = estado, no decoración).
- No mostrar `SuccessModal` hasta que la respuesta completa esté; si el endpoint falla, patrón de error de fetch (banner bajo cabecera, §5 *Propuesta* de DESIGN.md) — fuera del alcance de esta spec.

## 3. Estado degradado / fallback

Dos casos distintos, comunicados distinto:

1. **Nunca sincronizado (estado base hoy):** se renderiza solo `detail` tal cual el código actual — **sin badge IA, sin micro-nota**. No anunciar IA que nunca se intentó.
2. **Sync ejecutado pero `aiAnalysis` ausente (Gemini falló para esa anomalía):** se renderiza `detail` + micro-nota inmediatamente debajo, `text-[11px] text-sage-600 dark:text-gray-300` con icono `i-lucide-circle-minus` `w-3.5 h-3.5`: **`Análisis IA no disponible en esta sincronización.`**
   **Por qué no parece bug:** neutro (`sage-600`, cero rojo/alerta), explica *qué pasó* en pasado y ancla a la última sincronización; la tarjeta conserva toda su funcionalidad (badges, impacto, acciones). El rojo queda reservado a `semantic-danger` de la anomalía, no a la ausencia de IA.
- Reintento natural: la siguiente **Sincronizar SAT** vuelve a intentarlo; no se agrega botón de reintento por tarjeta (evita 4 botones de retry por pantalla).

## 4. Estados de confianza (`confidencePct`)

**Umbrales (decisión concreta):**

| Rango | Etiqueta | Tono (tokens exactos) |
|---|---|---|
| ≥ 80 % | `Confianza alta` | `bg-posteal-600/10 text-posteal-600 dark:bg-posteal-400/15 dark:text-posteal-400` |
| 60–79 % | `Confianza media` | `bg-amber-500/20 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300` (patrón warning §2.2) |
| **< 60 %** | **`Requiere revisión manual`** | `bg-error-500/10 text-error-600 dark:bg-error-400/15 dark:text-error-400` |

**< 60 % es el umbral de "requiere revisión manual":** por debajo, la recomendación de la IA no es accionable sola; además del tono error, aparece la hint `text-[11px] text-error-600 dark:text-error-400` bajo la píldora: **`Confianza baja: revisa manualmente antes de actuar.`**

**Presentación:** píldora única `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold`, contenido: icono `i-lucide-gauge` + **porcentaje en `font-mono`** + etiqueta textual (`87% · Confianza alta`). La píldora es el semáforo — **nunca color solo**: el % y la etiqueta van siempre en texto (§5 vigente: "estado siempre visible en badge con texto"). Sin barra de progreso animada (decoración prohibida). Label de grupo: `Confianza` con el estilo label de §1.

## 5. Badge legal (`legalReference` + `fiscalRisk`)

- **Badge:** `UBadge color="error" variant="soft" size="sm" class="rounded-full font-semibold"` con texto exacto de `legalReference` (ej. `Art. 69-B CFF`), en la cabecera del bloque (columna derecha, fila 1). `error-soft` porque el artículo es de riesgo/ley — ya es el vocabulario de la tarjeta (badge `Art. 69-B EFOS` sólido arriba). Sin icono (el texto ES el contenido).
- **`fiscalRisk`:** párrafo debajo del label `Riesgo fiscal` (con `i-lucide-scale`), `text-sm font-medium text-carbon-900 dark:text-white` — peso `medium` para diferenciarlo del `plainExplanation` en `text-sage-600`, y porque la penalización estimada es dato crítico (la cifra dentro del texto va en `font-mono`, regla §8.2).
- Relación: badge = "bajo qué artículo"; `fiscalRisk` = "qué pasa y cuánto cuesta". No se duplica el artículo si la regla de §1 ya lo omite.

## 6. Responsive

- **Estructura no cambia:** el bloque vive 100 % dentro de la columna izquierda de la fila (`flex-col md:flex-row` existente); la columna de acciones (Impacto Mensual + botones) no se toca.
- **< 768 px (`flex-col`):** bloque a ancho completo debajo de `detail`→explicación; label + badge de procedencia en `flex-wrap gap-2` (si no caben, el badge baja a su propia línea, nunca se recorta); píldora de confianza y hint se apilan (`space-y-1`); el texto `text-sm` conserva medida ≤ 65 ch (ya garantizado por `max-w-2xl`).
- **≥ 768 px (`md:flex-row`):** columna izquierda sigue en `max-w-2xl`; dentro del bloque, la fila 1 (label IA ↔ badge) usa `justify-between`; labels `Riesgo fiscal` / `Acción recomendada` / `Confianza` quedan apilados con `space-y-3` (sin grid — 1D, `flex-col`).
- No hay layout alternativo para el bloque por breakpoint (mismo orden de campos en ambos); solo cambia el *wrapping* de la fila 1. El badge `Sincronizar SAT` respeta el patrón obligatorio actual (cabecera desktop / full-width móvil).

## 7. Copy (es-MX exacto, CFO-grade, sobrio)

| Uso | Texto exacto |
|---|---|
| Título/label del bloque | `Análisis IA` |
| Badge de procedencia | `Generado por IA` |
| Disclaimer bajo el bloque | `Texto generado por inteligencia artificial; no sustituye asesoría fiscal.` |
| Labels de campos | `Riesgo fiscal` · `Acción recomendada` · `Confianza` |
| Loading (GlobalLoader) | `Analizando CFDIs con IA… puede tomar hasta 30 segundos.` |
| Mensaje degradado | `Análisis IA no disponible en esta sincronización.` |
| Hint confianza < 60 % | `Confianza baja: revisa manualmente antes de actuar.` |
| Etiquetas de confianza | `Confianza alta` · `Confianza media` · `Requiere revisión manual` |

Reglas: sin emojis, sin hype ("¡revolucionario!"), sin culpar al sistema ni al usuario, anglicismos solo de dominio (CFDI, IA aceptado como sigla de uso en `/flujo` ya usa "badge IA").

## 8. Accesibilidad (WCAG 2.2 AA)

- **Contraste verificado** (pares nuevos, sobre vidrio light `white/50-60` / `carbon-900` dark): `sage-600 #475569` 7.6:1 ✅ · `posteal-600 #22964F` ≈4.9:1 ✅ · `error-600 #DC2626` 4.8:1 ✅ · `amber-700` sobre `amber-500/20` (patrón ya usado) ✅ · `text-carbon-900` 18.2:1 ✅ · dark: `gray-300` 12.4:1, `posteal-400`, `error-400`, `amber-300` ✅ · `dark:text-[#D4E157]` 12.8:1 ✅. **Prohibido** `text-sage-500` en este bloque (3.7–4.1:1 ⚠, DESIGN §6).
- **Bloque dinámico:** contenedor con `role="region"` + `aria-labelledby` apuntando al label `Análisis IA` (no `aria-label` duplicando texto visible). Iconos `aria-hidden="true"` siempre; el texto visible del badge `Generado por IA` es el que anuncia el lector.
- **Anuncio de resultado:** una región `aria-live="polite" role="status"` **una sola vez por sync** (no por tarjeta): `Se agregó análisis de IA a {n} anomalías.` — evita 4 anuncios seguidos. El mensaje del `GlobalLoader` necesita `role="status" aria-live="polite"` (gap DESIGN 9.x, aplica aquí por primera vez).
- **Confianza nunca solo-color:** píldora siempre lleva % + etiqueta textual (§4) — cumple 1.4.1.
- **Targets:** los badges no son interactivos (sin target issue); acciones `Retener Pago`/`Permitir` sin cambios (pills ✅).
- **Reduced motion (4.3.3):** este bloque **no añade animación propia** (entradas ni transiciones). Único movimiento en el flujo: `animate-spin` del `GlobalLoader` + `animate-pulse` de su panel — el spinner es indicador de estado esencial: en `@media (prefers-reduced-motion: reduce)` se sustituye por opacidad fija (`opacity-100`, sin giro) manteniendo el texto de progreso, conforme al bloque global propuesto en DESIGN §6/*Propuesta 9.8*. Cero `animate-shake`/traducciones nuevas.
