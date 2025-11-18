//  index.js -> entry point de clases
import { TrainingTracker, Persona, Entrenamiento } from './classes/index.js';

//  utils.js -> funciones auxiliares (aunque finalmente algo desperdigas en propósito)
import {
  updateLocalStorage,
  removeUserTrainings,
  showInfoMessage,
  isEmptyTrainings,
  isValidCorreo,
  isValidNumeroTlf,
  isValidDuracion,
  calcularDuracion,
  calcularNivel,
  calcularVelocidad,
  toggleElement,
  createTrainingCard,
} from './utils.js';

//  inicializadores de las vistas "dinámicas"
import { initTrainingsUI } from './modules/trainings.js';
import { initBestTrainingUI } from './modules/best-training.js';
import { initProfileUI } from './modules/profile.js';
import { initTotalKmUI } from './modules/total-km.js';

const app = new TrainingTracker();

//  galería de imágenes para el slideshow
const heroImgs = [
  './images/hero-img-01.jpg',
  './images/hero-img-02.jpg',
  './images/hero-img-03.jpg',
  './images/hero-img-04.jpg',
  './images/hero-img-05.jpg',
  './images/hero-img-06.jpg',
];

const heroImgEl = document.getElementById('hero-img');
let index = 0;
heroImgEl.src = heroImgs[index];
heroImgEl.classList.add('show');

//  slideshow
setInterval(() => {
  heroImgEl.classList.remove('show');

  setTimeout(() => {
    index = (index + 1) % heroImgs.length;
    heroImgEl.src = heroImgs[index];
    heroImgEl.classList.add('show');
  }, 500);
}, 5000);

//  elementos centralizados de las referencias del DOM
const el = {
  btnRegister: document.getElementById('btn-register'),
  btnWrapper: document.getElementById('btn-wrapper'),
  btnNewTraining: document.getElementById('btn-new-tr'),
  btnShowTrainings: document.getElementById('btn-show-tr'),
  btnBestTraining: document.getElementById('btn-best-tr'),
  btnTotalKm: document.getElementById('btn-total-km'),
  secondaryTitle: document.getElementById('secondary-title'),
  secondaryTrainingTitle: document.getElementById('secondary-training-title'),
  btnDeleteData: document.getElementById('btn-delete-data'),
  modalDeleteData: document.getElementById('modal-delete'),
  modalNewTr: document.getElementById('modal-new-tr'),
  btnDeleteConfirm: document.getElementById('modal-btn-confirm'),
  btnConfirmTr: document.getElementById('modal-btn-confirm-tr'),
  btnDeleteCancel: document.getElementById('modal-btn-cancel'),
  btnCancelNewTr: document.getElementById('btn-cancel-new-tr'),
  modalContent: document.getElementById('modal-content'),
  registerUserFormContainer: document.getElementById('register-form-container'),
  registerUserForm: document.getElementById('register-user-form'),
  heroImg: document.getElementById('hero-img'),
  homepageAuthBtnsWrapper: document.getElementById('homepage-auth-btns-wrapper'),
  homePageSlogan: document.getElementById('slogan'),
  registerTrainingForm: document.getElementById('register-training-form'),
  msgRegisterFormError: document.getElementById('msg-register-form-error'),
  msgTrainingFormError: document.getElementById('msg-training-form-error'),
  msgLoggedIn: document.getElementById('msg-logged-in-info'),
  addTrainingFormContainer: document.getElementById('add-training-form-container'),
  trainingsContainer: document.getElementById('trainings-container'),
  bestTrainingContainer: document.getElementById('best-training-container'),
  profileContainer: document.getElementById('profile-container'),
  btnMyProfile: document.getElementById('btn-my-profile'),
  totalKmContainer: document.getElementById('total-km-container'),
};

//  inicializador de Event Listeners
function initEventListeners() {
  el.btnRegister.addEventListener('click', hideHomepageUI);
  el.btnNewTraining.addEventListener('click', showRegisterTrainingUI);
  el.btnShowTrainings.addEventListener('click', renderShowTrainings);
  el.btnBestTraining.addEventListener('click', renderBestTraining);
  el.btnTotalKm.addEventListener('click', renderTotalKm);
  el.btnDeleteData.addEventListener('click', renderDeleteTrainings);
  el.registerUserForm.addEventListener('submit', handleRegisterSubmit);
  el.registerTrainingForm.addEventListener('submit', handleRegisterTraining);
  el.btnCancelNewTr.addEventListener('click', hideRegisterTrainingUI);
  el.btnMyProfile.addEventListener('click', renderMyProfile);

  el.btnDeleteConfirm.addEventListener('click', () => {
    removeUserTrainings(app.usuarios[0]);
    toggleElement(el.modalDeleteData, false);
    showInfoMessage(el.msgLoggedIn, 'Registros borrados correctamente');
  });

  el.btnConfirmTr.addEventListener('click', () => {
    toggleElement(el.modalNewTr, false);
    showInfoMessage(el.msgLoggedIn, 'Entrenamiento registrado correctamente');
  });

  el.btnDeleteCancel.addEventListener('click', () => {
    toggleElement(el.modalDeleteData, false);
  });
}

