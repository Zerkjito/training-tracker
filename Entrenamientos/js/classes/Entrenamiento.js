export default class Entrenamiento {
  constructor(distanciaRecorrida, duracion, velocidad = null, now = new Date()) {
    this.distanciaRecorrida = distanciaRecorrida;
    this.duracion = duracion;
    this.velocidad = velocidad;
    this.createdAt = new Date(now);
    this.nivel = null;
  }
}
