// Artículos del blog. Contenido fijo en código (sin CMS): para publicar uno
// nuevo, añade otra entrada a este array con el mismo formato.
//
// `contenido` es una lista de bloques que se renderizan en orden:
//   { tipo: 'parrafo',   texto: '...' }
//   { tipo: 'subtitulo', texto: '...' }
//   { tipo: 'imagen',    src: '/images/...', alt: '...' }

export const BLOG_POSTS = [
  {
    slug: 'abhyasa-y-vairagya',
    titulo: 'Abhyasa y Vairagya: la práctica constante y el desapego al resultado',
    resumen: 'Dos palabras sánscritas de los Yoga Sutras que se sostienen mutuamente: la práctica constante y el desapego a los resultados. Por qué un cuerpo diferente cada día no es un problema que resolver, sino el punto de partida real.',
    imagenPortada: '/images/yoga27.jpg',
    imagenPortadaAlt: 'Postura de perro boca abajo, metáfora de la constancia y el desapego al resultado',
    fecha: '2026-08-25',
    tiempoLectura: '7 min de lectura',
    contenido: [
      {
        tipo: 'parrafo',
        texto: 'Cada cuerpo que llega a la esterilla es distinto y no solo de una persona a otra, sino del mismo cuerpo de un día para otro. Hoy quizá llega con energía de sobra; mañana, cansado, dolorido, con la cabeza en otro sitio. Eso no es un fallo en tu práctica: es lo normal. Hay dos palabras sánscritas, tan antiguas como los propios Yoga Sutras de Patanjali, que explican por qué esa variación no solo no estorba el camino del yoga, sino que es parte de él: Abhyasa y Vairagya.',
      },
      { tipo: 'subtitulo', texto: 'Abhyasa — el gesto de volver, una y otra vez' },
      {
        tipo: 'parrafo',
        texto: 'Patanjali lo dice en el sutra 1.13: "tatra sthitau yatno\'bhyasah" — el esfuerzo sostenido por permanecer estable es Abhyasa. No es intensidad puntual ni un arranque de motivación de enero: es repetición. El sutra siguiente, el 1.14, lo deja aún más claro: la práctica se afianza de verdad cuando se sostiene mucho tiempo, sin interrupción, y con una actitud sincera hacia ella. Ni un fin de semana de retiro intensivo ni una racha de tres semanas perfectas — es volver, sesión tras sesión, durante meses, durante años, aunque algunos días sean diez minutos y otros una hora entera.',
      },
      {
        tipo: 'parrafo',
        texto: 'Es exactamente lo que trabajamos en "El regreso constante", una de las clases del Pack Raíz: notar que la mente se fue, y volver. Sin culpa. Las veces que haga falta.',
      },
      { tipo: 'subtitulo', texto: 'Vairagya — soltar el apego a lo que la postura debería ser' },
      {
        tipo: 'parrafo',
        texto: 'Si Abhyasa es el esfuerzo de seguir, Vairagya es soltar la necesidad de que ese esfuerzo produzca un resultado concreto. El sutra 1.15 lo define como el dominio de no anhelar aquello que ves o de lo que oyes hablar — en la esterilla, eso se traduce en no perseguir la foto de la postura perfecta, no medir la clase de hoy contra la de la semana pasada, no necesitar que el cuerpo obedezca. Vairagya no es indiferencia ni pasividad: puedes seguir intentando la postura con todo tu esfuerzo y, al mismo tiempo, no necesitar que salga de una manera concreta para que la práctica haya valido la pena.',
      },
      { tipo: 'subtitulo', texto: 'Por qué van siempre de la mano' },
      {
        tipo: 'parrafo',
        texto: 'Patanjali las presenta juntas, en el mismo sutra, por una razón: por separado, cada una se tuerce. Abhyasa sin Vairagya se convierte en exigencia — practicar para conseguir, para lucir, para llegar a algún sitio, y castigarte cuando no llegas. Vairagya sin Abhyasa se convierte en resignación — dejar de intentarlo con la excusa de "total, da igual". Juntas son otra cosa: sigues apareciendo en la esterilla con disciplina real, y sueltas la necesidad de que ese esfuerzo se traduzca en un logro visible. Practicas por practicar. Eso, paradójicamente, es lo que sostiene una práctica durante años, cuando la motivación por sí sola ya se ha agotado mil veces.',
      },
      { tipo: 'imagen', src: '/images/yoga26.jpg', alt: 'Manos y pies apoyados en la esterilla, detalle del esfuerzo sostenido' },
      { tipo: 'subtitulo', texto: 'Desmitificar la perfección de la asana' },
      {
        tipo: 'parrafo',
        texto: 'En el primer artículo de este blog hablé de cómo Patanjali define Asana con solo dos palabras: sthira sukham asanam, estable y cómoda. No dice nada de lo abierta que debe quedar la cadera ni de si el talón toca el suelo. Aun así, es fácil caer en la idea de que existe una "versión correcta" de cada postura y que el objetivo es conquistarla. Esa búsqueda de perfección forzar una flexibilidad que hoy no tienes, sostener una postura más allá de lo que tu cuerpo te pide con tal de completarla es exactamente lo contrario de Vairagya. Adaptar la postura a tu cuerpo, y no tu cuerpo a la postura, no es conformarse: es la práctica misma.',
      },
      { tipo: 'imagen', src: '/images/yoga18.jpg', alt: 'Práctica sentada en calma junto a la ventana, sin buscar la perfección' },
      { tipo: 'subtitulo', texto: 'Un cuerpo diferente cada día, y eso es lo natural' },
      {
        tipo: 'parrafo',
        texto: 'Hay días en los que subes a la esterilla sin energía. Días con una rodilla que avisa, una noche mal dormida, una cabeza que no para. Nada de eso es un obstáculo para la práctica — es la práctica, tal cual se presenta hoy. Abhyasa no pide un cuerpo constante: pide que vuelvas, sea cual sea el cuerpo que traigas. Y Vairagya es lo que te permite volver sin la exigencia de que hoy tenga que parecerse a tu mejor día. Adaptas la postura, bajas la intensidad, a veces simplemente respiras — y eso también cuenta, entero, como práctica.',
      },
      { tipo: 'subtitulo', texto: 'Lo que se transforma no es solo el cuerpo' },
      {
        tipo: 'parrafo',
        texto: 'Practicar así, una y otra vez, sin aferrarte al resultado, tiene un efecto que va mucho más allá de lo físico. Cuando sueltas la necesidad de que cada sesión sea "buena" según algún criterio externo, empiezas a tratarte con la misma paciencia con la que tratarías a alguien que quieres — lo que en psicología se conoce como autocompasión. Con el tiempo, ese gesto repetido de volver sin juzgarte se traslada fuera de la esterilla: a cómo respondes cuando un plan no sale, cuando cometes un error, cuando el día no rinde lo que esperabas. La constancia sin apego no solo cambia la flexibilidad de tus caderas — cambia, poco a poco, la relación que tienes contigo misma.',
      },
      {
        tipo: 'parrafo',
        texto: 'En eso están, en el fondo, todas las clases del Pack Raíz: no en conquistar posturas, sino en sostener la práctica y soltar el resultado, una vez tras otra. Si algún día llegas a la esterilla sin energía, sin flexibilidad, sin ganas, sube igual. Eso también es Abhyasa. Y no le pidas que sea perfecta. Eso es Vairagya.',
      },
    ],
  },
  {
    slug: 'los-ocho-pasos-de-patanjali',
    titulo: 'Los ocho pasos de Patanjali',
    resumen: 'La postura es solo uno de los ocho escalones del yoga. Un recorrido por el Ashtanga de los Yoga Sutras, de la ética hacia los demás a la unión final.',
    imagenPortada: '/images/montaña.jpeg',
    imagenPortadaAlt: 'Camino ascendente entre montañas, metáfora del sendero del yoga',
    fecha: '2026-08-07',
    tiempoLectura: '7 min de lectura',
    contenido: [
      {
        tipo: 'parrafo',
        texto: 'Cuando alguien empieza yoga, casi siempre piensa en el cuerpo: en estirar, en fortalecer, en esa postura que todavía no le sale. Y está bien empezar ahí yo también empecé ahí. Pero hace más de dos mil años, un sabio llamado Patanjali recopiló los Yoga Sutras, un texto breve y denso que describe el yoga no como una serie de posturas, sino como un camino de ocho pasos: el Ashtanga (de "ashta", ocho, y "anga", miembro o escalón). La postura, Asana, es solo el tercero.',
      },
      {
        tipo: 'parrafo',
        texto: 'No hace falta recorrerlos en fila india ni dominar uno para pasar al siguiente en la práctica real se entrelazan. Pero conocerlos ayuda a entender por qué una clase de yoga bien dada no es solo gimnasia con música relajante. Aquí van, uno a uno.',
      },
      { tipo: 'subtitulo', texto: '1. Yama — cómo te relacionas con lo que te rodea' },
      {
        tipo: 'parrafo',
        texto: 'Los Yamas son cinco principios éticos, orientados hacia fuera: Ahimsa (no causar daño), Satya (honestidad), Asteya (no tomar lo que no es tuyo), Brahmacharya (uso consciente de la energía) y Aparigraha (no acumular de más). No son mandamientos abstractos , son preguntas que te puedes hacer en la esterilla: ¿te estás forzando en una postura hasta hacerte daño? Eso también es una falta de Ahimsa, hacia ti misma.',
      },
      { tipo: 'subtitulo', texto: '2. Niyama — cómo te relacionas contigo misma' },
      {
        tipo: 'parrafo',
        texto: 'Si los Yamas miran hacia fuera, los Niyamas miran hacia dentro: Saucha (limpieza, orden), Santosha (contentamiento con lo que hay), Tapas (disciplina, el calor del esfuerzo sostenido), Svadhyaya (autoconocimiento) e Ishvara Pranidhana (entrega a algo más grande que el ego). Practicar con constancia, aunque sea diez minutos, es Tapas. Aceptar el cuerpo que tienes hoy, no el de hace un año, es Santosha.',
      },
      { tipo: 'subtitulo', texto: '3. Asana — el cuerpo como punto de partida, no de llegada' },
      {
        tipo: 'parrafo',
        texto: 'Patanjali define Asana con solo dos palabras: "sthira sukham asanam" la postura debe ser estable y cómoda a la vez. No dice nada de flexibilidad ni de lo bonita que se vea en una foto. Por eso en mis clases insisto tanto en el ajuste: una postura mal alineada no es más yoga por ser más intensa, es simplemente una postura que no va a sostenerte. El cuerpo bien colocado es el que te permite quedarte, respirar, y seguir hacia dentro.',
      },
      { tipo: 'imagen', src: '/images/avanzadoa1.jpg', alt: 'Postura de yoga con alineación y ajuste preciso' },
      { tipo: 'subtitulo', texto: '4. Pranayama — el puente entre cuerpo y mente' },
      {
        tipo: 'parrafo',
        texto: 'Pranayama es la extensión (ayama) de la fuerza vital (prana) a través de la respiración. Es el primer paso que ya no se ve tanto desde fuera ,nadie sabe si estás haciendo Ujjayi o respirando de cualquier manera, pero tú sí lo notas. Es también el puente: mientras el cuerpo se educa con Asana, la respiración empieza a educar a la mente.',
      },
      { tipo: 'imagen', src: '/images/yogarespiracion.jpg', alt: 'Práctica de respiración consciente, pranayama' },
      { tipo: 'subtitulo', texto: '5. Pratyahara — retirar los sentidos hacia dentro' },
      {
        tipo: 'parrafo',
        texto: 'Pratyahara es soltar el enganche automático a lo que entra por los sentidos: el móvil, el ruido, la lista de tareas. No es dejar de sentir, es dejar de perseguir cada estímulo. Es ese momento, al final de una práctica, en que cierras los ojos y por fin no hace falta mirar nada más.',
      },
      { tipo: 'subtitulo', texto: '6. Dharana — la concentración' },
      {
        tipo: 'parrafo',
        texto: 'Con los sentidos ya no tirando hacia fuera, Dharana es posar la atención en un solo punto , la respiración, una vela, una palabra  y sostenerla ahí. Suena sencillo y es, para la mayoría, lo más difícil de los ocho pasos. La mente se va. Se nota. Se vuelve. Se va otra vez.',
      },
      { tipo: 'subtitulo', texto: '7. Dhyana — la meditación' },
      {
        tipo: 'parrafo',
        texto: 'Cuando esa concentración deja de necesitar esfuerzo y se sostiene sola, sin que tengas que traerla de vuelta constantemente, eso es Dhyana. No es un estado especial reservado a unos pocos: es lo que ocurre, a veces sin que te des cuenta, en algún tramo de una práctica larga y bien construida.',
      },
      { tipo: 'subtitulo', texto: '8. Samadhi — la unión' },
      {
        tipo: 'parrafo',
        texto: 'El último paso, Samadhi, es la disolución de la distancia entre quien observa y lo observado. Es difícil de describir con palabras porque, por definición, ahí ya no hay un "yo" narrando la experiencia. Patanjali lo señala como la meta, pero también deja claro que los ocho pasos son, en realidad, un solo camino continuo — no una escalera que se sube y se abandona.',
      },
      { tipo: 'imagen', src: '/images/yoga-36.jpg', alt: 'Práctica de yoga en calma, integrando cuerpo y mente' },
      {
        tipo: 'parrafo',
        texto: 'En mis clases trabajamos sobre todo los primeros cuatro pasos ,el cuerpo, la ética cotidiana, la respiración  porque son la puerta de entrada real para la mayoría de nosotras. No hace falta llegar a Samadhi para que el yoga funcione: basta con empezar por donde estás, con un ajuste preciso y una respiración que acompañe. Lo demás, si llega, llega solo.',
      },
    ],
  },
  {
    slug: 'el-ego-espiritual',
    titulo: 'El ego espiritual',
    resumen: 'La práctica también puede convertirse en otro escenario para el ego: comparar, coleccionar posturas, sentirte "más consciente" que los demás. Cómo reconocerlo y volver al cuerpo como maestro.',
    imagenPortada: '/images/yoga24.jpg',
    imagenPortadaAlt: 'Practicante de yoga en equilibrio, trabajando el desapego',
    fecha: '2026-08-07',
    tiempoLectura: '6 min de lectura',
    contenido: [
      {
        tipo: 'parrafo',
        texto: 'Hay una paradoja incómoda en cualquier camino de crecimiento personal: la misma práctica que debería aflojar el ego puede convertirse en su escondite favorito. Pasa con el yoga, con la meditación, con cualquier disciplina que hable de "conciencia". En vez de soltar, el ego se disfraza de espiritual y sigue haciendo lo de siempre solo que ahora con incienso.',
      },
      { tipo: 'subtitulo', texto: 'Cuando la práctica se convierte en otro logro más' },
      {
        tipo: 'parrafo',
        texto: 'Lo veo, y lo he vivido: la tentación de medir la práctica como se mide cualquier otra cosa en esta cultura — cuántas posturas dominas, cuántas certificaciones tienes, cuántos años llevas "en el camino". Coleccionar logros espirituales es tan posible como coleccionar cualquier otra cosa. El problema no es progresar, es cuando ese progreso empieza a ser sobre todo una forma de sentirte por encima de quien todavía no llegó ahí.',
      },
      { tipo: 'subtitulo', texto: 'La espiritualidad como escudo' },
      {
        tipo: 'parrafo',
        texto: 'Otra forma, más silenciosa, es usar la espiritualidad para no sentir. "Suelto lo que no puedo controlar", decimos, y a veces es verdadera sabiduría — y otras veces es una manera elegante de no enfadarnos, no llorar, no reconocer que algo nos ha dolido. Cuando la calma se convierte en una máscara para no estar presente con lo difícil, deja de ser calma. Se llama spiritual bypassing, y es más común de lo que parece, sobre todo en quienes llevamos tiempo practicando.',
      },
      { tipo: 'imagen', src: '/images/yoga22.jpg', alt: 'Práctica de yoga sobre el regreso constante de la atención' },
      { tipo: 'subtitulo', texto: 'Señales para reconocerlo' },
      {
        tipo: 'parrafo',
        texto: 'Algunas pistas que a mí me han servido para pillarme a mí misma: juzgar en silencio la práctica de otra persona en clase. Necesitar que alguien note lo mucho que has cambiado. Sentir que ya "sabes" y por eso escuchar menos. Que te cueste especialmente volver a ser principiante en algo — una postura nueva, una conversación difícil — porque tu identidad ya se apoya en no serlo.',
      },
      { tipo: 'subtitulo', texto: 'Volver al cuerpo como maestro, no como trofeo' },
      {
        tipo: 'parrafo',
        texto: 'La forma que he encontrado de trabajar con esto no es dramática: es volver, una y otra vez, al cuerpo tal y como está hoy. El cuerpo no miente ni compara — simplemente está donde está. Cuando la práctica se apoya de verdad en el cuerpo, y no en la idea de quién quieres ser, el ego tiene mucho menos donde agarrarse. Por eso insisto tanto en empezar desde cero cada vez, sin exigencias: no como humillación, sino como el gesto más honesto que existe.',
      },
      { tipo: 'imagen', src: '/images/yoga23.jpg', alt: 'Yoga Tierra Viva, práctica desde la calma' },
      {
        tipo: 'parrafo',
        texto: 'Esto conecta directamente con dos de las clases del Aula: "El regreso constante" practica exactamente ese gesto — notar que la mente se fue, y volver, sin culpa. Y "Desapego en movimiento" trabaja el equilibrio inestable como forma de soltar el apego al resultado. Si el cuerpo cae, no ha fallado: está diciendo la verdad del momento. El ego espiritual no se combate con más disciplina — se disuelve, poco a poco, cada vez que elegimos la verdad del cuerpo por encima de la imagen que queremos dar de nosotras mismas.',
      },
    ],
  },
]

export function getPostBySlug(slug) {
  return BLOG_POSTS.find(p => p.slug === slug) || null
}
