# Vespera — sistema visual del rediseño

## 1. Dirección y alcance
Especificación objetivo, no descripción de implementación terminada. Todas las rutas actuales, layouts y modales; sin cambios backend. Urbanist + paleta TastyIgniter aprobadas, vidrio conservado de forma deliberada. Escenario: dirección financiera revisando cifras de día en oficina y de noche durante operación; conservar preferencia light/dark, sin forzar tema. Referencias revisadas: `/tmp/behance-ref/screen-01.webp` (jerarquía/dashboard), `screen-05.webp` (acciones/estados), `screen-08.webp` (navegación y ritmo), `screen-13.webp` (tipografía/paleta), `contact-sheet.png`. No copiar textos, marca, órdenes o productos del POS ni el bajo contraste de sus mockups.

## 2. Color y tokens
Revalorar familias existentes `royal`, `sage`, `carbon`, `posteal`, `posyellow` para evitar romper consumidores. `royal` pasa a ser alias de compatibilidad verde, aunque el nombre sea histórico; no crear un segundo sistema de primarios. `app.config.ts` puede conservar `primary: royal`, `neutral: sage`.

| Familia / pasos | Valores objetivo (orden indicado) |
|---|---|
| royal 50/100/200/300/400/500 | #EFFCF3 / #D9F8E3 / #B5EFC8 / #84E5A3 / #57DA80 / #36D161 |
| royal 600/700/800/900/950 | #218A40 / #196D33 / #15562A / #124624 / #082713 |
| sage 50/100/200/300/400/500 | #F5F8F6 / #EAF0EC / #D6DFD9 / #B7C3BB / #888E89 / #626C65 |
| sage 600/700/800/900/950 | #505B53 / #3B473F / #29362D / #17241B / #070A08 |
| carbon 800/900/950 | #1C2921 / #111A15 / #070A08 |
| posteal 400/500/600 | #57DA80 / #36D161 / #218A40 |
| posyellow 300/400/500 | #F8D777 / #F2AC11 / #AA7000 |

| Rol semántico | Light | Dark |
|---|---|---|
| Fondo / `--ui-bg` | #EDF3EF | #0B120E |
| Muted / elevated / accented | #E4ECE6 / #FFFFFF / #D9F8E3 | #111A15 / #1C2921 / #26392D |
| Texto / destacado | #17241B / #070A08 | #EDF6EF / #FFFFFF |
| Muted y dimmed legibles | #505B53 | #B7C3BB |
| Borde decorativo | #D6DFD9 | #3B473F |
| Borde de controles | #626C65 | #888E89 |
| Enlace y foco | #196D33 | #84E5A3 |
| Marca verde / naranja / amarillo | #36D161 / #FD6941 / #F2AC11 | iguales |
| Error texto / fondo suave | #A52128 / #FDEBEC | #FFB4B8 / #391C21 |
| Éxito texto / fondo suave | #196D33 / #D9F8E3 | #84E5A3 / #173323 |
| Advertencia texto / fondo suave | #714800 / #FFF2CE | #F8D777 / #342A12 |
| Atención naranja texto / fondo suave | #963015 / #FFE9E1 | #FFB29C / #38251D |

Negro #070A08 con texto blanco para navegación activa; verde, naranja y amarillo sólidos siempre con texto #070A08, nunca blanco. #888E89 es color de marca/contorno, no texto pequeño sobre blanco. Información no crítica usa neutral/verde, sin resucitar azul decorativo; errores conservan rojo semántico.

## 3. Tipografía
Reemplazar Public Sans por Urbanist 400/500/600/700, fallback sans-serif; preferir WOFF2 local si disponible y `font-display: swap`, sin añadir módulos innecesarios. H1 32/38 px desktop, 28/34 móvil, peso 600; H2 20/26, H3 18/24; cuerpo 14/22, campos 16/24, etiquetas 14/20, metadata 12/18 solo secundaria. Cifras 28/34 peso 600 con números tabulares, importes alineados a derecha; reservar mono para RFC/UUID/folio. Tracking títulos -0.02em, resto normal. Nada de texto con gradiente ni títulos sistemáticamente uppercase.

