# REPÚBLICA

## Simulador político, institucional y geopolítico de El Salvador

**Documento maestro / README para asistentes de IA**\
**Versión:** 1.3 --- Especificación consolidada\
**Estado:** Diseño aprobado; pendiente de implementación\
**Idioma del proyecto:** Español\
**Plataforma inicial:** PC, navegador web\
**Uso previsto:** Proyecto privado y personal\
**Género:** Simulación política, estrategia territorial, gestión estatal
y gran estrategia geopolítica

------------------------------------------------------------------------

# 0. INSTRUCCIONES PARA LA IA QUE RECIBA ESTE DOCUMENTO

Este archivo es la fuente principal de requisitos de REPÚBLICA. Léelo
completo antes de proponer cambios o escribir código.

Tu función es ayudar a diseñar, construir, probar y mantener un
simulador político profundo, modular y funcional. No conviertas el
proyecto en una simple maqueta visual ni intentes implementar todos los
sistemas de una sola vez.

## Reglas obligatorias de trabajo

1.  Trata este README como la especificación funcional de referencia.
2.  Antes de programar, inspecciona la estructura existente del proyecto
    y explica qué archivos y sistemas ya existen.
3.  No reemplaces ni elimines código funcional sin una razón técnica
    clara y autorización.
4.  No dupliques sistemas, estados, componentes ni reglas.
5.  Mantén separadas la interfaz, los datos, las reglas y el motor de
    simulación.
6.  Implementa por módulos pequeños y verificables.
7.  Cada función visible debe funcionar realmente; no basta con dibujar
    botones o paneles.
8.  Añade pruebas para cálculos, turnos, elecciones, votaciones,
    guardado y carga.
9.  Mantén TypeScript estricto si el proyecto utiliza TypeScript.
10. Actualiza este README o los documentos técnicos relacionados cuando
    cambie el diseño.
11. No inventes datos históricos ni presentes acontecimientos ficticios
    como hechos reales.
12. Registra fuente, fecha, unidad y escenario de cada conjunto de datos
    reales.
13. No uses IA generativa para decidir directamente resultados
    matemáticos fundamentales. Los cálculos importantes deben ser
    reproducibles mediante reglas de código.
14. Si una petición entra en conflicto con la arquitectura o con una
    regla ya definida, explica el conflicto y propone una solución
    compatible.
15. No intentes construir todas las fases en una sola entrega. Trabaja
    en el siguiente incremento acordado y deja el proyecto ejecutable.

## Formato esperado al trabajar en el proyecto

Antes de cada implementación importante, presenta: - Objetivo del
incremento. - Sistemas afectados. - Archivos que planeas crear o
modificar. - Dependencias. - Riesgos de compatibilidad. - Pruebas de
aceptación.

Después de implementarlo, informa: - Qué se implementó. - Qué archivos
cambiaron. - Cómo ejecutar el proyecto. - Qué pruebas se realizaron y
sus resultados. - Qué queda pendiente.

------------------------------------------------------------------------

# 1. VISIÓN GENERAL

REPÚBLICA será un simulador político de El Salvador que permitirá al
jugador construir una organización política, competir por influencia
territorial, participar en elecciones, controlar instituciones,
gobernar, cambiar el régimen político y desarrollar una estrategia
internacional.

La experiencia toma como referencia funcional el juego argentino
**¿Quién quiere gobernar?**, especialmente su estructura de navegación,
tarjetas de acciones, gestión de recursos, organización partidaria,
expansión territorial, apoyos, candidaturas, coaliciones y campañas.

La intención es adaptar y ampliar esas ideas al contexto salvadoreño. Se
desarrollará una implementación propia, con código, textos, interfaz y
recursos gráficos propios. No se dependerá de copiar código o materiales
protegidos del juego de referencia.

REPÚBLICA debe evolucionar desde un simulador político nacional hacia un
simulador político, institucional y geopolítico de gran escala.

## Principios fundamentales

-   **Profundidad:** numerosos sistemas, acciones y decisiones.
-   **Realismo:** recursos limitados, instituciones, reglas y
    consecuencias.
-   **Libertad:** rutas democráticas, reformistas, autoritarias,
    revolucionarias y escenarios alternativos.
-   **Interconexión:** las decisiones afectan otros sistemas.
-   **Neutralidad ideológica:** las mecánicas no deben favorecer
    artificialmente una ideología.
-   **Adaptación salvadoreña:** instituciones, territorio, historia y
    reglas electorales propias de El Salvador.
-   **Modularidad:** los sistemas deben poder ampliarse sin rehacer el
    proyecto.
-   **Persistencia:** las partidas se guardan y pueden continuar.
-   **Reproducibilidad:** los resultados del motor deben poder
    explicarse y probarse.

------------------------------------------------------------------------

# 2. MODOS DE JUEGO

## 2.1 Modo realista

Simula restricciones institucionales, económicas y políticas.

Incluye: - Presupuestos limitados. - Costos de acciones. - Requisitos
organizativos y legales. - Calendarios electorales. - Recursos humanos
limitados. - Negociaciones. - Oposición política. - Consecuencias
económicas y sociales. - Acontecimientos inesperados. - Reglas
institucionales específicas del escenario.

## 2.2 Modo sandbox

Permite experimentar y alterar variables de la partida.

Opciones: - Dinero y recursos configurables. - Indicadores nacionales
modificables. - Fechas electorales configurables. - Creación libre de
partidos. - Modificación de apoyos e influencia. - Eventos
personalizados. - Control de múltiples facciones. - Avance de turnos. -
Ajustes de reglas y condiciones iniciales.

Las modificaciones de sandbox deben quedar registradas y no corromper el
estado de la partida.

## 2.3 Modo histórico

Permite iniciar partidas desde escenarios basados en períodos concretos.

Ejemplos de escenarios que podrán desarrollarse: - Escenarios históricos
de elecciones salvadoreñas. - Escenario político de 2024. - Escenario
previo a elecciones futuras. - Escenarios alternativos creados por el
usuario.

Los datos de cada escenario deben corresponder a su período. No se deben
mezclar estadísticas de años diferentes como si fueran simultáneas.

