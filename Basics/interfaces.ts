// Interfaces

interface Person {
    name: string;
    age: number;
    isDeveloper: boolean;
    greet(): void;
}

const person1: Person = {
    name: "Santiago",
    age: 30,
    isDeveloper: true,
    greet() {
        console.log(`Hola, mi nombre es ${this.name} y tengo ${this.age} años.`);
    }
};

const person2: Person = {
    name: "Juan",
    age: 25,
    isDeveloper: false,
    greet() {
        console.log(`Hola, mi nombre es ${this.name} y tengo ${this.age} años.`);
    }
};

person1.greet();
person2.greet();