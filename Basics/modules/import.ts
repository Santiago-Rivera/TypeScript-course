// Import
import { name, age, isDeveloper } from "../variables.js"
import { Person } from "../POO/oop.js";
import { Employee } from "../POO/herencia.js";
import { Animal } from "../POO/polimorfismo.js";

console.log(`Importando variables: Mi nombre es: ${name} tengo ${age} años y soy desarrollador: ${isDeveloper}`);

const person1 = new Person("Santiago", 30, true);
person1.greet();

const employee1 = new Employee("Santiago", 30, true, "Google");
employee1.greet();
employee1.work();

const animal1 = new Animal("Perro");
animal1.makeSound();