## 2.4 Escenarios alternativos

El jugador podrá crear situaciones ficticias: nuevos partidos,
resultados electorales alternativos, crisis institucionales, gobiernos
distintos, cambios constitucionales y relaciones internacionales
hipotéticas.

Todo contenido ficticio debe identificarse como tal.

------------------------------------------------------------------------

# 3. EL SALVADOR: TERRITORIO Y MAPA

El Salvador será el escenario nacional inicial.

## 3.1 División territorial

El modelo debe poder representar: - 14 departamentos. - 44 municipios,
según la organización municipal vigente desde 2024. - Distritos como
unidades territoriales cuando el escenario lo requiera.

La estructura territorial debe ser dependiente del escenario y de la
fecha, para que los datos históricos puedan representar divisiones
anteriores cuando corresponda.

Cada departamento y municipio podrá tener: - Población. - Electores
registrados. - Participación electoral. - Apoyo por partido. -
Influencia política. - Organización partidaria. - Actividad económica. -
Indicadores sociales. - Infraestructura. - Gobierno local. - Historial
electoral.

## 3.2 Mapa nacional interactivo

Capas previstas: 1. Apoyo electoral. 2. Influencia política. 3.
Organización partidaria. 4. Partido gobernante de cada municipio. 5.
Resultados históricos. 6. Indicadores económicos. 7. Población. 8.
Actividad política.

Funciones: - Seleccionar departamentos y municipios. - Consultar fichas
territoriales. - Comparar territorios. - Ver resultados electorales. -
Mostrar zonas disputadas. - Consultar presencia de partidos. - Filtrar
por partido, fecha y variable.

El mapa debe usar datos geográficos reales y verificables. No inventar
fronteras ni geometrías.

------------------------------------------------------------------------

# 4. PARTIDOS POLÍTICOS

## 4.1 Tipos de partidos

El juego incluirá: - Partidos reales salvadoreños. - Partidos ficticios
generados por el juego. - Partidos personalizados creados por el
jugador.

Los partidos reales deben estar asociados a un período y utilizar
información verificable. No atribuir ideologías, propuestas o hechos sin
respaldo o sin indicar que pertenecen a un escenario ficticio.

## 4.2 Creación de partidos

El jugador podrá configurar: - Nombre. - Siglas. - Logotipo propio o
seleccionado. - Color principal y secundario. - Lema. - Ideología y
orientación política. - Posiciones económicas y sociales. -
Principios. - Objetivos. - Programa político. - Dirigentes. - Sede
principal.

## 4.3 Atributos partidarios

Cada partido tendrá estadísticas: - Reconocimiento público. -
Organización interna. - Capacidad territorial. - Recursos económicos. -
Militancia. - Cohesión interna. - Capacidad de comunicación. -
Experiencia electoral. - Relaciones políticas. - Credibilidad.

Los atributos deben tener límites y reglas de evolución documentadas.

## 4.4 Afiliados y estructura

Acciones: - Reclutar afiliados. - Organizar reuniones. - Crear equipos
territoriales. - Abrir sedes. - Designar responsables. - Capacitar
militantes. - Gestionar conflictos internos. - Organizar asambleas
partidarias. - Fortalecer estructuras municipales y departamentales.

Los afiliados podrán tener experiencia, actividad, compromiso y
ubicación territorial.

------------------------------------------------------------------------

# 5. CONQUISTA E INFLUENCIA TERRITORIAL

La conquista territorial será política, electoral, organizativa y
diplomática; no una conquista militar dentro de El Salvador.

Se distinguirán tres conceptos:

### Influencia

Capacidad de un partido para mantener presencia, relaciones y actividad
en un territorio.

### Apoyo electoral

Respaldo ciudadano simulado e intención de voto. No equivale
automáticamente a control institucional.

### Control institucional

Control de una alcaldía u otro cargo como resultado del procedimiento
electoral correspondiente.

## 5.1 Acciones territoriales

-   Expandir influencia.
-   Consolidar presencia.
-   Abrir una sede territorial.
-   Negociar apoyo local.
-   Incorporar dirigentes.
-   Organizar actividades comunitarias.
-   Fortalecer municipios aliados.
-   Competir por alcaldías.
-   Recuperar presencia perdida.

## 5.2 Competencia

Los partidos rivales compiten por los mismos territorios. El resultado
depende de recursos, organización, influencia previa, apoyo, actividad
de competidores y acontecimientos.

Un partido puede tener organización fuerte sin ser el más votado. No
confundir estructura partidaria, intención de voto y resultado
electoral.

------------------------------------------------------------------------

# 6. SISTEMA DE ACCIONES

La interfaz de acciones estará inspirada en las tarjetas de acción del
juego de referencia.

Cada acción tendrá: - Nombre. - Descripción. - Categoría. - Costo
económico. - Costo de tiempo o puntos de acción. - Requisitos. -
Territorio. - Efectos posibles. - Efectos secundarios. - Probabilidad de
resultado cuando corresponda. - Tiempo de recuperación. - Historial.

## 6.1 Campaña

-   Recorrida territorial.
-   Acto partidario.
-   Mitin político.
-   Entrevista.
-   Debate.
-   Conferencia de prensa.
-   Publicidad.
-   Publicidad digital.
-   Visita comunitaria.
-   Encuentro con simpatizantes.
-   Lanzamiento de propuestas.
-   Presentación de candidatos.
-   Gira departamental.

## 6.2 Organización

-   Reclutar afiliados.
-   Crear o fortalecer sedes.
-   Formar equipos.
-   Designar responsables.
-   Reunirse con afiliados.
-   Capacitar militantes.
-   Crear estructura municipal.
-   Crear estructura departamental.
-   Organizar asambleas.
-   Resolver conflictos internos.

## 6.3 Comunicación

-   Entrevistas en televisión y radio.
-   Conferencias.
-   Publicaciones.
-   Campañas digitales.
-   Comunicados.
-   Debates públicos.
-   Presentación de propuestas.
-   Giras de medios.
-   Gestión de crisis comunicacionales.

## 6.4 Negociación y sectores

