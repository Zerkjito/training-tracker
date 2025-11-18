import { showInfoMessage, createTrainingCard, toggleElement } from '../utils.js';

export function initBestTrainingUI(elements, onBack) {
  const { bestTrainingList, msg, btnBack } = elements;

  bestTrainingList.innerHTML = '';

  if (!btnBack.dataset.listenerAdded) {
    btnBack.addEventListener('click', () => {
      toggleElement(bestTrainingList, false);

      if (onBack) onBack();
    });

    btnBack.dataset.listenerAdded = true;
  }

  const storedUser = localStorage.getItem('user');

  if (storedUser) {
    const currentUser = JSON.parse(storedUser);
    showInfoMessage(msg, 'Mostrando mejor entrenamiento', 'info');

    const bestTraining = currentUser.entrenamientos.reduce((best, curr) => {
      if (!best) return curr;
      if (curr.velocidad > best.velocidad) return curr;
      if (curr.velocidad === best.velocidad && curr.distanciaRecorrida > best.distanciaRecorrida) {
        return curr;
      }
      return best;
    }, null);

    const div = createTrainingCard(bestTraining);
    bestTrainingList.append(div);
  }
}
