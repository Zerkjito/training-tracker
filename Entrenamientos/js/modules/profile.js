import { createProfileCard } from '../utils.js';

export function initProfileUI(elements, onBack) {
  const { profileList, btnBack } = elements;

  profileList.innerHTML = '';

  //  condición para evitar acumular Event Listeners
  if (!btnBack.dataset.listenerAdded) {
    btnBack.addEventListener('click', () => {
      if (onBack) onBack(); //  si el callback realmente existe, lo ejecuto
    });

    btnBack.dataset.listenerAdded = true; //  bandera de activación
  }

  const storedUser = localStorage.getItem('user');

  //  si existe el usuario, recupero la data
  if (storedUser) {
    const currentUser = JSON.parse(storedUser);
    const profileCard = createProfileCard(currentUser);

    profileList.append(profileCard); // concatenar la card al contenedor
  }
}