-   Negociar coaliciones.
-   Buscar apoyo legislativo.
-   Reunirse con dirigentes.
-   Negociar acuerdos programáticos.
-   Construir alianzas municipales.
-   Formar bloques legislativos.
-   Reunirse con empresarios, productores, trabajadores, comerciantes,
    estudiantes, asociaciones profesionales y organizaciones
    comunitarias.

Los grupos tendrán intereses propios y podrán aceptar, rechazar o
condicionar acuerdos. Una reunión no debe garantizar apoyo automático.

## 6.5 Financiamiento

-   Recaudación de fondos.
-   Donaciones permitidas.
-   Eventos de recaudación.
-   Administración de recursos.
-   Auditoría financiera.
-   Campañas de afiliación.

El financiamiento debe respetar las reglas legales configuradas en el
escenario. No presentar prácticas ilícitas como mecanismos legítimos.

## 6.6 Acciones desbloqueables

Algunas acciones requerirán: - Nivel organizativo. - Número de
afiliados. - Recursos suficientes. - Presencia territorial. - Posición
institucional. - Etapa política específica.

El catálogo debe ser extensible mediante datos y reglas, sin tener que
reescribir el motor.

------------------------------------------------------------------------

# 7. APOYOS Y ACTORES POLÍTICOS

Se distinguirán: - Apoyo ciudadano. - Apoyo territorial. - Apoyo de
dirigentes. - Apoyo de organizaciones. - Apoyo legislativo. - Apoyo
sectorial. - Apoyo de afiliados.

Los apoyos pueden cambiar por conflictos, acuerdos, acontecimientos,
desempeño, incumplimientos y evolución de la opinión pública.

------------------------------------------------------------------------

# 8. CANDIDATURAS Y COALICIONES

## 8.1 Cargos

-   Presidencia.
-   Vicepresidencia.
-   Diputaciones.
-   Concejos municipales.
-   Alcaldías, según la estructura y reglas del escenario.

Los candidatos tendrán: - Nombre. - Biografía. - Trayectoria. -
Reconocimiento. - Experiencia política. - Apoyo. - Características de
campaña. - Relaciones partidarias.

Los personajes ficticios deben identificarse como ficticios. No inventar
biografías de personas reales.

## 8.2 Coaliciones

Tipos: - Coaliciones electorales. - Acuerdos legislativos. - Alianzas
municipales. - Pactos de gobierno. - Acuerdos programáticos.

Las coaliciones tendrán beneficios, costos, condiciones y posibles
conflictos.

------------------------------------------------------------------------

# 9. ELECCIONES

El sistema debe representar, según el escenario y la normativa vigente
en ese período: - Elecciones presidenciales. - Elecciones
legislativas. - Elecciones municipales. - Elecciones internas
partidarias cuando correspondan.

## 9.1 Campaña electoral

El jugador podrá: - Presentar candidatos. - Crear un programa de
gobierno. - Elegir prioridades. - Ejecutar acciones. - Organizar
debates. - Realizar recorridos. - Administrar recursos. - Negociar
alianzas. - Consultar intención de voto.

## 9.2 Cálculo de resultados

Los resultados deben considerar: - Apoyo territorial. - Intención de
voto. - Participación. - Reconocimiento de candidatos. - Organización. -
Coaliciones. - Acontecimientos. - Desempeño de campaña. - Reglas
electorales del escenario.

No producir resultados arbitrarios. Separar los algoritmos de los datos
históricos y de la interfaz.

## 9.3 Representación legislativa

El número de escaños, circunscripciones, fórmula electoral y reglas de
asignación deben depender del escenario histórico. El motor debe
permitir configurar las reglas sin reescribir el algoritmo central.

------------------------------------------------------------------------

# 10. ASAMBLEA LEGISLATIVA: SISTEMA FUNDAMENTAL

**El Salvador tiene una Asamblea Legislativa unicameral; no tiene Senado
ni un Congreso bicameral.** Los escenarios salvadoreños históricos deben
representar la Asamblea Legislativa, no inventar una segunda cámara.

El sistema legislativo debe ser uno de los pilares del juego.

## 10.1 Composición

La Asamblea incluirá: - Diputados por partido. - Diputados
independientes cuando corresponda. - Presidencia legislativa. - Junta
Directiva. - Comisiones. - Bloques parlamentarios. - Mayorías y
minorías. - Cambios de bancada. - Coaliciones legislativas.

El número de diputaciones debe depender del escenario. Por ejemplo, el
período legislativo 2024-2027 tiene 60 diputaciones. No asumir que ese
número sirve para todos los períodos históricos o futuros.

## 10.2 Independencia entre Ejecutivo y Legislativo

El jugador puede: - Ganar la presidencia sin controlar la Asamblea. -
Ganar mayoría legislativa sin ganar la presidencia. - Gobernar con una
coalición. - Enfrentar una Asamblea opositora. - Tener una mayoría
frágil. - Perder votaciones. - Negociar leyes y acuerdos.

Controlar el Ejecutivo no significa controlar automáticamente el
Legislativo.

## 10.3 Control parlamentario

Funciones: - Elegir la presidencia legislativa mediante el procedimiento
correspondiente. - Negociar la Junta Directiva. - Buscar presidencias de
comisiones. - Distribuir representación en comisiones. - Negociar
agendas legislativas. - Formar bloques. - Negociar con diputados
independientes. - Gestionar divisiones de bancada.

La composición y elección de órganos internos deben seguir las reglas
del escenario.

## 10.4 Proceso legislativo jugable

El jugador podrá: 1. Presentar una iniciativa cuando esté facultado. 2.
Remitirla a la comisión correspondiente. 3. Discutirla. 4. Modificarla.
5. Obtener un dictamen cuando proceda. 6. Llevarla al pleno. 7.
Debatirla. 8. Votar. 9. Verificar quórum y mayoría requerida. 10.
Remitirla al Ejecutivo para el procedimiento correspondiente. 11.
Gestionar sanción, observaciones o veto cuando aplique. 12. Registrar
publicación y entrada en vigor cuando corresponda.

