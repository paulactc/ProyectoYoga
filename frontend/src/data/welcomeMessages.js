// 20 mensajes de bienvenida, uno por cada login, en orden y sin repetir
// (al llegar al final se vuelve a empezar). Ver AuthContext/WelcomeModal.
export const WELCOME_MESSAGES = [
  'Hola {nombre}, tu cuerpo te está esperando en la esterilla. Hoy es un buen día para escucharlo.',
  '{nombre}, cada respiración profunda es un regalo que te haces a ti misma.',
  'Bienvenida de nuevo, {nombre}. Tu práctica no busca perfección, busca presencia.',
  '{nombre}, tu cuerpo recuerda cómo moverse con libertad. Hoy puedes recordárselo tú.',
  'Un paso pequeño hoy, {nombre}, es una raíz más fuerte mañana.',
  '{nombre}, mereces un espacio solo para ti, aunque sean diez minutos.',
  '¿Qué tal si hoy le regalas movilidad a tus caderas, {nombre}? Ellas te lo agradecerán.',
  '{nombre}, cuidar de tu cuerpo es cuidar de todo lo que haces con él.',
  'Cada vez que practicas, {nombre}, le enseñas a tu cuerpo que puede confiar en ti.',
  '{nombre}, la constancia no es perfección, es volver. Y hoy has vuelto.',
  'Tu columna agradece cada centímetro de espacio que le das al estirarte, {nombre}.',
  'Respirar profundo es la forma más rápida de volver a ti misma, {nombre}.',
  'Hoy puede ser el día en que tu cuerpo se sienta un poco más libre, {nombre}.',
  '{nombre}, no se trata de tocar los pies, se trata de escuchar lo que el camino te dice.',
  'Tu salud integral se construye en momentos como este, no en grandes gestos, {nombre}.',
  '{nombre}, tu cuerpo es tierra fértil. Hoy toca regarla un poco.',
  'Cada práctica es una raíz que hunde y una rama que se abre hacia el cielo, {nombre}.',
  'Date permiso para moverte despacio hoy, {nombre}. No hay prisa en este camino.',
  'Tu bienestar no es un lujo, {nombre}, es una necesidad. Hoy toca atenderla.',
  '{nombre}, cada vez que eliges practicar, eliges quererte un poco más.',
]

export function formatWelcomeMessage(index, nombre) {
  const template = WELCOME_MESSAGES[index] || WELCOME_MESSAGES[0]
  const primerNombre = (nombre || '').trim().split(' ')[0] || nombre || ''
  return template.replaceAll('{nombre}', primerNombre)
}