//  renderizador de registro exitoso
function renderRegisterUser(user) {
  showInfoMessage(el.msgLoggedIn, 'Usuario registrado correctamente');
  el.secondaryTitle.textContent = `¡Te damos la bienvenida, ${user.nombre}!`;
  toggleElement(el.btnRegister, false);
  toggleElement(el.btnWrapper, true);
  toggleElement(el.registerUserFormContainer, false);
  updateLocalStorage(app.usuarios[0]);
}

function hideHomepageUI() {
  toggleElement(el.registerUserFormContainer, true);
  toggleElement(el.heroImg, false);
  toggleElement(el.homepageAuthBtnsWrapper, false);
  toggleElement(el.homePageSlogan, false);
}

function hideRegisterTrainingUI() {
  toggleElement(el.btnWrapper, true);
  toggleElement(el.secondaryTitle, true);
  toggleElement(el.addTrainingFormContainer, false);
}

function showRegisterTrainingUI() {
  toggleElement(el.btnWrapper, false);
  toggleElement(el.secondaryTitle, false);
  toggleElement(el.addTrainingFormContainer, true);
}

//  manejador de registro de usuario
function handleRegisterSubmit(e) {
  e.preventDefault(); // evita que los datos del formulario se borren al hacer submit en caso de errores
  const formData = new FormData(el.registerUserForm);
  const data = Object.fromEntries(formData.entries());

  const error = validateRegisterUserData(data);

  if (error) {
    showInfoMessage(el.msgRegisterFormError, error, 'warning');
    return;
  }

  const user = new Persona(
    data.nombre,
    data.apellidos,
    data.correo,
    data.altura,
    data.peso,
    data.edad,
    data.numeroTlf
  );

  app.registrarUsuario(user);
  renderRegisterUser(user);
}

//  manejador de registro de entrenamientos
function handleRegisterTraining(e) {
  e.preventDefault();

  const formData = new FormData(el.registerTrainingForm);
  const data = Object.fromEntries(formData.entries());

  const error = validateRegisterTrainingData(data);
  if (error) return showInfoMessage(el.msgTrainingFormError, error, 'warning');

  const dRecorrida = Number(data.distanciaRecorrida);
  const duracion = calcularDuracion(data.duracion);
  const velocidad = calcularVelocidad(dRecorrida, duracion);
  const nivel = calcularNivel(dRecorrida, duracion, velocidad);

  const entrenamiento = new Entrenamiento(dRecorrida, duracion, velocidad);
  entrenamiento.nivel = nivel;
  app.usuarios[0].entrenamientos.push(entrenamiento);
  renderTraininingConfirmationModal(entrenamiento);
  hideRegisterTrainingUI();
  el.registerTrainingForm.reset(); // limpia los datos guardados previamente por e.preventDefault()
}

//  validador de datos de alta de usuarios
function validateRegisterUserData(data) {
  console.log(data.edad);
  if (!data.nombre.trim()) return 'El nombre no puede estar vacío.';
  if (!data.correo.trim()) return 'El correo no puede estar vacío.';
  if (!data.apellidos.trim()) data.apellidos = null;
  if (!isValidCorreo(data.correo)) return 'Correo inválido.';
  if (!data.altura.trim()) return 'La altura no puede estar vacía.';

  const altura = Number(data.altura);
  if (!altura || altura <= 0 || altura > 250) return 'Altura inválida.';

  if (!data.peso.trim()) return 'Peso no puede estar vacío.';
  const peso = Number(data.peso);
  if (!peso || peso <= 0 || peso > 300) return 'Peso inválido.';

  if (!data.edad.trim()) return 'Edad no puede estar vacía.';
  const edad = Number(data.edad);
  if (!edad || edad < 1 || edad > 120) return 'Edad inválida.';

  if (!data.numeroTlf.trim()) return 'Número de teléfono no puede estar vacío.';
  if (!isValidNumeroTlf(data.numeroTlf)) return 'Número de teléfono inválido.';
  if (!data.acceptTerms) return 'Debes aceptar los términos y condiciones.';

  return null; // si ha pasado todas las validaciones, entonces devuelvo un error null, o sea, sin errores
}