El proceso debe modelar las reglas reales del escenario, no asumir que
todas las leyes siguen exactamente el mismo procedimiento.

## 10.5 Votación de diputados

Cada diputado tendrá: - Partido o condición independiente. - Bancada. -
Posición sobre el proyecto. - Lealtad partidaria. - Relaciones
políticas. - Intereses simulados. - Historial de votaciones. -
Posibilidad de cambiar de posición por negociación o acontecimientos.

Votos posibles: - A favor. - En contra. - Abstención.

Las mayorías y el quórum serán configurables por tipo de asunto y
escenario. No aplicar una mayoría única a todas las decisiones. Las
reformas constitucionales y otros asuntos especiales requieren reglas
diferenciadas.

Ejemplo puramente ilustrativo de una Asamblea de 60 integrantes: - 34
votos a favor. - 20 votos en contra. - 6 abstenciones. - Resultado:
aprobado si se cumple la mayoría aplicable.

## 10.6 Tipos de proyectos

-   Presupuesto nacional.
-   Reformas tributarias.
-   Educación.
-   Salud.
-   Seguridad.
-   Infraestructura.
-   Desarrollo económico.
-   Reformas institucionales.
-   Reformas constitucionales.
-   Tratados y acuerdos cuando corresponda.
-   Leyes creadas por el jugador dentro de las competencias del
    escenario.

## 10.7 Ejecutivo y Asamblea

-   El presidente no puede aprobar leyes unilateralmente.
-   La Asamblea puede rechazar iniciativas.
-   El Ejecutivo puede utilizar los mecanismos constitucionales
    aplicables.
-   Puede haber observaciones y veto cuando la normativa lo contemple.
-   Las coaliciones pueden facilitar o dificultar la gobernabilidad.
-   Los desacuerdos pueden generar crisis políticas.

## 10.8 Crisis y ocupación institucional

Se podrán generar escenarios ficticios de ruptura institucional,
ocupación forzada de instituciones, interrupción de sesiones, intentos
de disolución, gobiernos de emergencia y transiciones.

Una ocupación ficticia de la Asamblea puede provocar: - Fracaso. -
Crisis institucional. - Suspensión de sesiones. - Ruptura
constitucional. - Gobierno de transición. - Negociación para restaurar
las sesiones. - Conflicto nacional. - Reorganización institucional.

La ocupación no concede automáticamente legitimidad ni control jurídico.
Los diputados, instituciones y reconocimiento internacional pueden
continuar existiendo.

Las acciones violentas se representan de forma abstracta y narrativa,
con consecuencias y sin instrucciones operativas para realizar ataques,
secuestros, atentados u ocupaciones reales.

------------------------------------------------------------------------

# 11. GOBIERNO Y ADMINISTRACIÓN DEL ESTADO

Al ganar la presidencia se desbloquea una etapa de gobierno.

## 11.1 Presidencia

-   Establecer prioridades.
-   Nombrar funcionarios dentro de sus competencias.
-   Dirigir el gabinete.
-   Presentar iniciativas.
-   Administrar recursos.
-   Coordinar instituciones.
-   Gestionar acontecimientos nacionales.

## 11.2 Ministerios y áreas

Posibles áreas: - Hacienda. - Economía. - Educación. - Salud. -
Seguridad. - Defensa. - Obras Públicas. - Relaciones Exteriores. -
Agricultura. - Medio Ambiente. - Trabajo. - Gobernación.

La estructura ministerial debe ser configurable por escenario. No asumir
que todas las denominaciones institucionales permanecen iguales
históricamente.

## 11.3 Instituciones y justicia

Incluir instituciones independientes, controles y competencias. No
convertir automáticamente al sistema judicial en una herramienta del
presidente.

Se simularán: - Competencias. - Procedimientos. - Controles. -
Conflictos institucionales. - Límites legales. - Crisis
constitucionales.

------------------------------------------------------------------------

# 12. RUTAS POLÍTICAS Y CAMBIOS DE RÉGIMEN

El jugador no está obligado a seguir una carrera democrática.

Rutas posibles: - Democrática. - Reformista. - Autoritaria. -
Dictatorial. - Revolucionaria. - Militar. - Nacionalista. -
Tecnocrática. - Expansionista.

Las rutas no son exclusivas por ideología. Partidos de distintas
corrientes podrán adoptar diferentes estrategias según el escenario.

## 12.1 Derrota electoral y continuidad

Perder una elección no termina la partida.

Opciones: - Aceptar la derrota. - Reorganizar el partido. - Fortalecer
oposición. - Participar en elecciones futuras. - Formar coaliciones. -
Impugnar resultados mediante mecanismos institucionales. - Convocar
movilización política. - Atravesar una crisis de partido. - Participar
en un escenario revolucionario ficticio.

## 12.2 Protestas, huelgas y levantamientos

Variables: - Descontento social. - Legitimidad del gobierno. - Apoyo
popular. - Organización de la oposición. - Cohesión institucional. -
Situación económica. - Apoyo territorial. - Respuesta gubernamental.

Resultados posibles: - Negociación. - Concesiones. - Crisis de
gobierno. - Cambio de gabinete. - Elecciones anticipadas si el escenario
lo permite. - Gobierno provisional. - Revolución ficticia. - Fracaso del
levantamiento. - Conflicto interno.

## 12.3 Golpes y rupturas constitucionales

El juego podrá representar intentos de golpe de Estado y cambios
extraconstitucionales como sistemas abstractos de estrategia y eventos
narrativos.

Resultados: - Fracaso. - Crisis institucional. - Gobierno de
transición. - Cambio de gobierno. - Ruptura constitucional. - Conflicto
interno.

No incluir instrucciones tácticas, logísticas u operativas para ejecutar
golpes reales.

## 12.4 Dictaduras y autoritarismo

Posibilidades de simulación: - Concentración de atribuciones
ejecutivas. - Modificación de instituciones. - Reducción de
contrapesos. - Restricciones a la competencia partidaria. - Cambios de
reglas electorales. - Gobiernos de emergencia. - Restauración
institucional. - Transiciones democráticas.

