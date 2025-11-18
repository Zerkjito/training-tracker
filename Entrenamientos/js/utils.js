import { Durations } from './classes/index.js';

export function updateLocalStorage(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function removeUserTrainings(user) {
  if (user.entrenamientos) user.entrenamientos = [];
}

export function isEmptyTrainings(user) {
  return user.entrenamientos.length === 0;
}

//  mostrar mensaje dinámico en cualquier parte gracias a los 3 parámetros que recibe
//  el -> elemento en cuestión a targetear
//  msg -> mensaje que se quiere mostrar
//  type -> clase CSS dinámica para aplicar ese estilo
//  duration? -> parámetro opcional para modificar el retardo del mensaje, por defecto 1500ms
export function showInfoMessage(el, msg, type = 'confirmation', duration = 1500) {
  if (el.timeoutId) clearTimeout(el.timeoutId); // si el timeoutId está activo, se resetea

  el.classList.remove('confirmation', 'warning', 'info'); // reset de las clases CSS para evitar colisiones/conflictos
  el.classList.add('show', type);

  let icon = ''; // icono de fonts-awesome dinámico

  if (type === 'warning') {
    icon = '<i class="fa-solid fa-triangle-exclamation"></i>';
  } else if (type === 'confirmation') {
    icon = '<i class="fa-solid fa-circle-check"></i>';
  } else {
    icon = '<i class="fa-solid fa-circle-info"></i>';
  }

  el.innerHTML = `${icon}${msg}`;

  //  crea un timeoutId asociado a cada el para controlar si el usuario aprieta el botón repetidamente
  //  y se vuelve null cuando pasa ${duration} tiempo
  el.timeoutId = setTimeout(() => {
    el.classList.remove('show'); // ocultar
    el.timeoutId = null;
  }, duration);
}

//  mostrar y ocultar elemento dinámicamente
export function toggleElement(el, show = true) {
  el.classList.toggle('hidden', !show);
}

export function isValidDuracion(duracion) {
  const regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  return regex.test(duracion);
}

export function calcularDuracion(duracion) {
  const [hh, mm, ss] = duracion.split(':').map(Number);
  const total = hh * 3600 + mm * 60 + ss;
  return { hh, mm, ss, total };
}

export function calcularVelocidad(distanciaRecorrida, duracion) {
  return distanciaRecorrida / (duracion.total / 3600);
}

export function calcularNivel(distanciaRecorrida, duracion, velocidad) {
  const t = duracion.total;

  if (distanciaRecorrida < 3 && t > Durations.MINUTE * 25 && velocidad < 7) {
    return 'Malo';
  } else if (
    distanciaRecorrida >= 3 &&
    distanciaRecorrida <= 8 &&
    t >= Durations.MINUTE * 20 &&
    t <= Durations.MINUTE * 60 &&
    velocidad >= 7 &&
    velocidad <= 12
  ) {
    return 'Bueno';
  } else {
    return 'Muy bueno';
  }
}

//  crear tarjeta de entrenamiento
//  forModal? -> por defecto es false, pero si quiero que la tarjeta sea para un modal le paso true
export function createTrainingCard(training, forModal = false) {
  const div = document.createElement('div');
  forModal ? '' : div.classList.add('training-card'); // evaluación para saber si agregar clase

  const distancia = document.createElement('p');
  distancia.textContent = `Distancia recorrida: ${training.distanciaRecorrida.toFixed(2)} km`;
  div.append(distancia);

  const duracion = document.createElement('p');
  duracion.textContent = `Duración: ${training.duracion.hh}h:${training.duracion.mm}m:${training.duracion.ss}s`;
  div.append(duracion);

  const velocidad = document.createElement('p');
  velocidad.textContent = `Velocidad: ${training.velocidad.toFixed(2)} km/h`;
  div.append(velocidad);

  const fecha = document.createElement('p');
  const fechaObj = new Date(training.createdAt);
  fecha.textContent = `Fecha: ${fechaObj.toLocaleString('es-ES')}`;
  div.append(fecha);

  const nivel = document.createElement('p');
  const span = document.createElement('span');
  nivel.textContent = 'Nivel: ';
  span.textContent = `${training.nivel}`;
  span.classList.add(`nivel-${training.nivel.toLowerCase().replace(' ', '-')}`);
  nivel.append(span);
  div.append(nivel);

  return div;
}

//  crear tarjeta de perfil de usuario
export function createProfileCard(userData) {
  const card = document.createElement('div');
  card.classList.add('profile-card');

  const nombre = document.createElement('p');
  nombre.textContent = `Nombre: ${userData.nombre}`;
  card.append(nombre);

  const apellidos = document.createElement('p');
  apellidos.textContent = `Apellidos: ${userData.apellidos}`;
  card.append(apellidos);

  const correo = document.createElement('p');
  correo.textContent = `Email: ${userData.correo}`;
  card.append(correo);

  const altura = document.createElement('p');
  altura.textContent = `Altura: ${userData.altura} cm`;
  card.append(altura);

  const peso = document.createElement('p');
  peso.textContent = `Peso: ${userData.peso} kg`;
  card.append(peso);

  const edad = document.createElement('p');
  edad.textContent = `Edad: ${userData.edad}`;
  card.append(edad);

  const numeroTlf = document.createElement('p');
  numeroTlf.textContent = `Número de teléfono: +34 ${splitPhoneNumber(userData.numeroTlf)}`;
  card.append(numeroTlf);

  return card;
}

//  normalizar número de teléfono en XXX XXX XXX
export function splitPhoneNumber(num) {
  const parts = num.match(/.{1,3}/g);
  return parts.join(' ');
}

export function isValidCorreo(correo) {
  const regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(correo);
}

export function isValidNumeroTlf(tlf) {
  return /^\d{9}$/.test(tlf);
}
