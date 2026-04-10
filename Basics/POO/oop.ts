// Programacion orientada a objetos

export class Person {
    name: string;
    age: number;
    isDeveloper: boolean;

    constructor(name: string, age: number, isDeveloper: boolean) {
        this.name = name;
        this.age = age;
        this.isDeveloper = isDeveloper;
    }

    greet() {
        console.log(`Hola, mi nombre es ${this.name} y tengo ${this.age} años.`);
    }
}

const person1 = new Person("Santiago", 30, true);
person1.greet();

const person2 = new Person("Juan", 25, false);
person2.greet();