Consecuencias: - Cambios de legitimidad. - Resistencia. - Reacciones
internacionales. - Sanciones. - Fuga de capitales. - Protestas. -
Aislamiento diplomático. - Conflictos institucionales.

El régimen no otorga poder ilimitado ni elimina las consecuencias.

------------------------------------------------------------------------

# 13. INTELIGENCIA, ESPIONAJE Y CONSPIRACIONES

El juego incluirá una agencia de inteligencia y sistemas de operaciones
políticas ficticias.

Funciones: - Crear una agencia. - Obtener informes. - Investigar
partidos rivales. - Descubrir conspiraciones. - Detectar
infiltraciones. - Investigar corrupción. - Desarrollar
contrainteligencia. - Detectar operaciones extranjeras. - Gestionar
filtraciones. - Desarticular conspiraciones. - Resolver operaciones
encubiertas abstractas.

Categorías de eventos: - Espionaje. - Contrainteligencia. -
Filtración. - Desinformación. - Sabotaje institucional abstracto. -
Conspiración. - Operación encubierta.

El sistema puede representar terrorismo y violencia política como
acontecimientos ficticios de alto nivel y consecuencias sobre víctimas,
estabilidad, legitimidad y relaciones internacionales. No proporcionar
procedimientos, selección de objetivos, armas, explosivos, métodos de
ataque, secuestro ni instrucciones para cometer violencia real.

Las mecánicas deben ser neutrales: cualquier facción puede aparecer como
actor de una trama ficticia, sin atribuir violencia o conspiraciones a
una ideología real por defecto.

------------------------------------------------------------------------

# 14. ORGANIZACIONES Y FACCIONES

No todos los actores serán partidos.

Tipos: - Movimientos sociales. - Sindicatos. - Organizaciones
empresariales. - Organizaciones estudiantiles. - Organizaciones
comunitarias. - Fuerzas armadas como institución. - Organizaciones
religiosas como actores sociales, tratadas con neutralidad. - Grupos
insurgentes ficticios. - Organizaciones clandestinas ficticias. -
Organismos internacionales.

Cada actor tendrá: - Dirigentes. - Recursos. - Objetivos. -
Relaciones. - Influencia. - Ubicación. - Cohesión. - Historial.

Podrán surgir nuevas facciones durante una partida.

------------------------------------------------------------------------

# 15. CONFLICTOS INTERNOS Y GUERRA CIVIL

Los conflictos pueden evolucionar según las decisiones y circunstancias.

Mecánicas: - Protestas masivas. - Huelgas. - Crisis de legitimidad. -
División institucional. - Rebeliones ficticias. - Insurgencias
ficticias. - Gobiernos paralelos. - Fragmentación territorial. -
Negociaciones de paz. - Acuerdos de reconciliación. - Reconstrucción
nacional.

El conflicto afecta: - Población. - Infraestructura. - Economía. -
Instituciones. - Territorio. - Relaciones internacionales.

No es un evento obligatorio. Se origina a partir de las variables y
decisiones de la partida.

------------------------------------------------------------------------

# 16. GEOPOLÍTICA Y CONQUISTA DE OTROS PAÍSES

El proyecto debe diseñarse desde el inicio para poder expandirse a un
mapa mundial, aunque la primera versión jugable se centre en El
Salvador.

## 16.1 Países

Cada país tendrá: - Gobierno. - Régimen. - Población. - Economía. -
Fuerzas armadas representadas mediante estadísticas agregadas. -
Relaciones diplomáticas. - Recursos. - Estabilidad. - Territorio. -
Alianzas. - Historial.

Los datos internacionales deben corresponder al año del escenario.

## 16.2 Diplomacia

-   Establecer relaciones.
-   Crear alianzas.
-   Firmar tratados.
-   Negociar comercio.
-   Establecer cooperación.
-   Formar bloques regionales.
-   Imponer o enfrentar sanciones.
-   Romper relaciones.
-   Participar en organizaciones internacionales.
-   Negociar acuerdos territoriales.

## 16.3 Expansión territorial internacional

En escenarios ficticios o alternativos: - Anexiones por acuerdos. -
Protectorados. - Gobiernos aliados. - Federaciones. - Confederaciones. -
Zonas de influencia. - Ocupación de territorios en conflictos
simulados. - Administración de territorios. - Movimientos
independentistas. - Tratados de paz.

La expansión debe tener consecuencias administrativas, económicas,
sociales y diplomáticas.

## 16.4 Guerra

Sistema estratégico por turnos, no un shooter.

Variables: - Fuerzas agregadas. - Presupuesto militar. - Equipamiento
como estadísticas abstractas. - Preparación. - Logística agregada. -
Capacidad defensiva. - Estabilidad. - Relaciones internacionales. -
Tratados de paz. - Armisticios. - Ocupación. - Reconstrucción.

Los enfrentamientos se resuelven mediante reglas agregadas y eventos. No
incluir instrucciones tácticas para causar daño real.

------------------------------------------------------------------------

# 17. ECONOMÍA NACIONAL

Indicadores: - PIB. - Crecimiento. - Inflación. - Desempleo. - Ingresos
públicos. - Gastos. - Déficit. - Deuda. - Inversión. - Consumo. -
Comercio. - Productividad.

## 17.1 Presupuesto

Áreas: - Educación. - Salud. - Seguridad. - Defensa. -
Infraestructura. - Administración pública. - Desarrollo económico. -
Protección social. - Servicio de deuda. - Otras obligaciones.

Los presupuestos deben cuadrar contablemente. Registrar ingresos,
gastos, financiamiento y saldo.

## 17.2 Impuestos

Los parámetros tributarios afectan: - Recaudación. - Consumo. -
Actividad empresarial. - Inversión. - Distribución de ingresos. -
Popularidad.

## 17.3 Deuda

Registrar: - Saldo. - Intereses. - Vencimientos. - Servicio anual. -
Riesgo financiero.

No crear ni destruir dinero sin una explicación contable.

------------------------------------------------------------------------

# 18. POBLACIÓN Y SOCIEDAD

Indicadores: - Población total. - Distribución por edades. -
Natalidad. - Mortalidad. - Migración. - Empleo. - Pobreza. -
Educación. - Salud. - Vivienda. - Calidad de vida.

