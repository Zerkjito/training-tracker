export default class Persona {
  constructor(nombre, apellidos, correo, altura, peso, edad, numeroTlf) {
    this.nombre = nombre;
    this.apellidos = apellidos ?? 'No especificado';
    this.correo = correo;
    this.altura = altura;
    this.peso = peso;
    this.edad = edad;
    this.numeroTlf = numeroTlf;
    this.entrenamientos = [];
  }
}