## 4. Espaciado y geometría
Escala 4/8/12/16/20/24/32/40/48 px. Contenedor único máximo 1280px; gutters 16 móvil, 24 tablet, 32 escritorio. Secciones 24–32; paneles padding 20 móvil/24 desktop. Radios: controles 12, paneles y modales 16, pills 999. Eliminar radios 24/32 de tarjetas actuales. Altura mínima controles 44px; iconos 18–20. Tablas filas mínimo 48px, separadores suaves y sin sombras por fila.

## 5. Material y elevación
Conservar `.glass-mesh-bg`, ahora fondo light #EDF3EF con dos difusiones estáticas menta (verde 12%) y naranja (6%); dark #0B120E con verde 8% y naranja 4%. Eliminar lavanda, azul, cian, magenta y orbes adicionales del auth. Superficie vidrio blanca 82% light / #17241B al 92% dark, blur 16px; header/modal 95%, blur 20px. Fallback sin blur: elevated opaco. Paneles con borde decorativo de 1px, sin sombra extensa; overlay modal con sombra corta opcional en vez de borde. Evitar vidrio anidado: dentro de paneles usar filas/divisores/fondos semánticos planos. No animar blur ni fondo fijo en móvil.

## 6. Arquitectura del shell
Sustituir sidebar y dock por header superior: marca izquierda, pill-nav centrada, tema y cerrar sesión derecha. Rutas: Panel `/main`, Pulso `/pulso`, Flujo IA `/flujo`, SAT `/sat`, Socios `/socios`. Son enlaces con `aria-current=page`, no tabs ARIA. Activo negro/blanco en ambos temas; en dark contorno #888E89 y peso 700 distinguen selección. Contexto sucursal y socio en segunda fila, separados de navegación; conservar exactamente modelos y condición actual del selector de socio (oculto SAT/Socios). Desktop ≥1024: primera fila 72px, contexto 56px; <1024: marca/acciones arriba, pills desplazables horizontalmente en segunda fila, contexto abajo; nunca ocultar rutas ni logout. En móvil header en flujo normal; no dock duplicado. Detalle en `specs/redesign-system.md`.

## 7. Componentes y estados
Nuxt UI existente: UCard, UButton, USelect, UBadge, UModal; no cambiar librería. Primario verde para ejecutar; creación (Nueva solicitud) naranja como variante explícita; secundario neutral. Navegación activa negra no significa acción destructiva. Hover oscurece sólido suavemente (verde #57DA80 / naranja #FF805E); pressed verde #2DB953 / naranja #E95B35, tinta negra; foco externo 2px con offset 2px. Disabled sin interacción, texto y explicación legibles; loading conserva etiqueta/ancho e impide doble envío. Error contextual persistente con reintento; vacío explica alcance/filtros sin fabricar cifras. Badge combina texto/icono/color. Respetar confirmaciones existentes, no añadir modales a consultas.

## 8. Accesibilidad y movimiento
Objetivo 4.5:1 texto normal, 3:1 texto grande/controles/foco; verificar superficies compuestas reales. Skip link, un h1 por página, landmarks, nombres accesibles de iconos, labels de selects y formularios. Teclado completo; gráficos con resumen/tabla y leyenda textual. Modales con título/description vinculados, focus trap y devolución de foco. Transiciones de color/opacidad 150–200ms; nada de rotaciones, saltos al hover ni pulso permanente. Reduced motion desactiva spinner, pulse y transiciones dejando mensaje de progreso visible. No comunicar estado solo mediante color.

## 9. Entrega y verificación
Contrato detallado: `specs/redesign-system.md`. Estado documental: `partially_verified`: fuentes y referencias inspeccionadas; no UI implementada ni auditoría de contraste renderizado, typecheck o navegador ejecutados. Frontend debe registrar resultados en `specs/implementation-summary.md`, correr typecheck/lint/build según scripts y QA de las siete rutas en light/dark, 320/390/768/1024/1440px, teclado, zoom y estados. Mantener stores, API, permisos y bloques IA intactos. No se necesita nuevo `api-contract.md`.