## 18.1 Migración

-   Emigración.
-   Inmigración.
-   Retorno.
-   Remesas.
-   Población salvadoreña en el exterior.

Las decisiones económicas y sociales pueden modificar estos indicadores.

------------------------------------------------------------------------

# 19. SEGURIDAD Y JUSTICIA

Indicadores: - Seguridad ciudadana. - Criminalidad. - Capacidad
policial. - Prevención. - Sistema penitenciario. - Administración de
justicia. - Percepción de seguridad. - Derechos y garantías.

Distinguir estadísticas de criminalidad, percepción ciudadana y
capacidad institucional.

Las políticas pueden producir consecuencias sociales, económicas,
institucionales y jurídicas.

------------------------------------------------------------------------

# 20. RELACIONES EXTERIORES

Funciones: - Negociar acuerdos. - Establecer relaciones diplomáticas. -
Participar en reuniones internacionales. - Gestionar comercio
exterior. - Negociar cooperación. - Administrar relaciones con países. -
Gestionar conflictos diplomáticos.

Indicadores: - Confianza. - Cooperación. - Comercio. - Tensiones. -
Influencia internacional.

------------------------------------------------------------------------

# 21. ACONTECIMIENTOS Y CADENAS DE EVENTOS

Categorías:

**Políticos** - Renuncia de ministros. - Ruptura de coaliciones. -
Escándalos ficticios. - Crisis legislativas. - Crisis
constitucionales. - Cambios de partido. - Divisiones internas.

**Económicos** - Recesiones. - Inflación. - Endeudamiento. - Quiebras. -
Inversión extranjera. - Descubrimiento de recursos.

**Sociales** - Protestas. - Huelgas. - Migraciones. - Descontento. -
Desastres naturales. - Crisis sanitarias.

**Internacionales** - Guerras. - Cambios de gobierno. - Sanciones. -
Tratados. - Rupturas diplomáticas. - Crisis fronterizas.

Cada evento tendrá: - Fecha. - Descripción. - Contexto. - Opciones de
respuesta. - Costos. - Consecuencias. - Efectos posteriores.

Los eventos pueden formar cadenas de varios turnos. Distinguir siempre
eventos históricos y ficticios.

------------------------------------------------------------------------

# 22. TIEMPO Y TURNOS

La modalidad inicial será mensual, con posibilidad de configurar otros
ritmos.

Cada turno actualizará: 1. Economía. 2. Población. 3. Opinión pública.
4. Influencia territorial. 5. Recursos. 6. Actividad de partidos. 7.
Relaciones políticas. 8. Acontecimientos. 9. Presupuesto. 10. Calendario
electoral. 11. Relaciones internacionales. 12. Instituciones.

El jugador revisa los resultados antes de avanzar al siguiente turno.

------------------------------------------------------------------------

# 23. INTERFAZ

La interfaz se inspira en la estructura compacta y funcional del juego
argentino.

## 23.1 Navegación propuesta

**SITUACIÓN** - Resumen. - Mapa nacional. - Mapa mundial. -
Estadísticas.

**POLÍTICA** - Partidos. - Candidaturas. - Coaliciones. - Afiliados. -
Acciones. - Apoyos. - Conquista territorial.

**GOBIERNO** - Presidencia. - Ministerios. - Asamblea. -
Instituciones. - Régimen político.

**INTELIGENCIA** - Agencia. - Espionaje. - Contrainteligencia. -
Conspiraciones. - Operaciones especiales.

**SEGURIDAD Y DEFENSA** - Fuerzas armadas. - Seguridad nacional. -
Conflictos internos. - Guerra.

**ECONOMÍA** - Presupuesto. - Impuestos. - Deuda. - Comercio. -
Industria.

**SOCIEDAD** - Población. - Educación. - Salud. - Empleo. - Migración.

**GEOPOLÍTICA** - Países. - Diplomacia. - Alianzas. - Territorios. -
Expansión. - Organismos internacionales.

**ACONTECIMIENTOS** - Noticias. - Crisis. - Eventos. - Registro
histórico.

**SISTEMA** - Guardar. - Cargar. - Sandbox. - Configuración.

Las secciones se mostrarán según la etapa de la partida y los sistemas
desbloqueados.

## 23.2 Dirección visual

-   Interfaz oscura por defecto.
-   Fondo gris casi negro.
-   Paneles discretos.
-   Bordes finos.
-   Tipografía legible.
-   Tarjetas de acciones.
-   Indicadores compactos.
-   Gráficas.
-   Mapas interactivos.
-   Ventanas de información.
-   Notificaciones.
-   Historial de acontecimientos.

Priorizar densidad informativa sin sacrificar legibilidad. Evitar
estética infantil y decoraciones innecesarias.

------------------------------------------------------------------------

# 24. INTELIGENCIA ARTIFICIAL

La IA podrá ayudar a generar: - Partidos ficticios. - Dirigentes
ficticios. - Candidatos ficticios. - Acontecimientos. - Reacciones de
actores. - Descripciones. - Noticias internas. - Eventos de campaña.

La IA no debe decidir directamente: - Resultados electorales. - Conteos
legislativos. - Presupuestos. - Fórmulas económicas. - Reglas
institucionales. - Cálculos fundamentales del motor.

Estos deben ser reglas de código reproducibles. La IA puede redactar una
explicación narrativa del resultado ya calculado.

------------------------------------------------------------------------

# 25. GUARDADO Y PERSISTENCIA

Utilizar IndexedDB para almacenamiento local en la primera versión.

Guardar: - Fecha y turno. - Partidos. - Candidatos. - Recursos. -
Territorios. - Elecciones. - Instituciones. - Economía. - Población. -
Eventos. - Historial. - Configuración.

Funciones: - Guardado manual. - Guardado automático. - Múltiples
partidas. - Carga. - Copias de seguridad. - Exportación e importación.

Cada partida tendrá una versión de esquema para facilitar futuras
actualizaciones. Implementar migraciones cuando cambie la estructura de
datos.

------------------------------------------------------------------------

