import { toggleElement } from '../utils.js';

export function initTotalKmUI(elements, onBack) {
  const { totalKmList, btnBack } = elements;

  totalKmList.innerHTML = '';

  if (!btnBack.dataset.listenerAdded) {
    btnBack.addEventListener('click', () => {
      toggleElement(totalKmList, false);

      if (onBack) onBack();
    });

    btnBack.dataset.listenerAdded = true;
  }

  const storedUser = localStorage.getItem('user');

  if (storedUser) {
    const currentUser = JSON.parse(storedUser);

    const div = document.createElement('div');
    div.classList.add('training-card');

    const total = currentUser.entrenamientos.reduce(
      (acc, curr) => acc + curr.distanciaRecorrida,
      0
    );
    const p = document.createElement('p');
    const span = document.createElement('span');
    span.textContent = `${total.toFixed(2)} km`;
    span.classList.add('goldenrod');
    p.append(
      `¡${currentUser.nombre}, llevas `,
      span,
      ` recorridos desde que te uniste a nosotros!`
    );

    div.append(p);
    totalKmList.append(div);
  }
}
