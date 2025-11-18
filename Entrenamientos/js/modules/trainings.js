import { showInfoMessage, createTrainingCard, toggleElement } from '../utils.js';

export function initTrainingsUI(elements, onBack) {
  const { trainingsList, msgTrainings, btnBack } = elements;

  trainingsList.innerHTML = '';

  if (!btnBack.dataset.listenerAdded) {
    btnBack.addEventListener('click', () => {
      toggleElement(trainingsList, false);

      if (onBack) onBack();
    });
    btnBack.dataset.listenerAdded = true;
  }

  const storedUser = localStorage.getItem('user');

  if (storedUser) {
    const currentUser = JSON.parse(storedUser);
    showInfoMessage(
      msgTrainings,
      `Mostrando ${currentUser.entrenamientos.length} entrenamiento(s)`,
      'info'
    );

    currentUser.entrenamientos.forEach((training) => {
      const div = createTrainingCard(training);
      trainingsList.append(div);
    });
  } else {
    console.log('Se supone que aquí algo habría ido mal.');
  }
}
