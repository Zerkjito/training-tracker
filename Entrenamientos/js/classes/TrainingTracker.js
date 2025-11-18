export default class TrainingTracker {
  constructor() {
    this.usuarios = [];
  }

  registrarUsuario(user) {
    this.usuarios.push(user);
    return user;
  }
}
