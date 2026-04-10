// Polimorfismo

export class Animal {
    name: string;
    
    constructor(name: string) {
        this.name = name;
    }

    makeSound(): void {
        console.log(`${this.name} hace un sonido.`);
    }
}

class Dog extends Animal {
    makeSound(): void {
        console.log(`${this.name} dice: ¡Guau!`);
    }
}

class Cat extends Animal {
    makeSound(): void {
        console.log(`${this.name} dice: ¡Miau!`);
    }
}

const myDog = new Dog("Rex");
const myCat = new Cat("Whiskers");

myDog.makeSound(); // Rex dice: ¡Guau!
myCat.makeSound(); // Whiskers dice: ¡Miau!
