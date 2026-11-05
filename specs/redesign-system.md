# Contrato de implementación — rediseño integral

## Alcance y precedencia
Leer `DESIGN.md` y `PRODUCT.md`. Aplicar a `app/assets/css/main.css`, `app/app.config.ts`, `app/layouts/{default,auth}.vue`, todas las páginas y `app/components/{ConfirmModal,SuccessModal,GlobalLoader}.vue`. Nuxt 4 + Nuxt UI existente; `nuxt.config.ts` ya carga CSS y no requiere cambio funcional. No tocar servicios, contratos, stores, autenticación, cálculos o permisos. Documentos previos específicos de SAT, si existen, siguen vigentes en contenido/seguridad. El rediseño solo cambia presentación y semántica accesible, no elimina IA.

## Migración de tokens
1. Revalorar familias y variables UI de DESIGN §2; conservar alias existentes. Añadir tokens semánticos para naranja, vidrio, foco y estados, no hex repetidos en vistas.
2. Quitar en `app.config.ts` la regla universal `primary solid → text-white`: primario marca requiere tinta negra; auditar success/warning/info y mapas de iconos de ConfirmModal. `info` será neutral/verde con contraste coherente. Mantener variantes de error rojo con contraste verificado.
3. Sustituir colores hardcoded (indigo, sky, cyan, purple, #D4E157, #8B80F9, #635BFF, etc.), incluidos arrays de clases en scripts. No basta cambiar CSS global. Azul semántico externo no debe borrarse sin revisar significado, pero no hay rol azul decorativo en el sistema objetivo.
4. Reemplazar `rounded-[2rem]`, `rounded-[1.5rem]`, shadow-2xl y vidrio anidado conforme DESIGN. No borrar imágenes legítimas ni overlays de legibilidad de fotografías.
5. Urbanist para UI e importes tabulares; conservar RFC/folios mono. Ajustar etiquetas antiguas 10/11px a mínimo 12px y principales a 14px.

## Shell y navegación
- `default.vue`: retirar aside, dock y padding lateral `md:pl-28`; ancho y ejes compartidos por header y main. Desktop primera fila tres columnas: marca, navegación centrada, utilidades. Nav con padding 4px, gap 4, enlaces 44px alto y padding horizontal 16px; contenedor pill vidrio. Las cinco etiquetas cortas caben sin depender de nombres largos actuales.
- La ruta activa es negra con texto blanco; hover inactivo neutral, foco independiente del activo. Dar nombres completos accesibles (p.ej. “Pulso: Punto de Equilibrio y P&L”) sin perder etiqueta visible.
- Segunda fila: “Sucursal” y “Socio” labels visibles, selector de socio solo donde hoy aparece. La identidad autenticada no cambia al seleccionar socio analítico. No presentar selector como menú de sesión.
- <1024px: utilidades tema/logout conservadas arriba; nav ancho disponible con scroll horizontal local y foco visible, hacer visible enlace activo sin animación obligatoria. Selectores 2 columnas desde 640px y apilados debajo; nombres largos se ajustan sin desbordar. Sin fijar header alto sobre contenido en móvil.
- Menús/selects en portal fuera de overflow de nav. Z-index: dropdown 20, sticky header 30, backdrop 40, modal 50, loader bloqueante 60, toast 70, tooltip 80; todos los overlays portados fuera de stacking contexts.
- Theme switch persiste preferencia usando mecanismo actual, sin flash incorrecto en hidratación. Logout mantiene confirmación y debe existir también en móvil.

## Adaptación por ruta
| Archivo | Jerarquía y composición objetivo | Invariantes |
|---|---|---|
| `index.vue` | Pantalla transitoria mínima con fondo del tema, indicador verde y texto “Abriendo Vespera…”, status accesible. | Conservar redirección auth; no convertir en landing ni cambiar cookies. |
| `login.vue` + `auth.vue` | Panel vidrio max 1024px; formulario y fotografía existente en 2 columnas ≥1024, formulario primero y fotografía secundaria debajo u oculta en móvil si decorativa. Campos 44px+, labels persistentes, submit verde. Texto de imagen sólido con overlay oscuro legible; sin gradiente en letras, sin orbes azules. | Misma validación Zod, login/loading/error y acciones actuales; sin testimonios ni datos ficticios. |
| `main.vue` | Título/sucursal y estado de sincronización con Actualizar. Banda de equilibrio plana sobre vidrio, barra verde sólida, meta y ventas visibles. Resumen directivo como cuatro enlaces 2×2 desktop/una columna móvil; retirar tarjeta exterior anidada. Cifra, nombre del destino y descripción, icono neutral y flecha discreta; no rotación. | Las cuatro rutas y métricas existentes, participación y fetchReservations. No fabricar estado “en vivo” si falló sync. La barra actual fija 88% es deuda existente: no cambiar cálculos silenciosamente ni presentarla como nueva cifra validada. |
| `pulso.vue` | Tres métricas compactas arriba (3/1 columnas), P&L dominante y semáforo lateral (2:1 ≥1024, apilado antes). Desglose operativo y por zonas después. Filas financieras con importes tabulares a derecha, totales peso 700; color acompaña signo y etiqueta. | Conservar cascada P&L, punto equilibrio, indicadores, reservas, desglose Cava/Terraza/Salón y acciones/datos presentes. |
| `flujo.vue` | Título con badge IA neutral/menta y Recalcular. Simulador visible antes de cuatro métricas (4/2/1 columnas). Escenarios como controles seleccionables con estado accesible; CAPEX con pressed/switch correcto. Tabla 13 semanas ocupa ancho; análisis IA en sección siguiente. | Conservar multiplicadores 0.85/1/1.2, CAPEX, proyección, tablas, fuentes y bloques IA completos. No cambiar modelos ni defaults numéricos. Recalcular muestra progreso y preserva resultado anterior identificado durante espera. |
| `sat.vue` | Título/última sync + acción verde. Lista de anomalías con separadores en un panel, no tres capas de cards. Cada ítem: severidad/estado, folio/sucursal, proveedor/RFC, análisis IA, importes y acciones. Bloque IA plano con encabezado y párrafos legibles, sin colapsarlo por defecto. | Conservar EFOS/69-B, badges legales, fallback, confianza/advertencias, aria-live y vínculos regionales existentes, recuperación y acciones de bloqueo/permitir. No cambiar umbrales ni ocultar advertencias. |
| `socios.vue` | Identidad de sesión en banda discreta, título y Nueva solicitud naranja. Mantener split 7/5 desktop, una columna móvil: solicitudes/firmas primero, socios/dividendos después. Filas con estados y acciones contextuales; firma visible pero no más prominente que importe/proveedor. | Sesión, roles, participación, autorizaciones mancomunadas, creación/edición, restricciones y estados actuales sin cambios. Selector analítico de socio sigue oculto. |

## Tablas, cifras y contenido largo
No ocultar columnas financieras para “limpiar”. En móvil tabla en región con scroll horizontal local, nombre accesible y pista de desplazamiento; ancho de página nunca desborda. Alternativa de filas apiladas solo si conserva cada valor y su etiqueta. RFC/UUID permiten wrap; importes no se parten dentro del número. Moneda y fecha mantienen formatos existentes. Ninguna cifra negativa sin signo. Gráficas usan verde para ingreso, naranja para salida y amarillo para advertencia; sumar etiquetas/leyendas/patrones de línea y alternativa textual. Si una marca gráfica clara no alcanza 3:1, usar trazo verde #196D33 light o #84E5A3 dark.

## Modales y feedback global
- `ConfirmModal.vue`: max 480px, padding 24/20px, radio 16. Título 20/26, descripción 14/22, detalles como lista plana con label/valor. Cancelar neutral; confirmar según semántica, nunca recolorear una acción destructiva a verde/naranja solo por marca. Foco inicial Cancelar para acción irreversible, título/description asociados, Escape según flujo vigente y devolución al disparador.
- `SuccessModal.vue`: mismo material/geometría; icono verde con tinta negra, detalle legible, botón Aceptar verde. Mantener contrato/composable y no cambiar automáticamente a toast.
- Crear/editar en `socios.vue`: max 560px, labels persistentes, errores bajo campo y resumen cuando proceda. Body scroll con max-height 90dvh, acciones fuera del área scroll si necesario; viewport estrecho margen 16px, botones apilados sin invertir orden de foco. Valor escrito no desaparece tras fallo de envío; evitar doble submit.
- `GlobalLoader.vue`: mantener bloqueo solamente en operaciones que ya lo usan; fondo negro 45%, panel vidrio 95%, radio 16. Mensaje visible y role=status, área ocupada con aria-busy, impedir activación de controles detrás sin perder foco. Reduced motion deja anillo estático + texto. No sustituir contenido cargado por blanco.
- Popovers y menús: superficie elevated casi opaca, radio 12, foco visible, controles 44px. En estados vacíos/error no reutilizar mensajes de éxito ni mostrar 0 como sustituto de dato desconocido.

## Estados requeridos
Cada componente interactivo: normal, hover, focus-visible, pressed/selected, disabled, loading y error pertinente. Cada superficie de datos: primera carga con skeleton estable, datos, vacío real, error con reintento y actualización con contenido anterior. Mensajes en español; mantener textos jurídicos exactos. Distinguir “sin resultados” de “sin acceso” y “sin conexión”. Alertas/errores persistentes cerca de acción; aria-live polite para resultados no urgentes, sin anunciar toda tabla repetidamente. Ningún estado depende solo de color.

## Orden de trabajo y aceptación
1. Capturar baseline funcional de rutas/acciones; CSS y app.config; shell/auth; páginas; modales. No sustituir app completa por maqueta.
2. Revisar instancias hardcoded y clases generadas, estados loading/error/empty y contrastes de primarios (especial atención a texto blanco heredado).
3. Ejecutar scripts existentes de typecheck, lint y build (mínimo Nuxt: `npx nuxi typecheck`); registrar comandos/salida, no afirmar éxito si no se ejecutaron.
4. QA navegador light/dark a 320, 390, 768, 1024 y 1440px: siete rutas, nav cinco destinos, selects, theme/logout, recálculo, SAT, crear/editar/confirmar, estados IA exitoso/fallback/error. Sin desbordamiento global, overlays recortados ni pérdida de campos.
5. Teclado Tab/Shift+Tab/Enter/Escape; enlace skip, focus trap/return, zoom 200% y reflow a 320 CSS px; contraste de texto 4.5:1 y controles 3:1 sobre vidrio compuesto. Probar reduced motion y fallback sin backdrop-filter. Contraste de mockups no sirve como evidencia.
6. Comparar datos y operaciones antes/después; ninguna API/store modificada. Entregar `specs/implementation-summary.md` con archivos, evidencias, pruebas y deuda fuera de alcance. Designer realiza QA final antes de declarar PASS.

## Verificación de esta especificación
`partially_verified`: inspeccionados CSS, configuración, layouts, estructura de todas las páginas, componentes globales y las cinco referencias indicadas. No se ha modificado código ni backend. Falta verificación runtime/contraste y regresión de la futura implementación. La paleta dark y ajustes accesibles son adaptación Vespera, no se atribuyen a la referencia.