//  validador de datos de registro de entrenamientos
function validateRegisterTrainingData(data) {
  if (!data.distanciaRecorrida.trim()) return 'Distancia recorrida no puede estar vacía.';

  const distanciaRecorrida = Number(data.distanciaRecorrida);
  if (!distanciaRecorrida || distanciaRecorrida <= 0) return 'Distancia recorrida inválida.';

  if (!data.duracion.trim()) return 'Duración no puede estar vacía.';
  if (!isValidDuracion(data.duracion.trim())) return 'Duración inválida.';

  return null;
}

//  renderizador de modal de confirmación de entrenamiento
function renderTraininingConfirmationModal(training) {
  toggleElement(el.modalNewTr, true);
  el.modalContent.innerHTML = ''; // limpieza inicial para no concatenar el contenido previo

  const card = createTrainingCard(training, true); // segundo param true porque se trata un modal (propósitos de CSS)
  el.modalContent.append(card);

  updateLocalStorage(app.usuarios[0]);
}

//  renderizador de la vista de entrenamientos que recibe un objeto con los elementos a manipular y un
//  callback , en este caso para ejecutarse dentro del btnBack.addEventListener('click', callback)
function renderShowTrainings() {
  if (checkEmptyTrainings()) return;

  toggleElement(el.trainingsContainer, true);
  toggleElement(el.btnWrapper, false);
  toggleElement(el.secondaryTitle, false);

  //  inicializador de la UI de entrenamientos
  initTrainingsUI(
    {
      trainingsList: document.getElementById('trainings-list'),
      msgTrainings: document.getElementById('msg-trainings'),
      btnBack: document.getElementById('btn-trainings-back'),
    },
    () => renderUserHomepageUI(el.trainingsContainer) // callback
  );
}

//  renderizador reutilizable que recibe el elemento contenedor para esconder
function renderUserHomepageUI(containerToHide) {
  toggleElement(containerToHide, false);
  toggleElement(el.btnWrapper, true);
  toggleElement(el.secondaryTitle, true);
}

// renderizador de la vista de mejor entrenamiento
function renderBestTraining() {
  if (checkEmptyTrainings()) return;

  toggleElement(el.btnWrapper, false);
  toggleElement(el.secondaryTitle, false);
  toggleElement(el.bestTrainingContainer, true);

  initBestTrainingUI(
    {
      bestTrainingList: document.getElementById('best-training-list'),
      msg: document.getElementById('msg-best-training'),
      btnBack: document.getElementById('btn-best-training-back'),
    },
    () => renderUserHomepageUI(el.bestTrainingContainer)
  );
}

//  renderizador de la vista de perfil de usuario
function renderMyProfile() {
  toggleElement(el.btnWrapper, false);
  toggleElement(el.secondaryTitle, false);
  toggleElement(el.profileContainer, true);

  initProfileUI(
    {
      profileList: document.getElementById('profile-list'),
      btnBack: document.getElementById('btn-profile-back'),
    },
    () => renderUserHomepageUI(el.profileContainer)
  );
}

//  renderizador de la vista de km totales
function renderTotalKm() {
  if (checkEmptyTrainings()) return;

  toggleElement(el.btnWrapper, false);
  toggleElement(el.secondaryTitle, false);
  toggleElement(el.totalKmContainer, true);

  initTotalKmUI(
    {
      totalKmList: document.getElementById('total-km-list'),
      btnBack: document.getElementById('btn-total-km-back'),
    },
    () => renderUserHomepageUI(el.totalKmContainer)
  );
}

//  renderizador de borrado de entrenamientos
function renderDeleteTrainings() {
  if (checkEmptyTrainings()) return;
  toggleElement(el.modalDeleteData, true); // activa el modal para confirmar el borrado
}

//  comprueba si el usuario no tiene entrenamientos registrados
function checkEmptyTrainings() {
  if (isEmptyTrainings(app.usuarios[0])) {
    showInfoMessage(el.msgLoggedIn, 'No hay entrenamientos registrados actualmente', 'warning');
    return true;
  }
  return false;
}

initEventListeners();