# 26. ARQUITECTURA TÉCNICA PROPUESTA

Tecnologías sugeridas: - React. - TypeScript. - Vite. - CSS. - Zustand o
alternativa equivalente. - IndexedDB. - Recharts. - Leaflet u otra
biblioteca de mapas.

Estas son propuestas iniciales, no una obligación de reemplazar una
arquitectura existente sin evaluación.

## 26.1 Estructura de carpetas sugerida

``` text
REPUBLICA/
├── public/
│   ├── images/
│   ├── icons/
│   └── maps/
├── src/
│   ├── app/
│   ├── components/
│   ├── pages/
│   ├── systems/
│   │   ├── political/
│   │   ├── parties/
│   │   ├── actions/
│   │   ├── territorial/
│   │   ├── support/
│   │   ├── candidates/
│   │   ├── coalitions/
│   │   ├── elections/
│   │   ├── legislature/
│   │   ├── government/
│   │   ├── institutions/
│   │   ├── intelligence/
│   │   ├── conflicts/
│   │   ├── diplomacy/
│   │   ├── warfare/
│   │   ├── economy/
│   │   ├── population/
│   │   ├── security/
│   │   └── events/
│   ├── engine/
│   │   ├── simulation/
│   │   ├── calendar/
│   │   ├── calculations/
│   │   └── rules/
│   ├── data/
│   │   ├── country/
│   │   ├── departments/
│   │   ├── municipalities/
│   │   ├── parties/
│   │   └── scenarios/
│   ├── store/
│   ├── persistence/
│   ├── hooks/
│   ├── styles/
│   └── utils/
├── docs/
│   ├── GDD.md
│   ├── ARCHITECTURE.md
│   ├── SYSTEMS.md
│   ├── DATA_SOURCES.md
│   └── CHANGELOG.md
└── package.json
```

## 26.2 Separación de responsabilidades

-   La interfaz presenta información y recibe acciones.
-   Los sistemas contienen reglas específicas de cada dominio.
-   El motor coordina turnos y actualizaciones.
-   Los datos contienen escenarios y contenido.
-   La persistencia guarda y recupera partidas.
-   Las pruebas verifican reglas y cálculos.

Ejemplo: una acción territorial solicita al sistema territorial
modificar influencia. El motor valida costos y requisitos, actualiza el
estado y registra el evento. La interfaz muestra el resultado.

------------------------------------------------------------------------

# 27. REGLAS DE BALANCE Y VALIDACIÓN

Variables con límites documentados, por ejemplo: - Popularidad: 0 a
100. - Influencia territorial: 0 a 100. - Organización: 0 a 100. -
Recursos: cantidades monetarias. - Afiliados: números enteros. - Apoyo
electoral: proporciones coherentes.

Evitar: - Dinero infinito involuntario. - Resultados electorales
imposibles. - Influencia fuera de límites. - Duplicación de afiliados. -
Eventos repetidos incorrectamente. - Presupuestos que no cuadran. -
Estados incompatibles. - Votaciones que no suman el total de
diputados. - Escaños que excedan la composición de la Asamblea. - Leyes
aprobadas sin cumplir la mayoría aplicable. - Turnos que actualicen dos
veces un mismo sistema.

------------------------------------------------------------------------

# 28. DATOS Y FUENTES DE EL SALVADOR

Fuentes institucionales que deben consultarse y registrarse: - Tribunal
Supremo Electoral: elecciones, partidos, calendarios y resultados. -
Asamblea Legislativa: Constitución, legislación, procedimientos y
composición. - Banco Central de Reserva: economía e indicadores. -
Instituciones estadísticas nacionales: demografía. - Instituciones
públicas: información sectorial. - Fuentes internacionales reconocidas:
estadísticas comparativas.

Cada dato debe incluir: - Fuente. - Fecha de publicación o referencia. -
Cobertura. - Unidad. - Método de obtención. - Versión del escenario.

No usar datos actuales para representar períodos históricos. No inventar
datos si no están disponibles: marcar los campos como desconocidos o
estimados y explicar el método.

------------------------------------------------------------------------

# 29. FASES DE DESARROLLO

El alcance completo es grande. Implementar por etapas.

## Fase 0 --- Preparación

-   Repositorio.
-   Configuración técnica.
-   Arquitectura.
-   Documentación.
-   Datos territoriales.
-   Reglas de desarrollo.

## Fase 1 --- Base funcional

-   Menú principal.
-   Crear partida.
-   Seleccionar escenario.
-   Interfaz general.
-   Navegación.
-   Guardado y carga.
-   Motor de turnos.

## Fase 2 --- Política

-   Crear partidos.
-   Dirigentes.
-   Afiliados.
-   Recursos.
-   Ideologías.
-   Acciones.
-   Apoyos.

## Fase 3 --- Territorio

-   Mapa nacional.
-   Departamentos.
-   Municipios.
-   Influencia.
-   Conquista política.
-   Organización territorial.
-   Competencia entre partidos.

## Fase 4 --- Elecciones y Asamblea

-   Candidatos.
-   Coaliciones.
-   Campañas.
-   Intención de voto.
-   Elecciones presidenciales.
-   Elecciones legislativas.
-   Elecciones municipales.
-   Asignación de escaños.
-   Composición de la Asamblea.
-   Proyectos de ley.
-   Comisiones.
-   Debates y votaciones.
-   Presidencia legislativa y Junta Directiva.

## Fase 5 --- Gobierno e instituciones

-   Presidencia.
-   Ministerios.
-   Asamblea.
-   Leyes.
-   Presupuesto.
-   Instituciones.
-   Justicia.
-   Relaciones Ejecutivo-Legislativo.

## Fase 6 --- País

-   Economía.
-   Población.
-   Migración.
-   Seguridad.
-   Educación.
-   Salud.
-   Infraestructura.
-   Relaciones exteriores.

## Fase 7 --- Rutas de poder y conflictos

-   Cambios de régimen.
-   Protestas.
-   Revoluciones ficticias.
-   Crisis institucionales.
-   Dictaduras.
-   Inteligencia.
-   Conspiraciones abstractas.
-   Conflictos internos.

