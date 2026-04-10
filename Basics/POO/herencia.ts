// Herencia

class Person {
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

export class Employee extends Person {
    company: string;

    constructor(name: string, age: number, isDeveloper: boolean, company: string) {
        super(name, age, isDeveloper);
        this.company = company;
    }

    work() {
        console.log(`${this.name} está trabajando en ${this.company}.`);
    }
}

const employee1 = new Employee("Santiago", 30, true, "Google");
employee1.greet();
employee1.work();

const employee2 = new Employee("Juan", 25, false, "Microsoft");
employee2.greet();
employee2.work();