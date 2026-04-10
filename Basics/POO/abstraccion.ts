// Abstraccion

abstract class Animal {
    name: string;
    
    constructor(name: string) {
        this.name = name;
    }

    abstract makeSound(): void;

    move(): void {
        console.log(`${this.name} se está moviendo.`);
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
myDog.move(); // Rex se está moviendo.

myCat.makeSound(); // Whiskers dice: ¡Miau!
myCat.move(); // Whiskers se está moviendo.