## Fase 8 --- Geopolítica

-   Mapa mundial.
-   Países.
-   Diplomacia.
-   Alianzas.
-   Comercio internacional.
-   Expansión territorial.
-   Guerra por turnos.
-   Ocupación y reconstrucción.

## Fase 9 --- Profundización

-   Eventos dinámicos.
-   IA narrativa.
-   Escenarios históricos.
-   Sandbox avanzado.
-   Más acciones.
-   Balance.
-   Optimización.

## Fase 10 --- Versión completa

-   Pruebas integrales.
-   Corrección de errores.
-   Compatibilidad de partidas.
-   Documentación.
-   Experiencia de usuario.

------------------------------------------------------------------------

# 30. CRITERIOS DE COMPLETITUD

La primera versión completa deberá permitir: - Crear y guardar una
partida. - Crear partidos. - Reclutar afiliados. - Obtener recursos. -
Ejecutar acciones. - Expandir influencia. - Competir territorialmente. -
Crear candidaturas. - Formar coaliciones. - Participar en elecciones. -
Obtener representación legislativa. - Controlar o negociar la
Asamblea. - Presentar proyectos de ley. - Votar y aprobar o rechazar
leyes según reglas. - Llegar al gobierno. - Administrar ministerios. -
Gestionar el presupuesto. - Administrar economía y población. -
Gestionar acontecimientos. - Avanzar varios años. - Participar en
cambios de régimen ficticios. - Guardar y recuperar la partida.

La versión geopolítica ampliada deberá añadir: - Mapa mundial. -
Gobiernos extranjeros. - Diplomacia. - Alianzas. - Expansión territorial
internacional. - Conflictos y guerras por turnos. - Administración de
territorios. - Reconstrucción posterior a conflictos.

Un sistema no está terminado porque su interfaz se vea bien. Debe
ejecutar su lógica, modificar el estado de la partida, interactuar con
otros sistemas y superar pruebas.

------------------------------------------------------------------------

# 31. REGLAS FINALES PARA EL DESARROLLO

1.  No reescribir archivos completos innecesariamente.
2.  No eliminar funciones existentes sin autorización.
3.  No crear sistemas duplicados.
4.  Revisar dependencias antes de modificar un módulo.
5.  Mantener tipos correctos.
6.  Probar funciones después de implementarlas.
7.  No introducir datos ficticios en escenarios históricos.
8.  Registrar fuentes y fechas.
9.  No usar IA generativa para cálculos reproducibles.
10. Mantener consistencia visual.
11. Actualizar documentación.
12. Hacer copias de seguridad antes de cambios estructurales.
13. No considerar terminado un sistema por su apariencia.
14. Verificar que las acciones cambien el estado.
15. Priorizar estabilidad y coherencia.
16. Mantener compatibilidad de partidas o implementar migraciones.
17. No implementar sistemas enormes en una sola entrega.
18. Mantener una lista de tareas pendientes y decisiones abiertas.

------------------------------------------------------------------------

# 32. PROMPT MAESTRO PARA INICIAR EL DESARROLLO

Copia este prompt junto con el README cuando trabajes con una IA de
programación:

> Quiero que trabajes conmigo en el desarrollo de REPÚBLICA, un
> simulador político, institucional y geopolítico de El Salvador.
>
> Lee íntegramente el README adjunto. Es la especificación principal del
> proyecto y contiene su visión, mecánicas, sistemas, arquitectura
> propuesta, fases y reglas de desarrollo.
>
> No quiero una demostración superficial ni una interfaz con botones que
> no hacen nada. Quiero construir un juego real, modular, ampliable y
> con sistemas conectados.
>
> El proyecto toma como referencia funcional «¿Quién quiere gobernar?»
> de Argentina, pero debe tener implementación, código, textos y
> recursos propios, adaptados a El Salvador.
>
> Entre sus sistemas centrales están la creación y gestión de partidos,
> afiliados, acciones políticas, conquista de influencia territorial,
> elecciones, coaliciones, una Asamblea Legislativa unicameral
> funcional, votaciones de leyes, gobierno, economía, población, cambios
> de régimen, crisis institucionales, inteligencia abstracta, diplomacia
> y expansión geopolítica.
>
> La Asamblea Legislativa debe ser un sistema real del juego:
> composición por partidos, diputados, comisiones, Junta Directiva,
> proyectos de ley, debates, votaciones, mayorías y relación con el
> Ejecutivo. El presidente no debe poder aprobar leyes unilateralmente.
>
> El jugador podrá experimentar rutas democráticas y no democráticas,
> escenarios de crisis, revoluciones ficticias, dictaduras, conflictos
> internos y expansión internacional. Las mecánicas de violencia
> política deben ser abstractas y narrativas, sin instrucciones
> operativas para cometer violencia real.
>
> Quiero que avances por fases. Primero inspecciona el proyecto y dime
> su estado real. No escribas código todavía hasta identificar qué
> existe, qué falta y qué arquitectura conviene mantener.
>
> Después propón el siguiente incremento pequeño, con archivos afectados
> y pruebas de aceptación. Implementa únicamente lo acordado, verifica
> que funcione y documenta los cambios.
>
> No inventes datos históricos. Diferencia siempre escenarios reales y
> ficticios. Los cálculos electorales, legislativos y económicos deben
> ser reproducibles mediante código.
>
> Prioriza estabilidad, profundidad, coherencia y modularidad sobre
> velocidad.

------------------------------------------------------------------------

# 33. ESTADO ACTUAL DEL PROYECTO

**Diseño:** visión general definida.\
**Mecánicas:** especificación inicial consolidada.\
**Tecnología:** propuesta, pendiente de confirmar con el entorno real.\
**Código:** no se presume que exista implementación.\
**Datos históricos:** pendientes de recopilación y validación.\
**Interfaz:** dirección visual definida; pendiente de construcción.\
**Siguiente paso:** inspeccionar el entorno de desarrollo, confirmar la
arquitectura y comenzar la Fase 0.

**Principio rector:** REPÚBLICA debe ser un simulador completo, modular,
ampliable y funcional. No una simple demostración visual.
