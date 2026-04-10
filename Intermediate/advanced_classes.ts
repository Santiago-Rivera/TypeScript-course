// ============================
// CLASES AVANZADAS, HERENCIA Y MIXINS
// ============================

// 1. ABSTRACT CLASSES
abstract class Animal {
    abstract name: string;
    abstract makeSound(): void;
    
    move(): void {
        console.log("Animal is moving");
    }
    
    abstract age: number;
}

class Dog extends Animal {
    name = "Rex";
    age = 5;
    
    makeSound(): void {
        console.log("Woof!");
    }
}

const dog = new Dog();
dog.makeSound();

// 2. STATIC PROPERTIES Y METHODS
class Counter {
    static count: number = 0;
    
    static increment() {
        Counter.count++;
    }
    
    static getCount() {
        return Counter.count;
    }
}

Counter.increment();
Counter.increment();
console.log(Counter.getCount());

// 3. STATIC FACTORY METHODS
class User {
    private constructor(
        public name: string,
        public email: string
    ) {}
    
    static create(name: string, email: string): User {
        console.log(`Creating user: ${name}`);
        return new User(name, email);
    }
    
    static fromJSON(json: string): User {
        const data = JSON.parse(json);
        return new User(data.name, data.email);
    }
}

const user = User.create("John", "john@example.com");

// 4. READONLY PROPERTIES
class Point {
    readonly x: number;
    readonly y: number;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

const point = new Point(10, 20);

// 5. GETTERS Y SETTERS AVANZADOS
class Temperature {
    private _celsius = 0;
    
    get celsius(): number {
        return this._celsius;
    }
    
    set celsius(value: number) {
        if (value < -273.15) {
            throw new Error("Temperature cannot be below absolute zero");
        }
        this._celsius = value;
    }
    
    get fahrenheit(): number {
        return this._celsius * 9 / 5 + 32;
    }
    
    set fahrenheit(value: number) {
        this.celsius = (value - 32) * 5 / 9;
    }
}

const temp = new Temperature();
temp.celsius = 25;
console.log(temp.fahrenheit);

// 6. PRIVATE, PROTECTED, PUBLIC
class Employee {
    public name: string;
    protected department: string;
    private salary: number;
    
    constructor(name: string, department: string, salary: number) {
        this.name = name;
        this.department = department;
        this.salary = salary;
    }
    
    public getSalary(): number {
        return this.salary;
    }
}

class Manager extends Employee {
    increaseSalary(): void {
        console.log(`Manager of ${this.department}`);
    }
}

// 7. PRIVATE FIELDS (#)
class BankAccount {
    #balance = 0;
    #pinCode: number;
    
    constructor(pinCode: number) {
        this.#pinCode = pinCode;
    }
    
    #verifyPin(pin: number): boolean {
        return pin === this.#pinCode;
    }
    
    deposit(amount: number): void {
        this.#balance += amount;
    }
    
    withdraw(amount: number, pin: number): number {
        if (!this.#verifyPin(pin)) {
            throw new Error("Wrong PIN");
        }
        if (amount > this.#balance) {
            throw new Error("Insufficient funds");
        }
        this.#balance -= amount;
        return this.#balance;
    }
}

// 8. MIXINS
function Loggable<TBase extends { new(...args: any[]): {} }>(
    Base: TBase
) {
    return class extends Base {
        log(message: string) {
            console.log(`[LOG] ${message}`);
        }
    };
}

function Timestampable<TBase extends { new(...args: any[]): {} }>(
    Base: TBase
) {
    return class extends Base {
        getTimestamp() {
            return new Date().toISOString();
        }
    };
}

class BaseClass {
    constructor(public name: string) {}
}

const MixedClass = Timestampable(Loggable(BaseClass));
const mixed = new MixedClass("John");
mixed.log("Test");

// 9. MÚLTIPLE HERENCIA CON INTERFACES
interface Serializable {
    serialize(): string;
}

interface Deserializable {
    deserialize(json: string): void;
}

class Data implements Serializable, Deserializable {
    constructor(public id: number, public value: string) {}
    
    serialize(): string {
        return JSON.stringify({ id: this.id, value: this.value });
    }
    
    deserialize(json: string): void {
        const data = JSON.parse(json);
        this.id = data.id;
        this.value = data.value;
    }
}

// 10. GENERIC CLASSES
class Container<T> {
    private items: T[] = [];
    
    add(item: T): void {
        this.items.push(item);
    }
    
    remove(item: T): void {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }
    
    getAll(): T[] {
        return [...this.items];
    }
    
    map<U>(fn: (item: T) => U): U[] {
        return this.items.map(fn);
    }
}

const stringContainer = new Container<string>();
stringContainer.add("hello");
stringContainer.add("world");

const numberResults = stringContainer.map(s => s.length);

// 11. GENERIC CONSTRAINTS EN CLASES
class Repository<T extends { id: number }> {
    private items: T[] = [];
    
    add(item: T): void {
        this.items.push(item);
    }
    
    findById(id: number): T | undefined {
        return this.items.find(item => item.id === id);
    }
    
    getAll(): T[] {
        return [...this.items];
    }
}

interface Entity {
    id: number;
    createdAt: Date;
}

class Post implements Entity {
    id = 1;
    createdAt = new Date();
    title = "TypeScript Guide";
}

const postRepository = new Repository<Post>();
postRepository.add(new Post());

// 12. THIS BINDING
class Clicker {
    private clickCount = 0;
    
    onClick = () => {
        this.clickCount++;
        console.log(`Clicked ${this.clickCount} times`);
    };
}

const clicker = new Clicker();
const handler = clicker.onClick;
handler();

// 13. INHERITANCE CON SUPER
class Vehicle {
    constructor(public name: string) {}
    
    start(): void {
        console.log(`${this.name} is starting`);
    }
}

class Car extends Vehicle {
    constructor(name: string, public doors: number) {
        super(name);
    }
    
    start(): void {
        super.start();
        console.log(`${this.name} car is ready with ${this.doors} doors`);
    }
}

const car = new Car("Tesla", 4);
car.start();

// 14. PARAMETER PROPERTIES
class Rectangle {
    constructor(
        readonly width: number,
        readonly height: number,
        private color: string = "black"
    ) {}
    
    getArea(): number {
        return this.width * this.height;
    }
}

const rect = new Rectangle(10, 20);

// 15. ABSTRACT METHODS IMPLEMENTATION
abstract class Shape {
    abstract calculateArea(): number;
    
    printArea() {
        console.log(`Area: ${this.calculateArea()}`);
    }
}

class Circle extends Shape {
    constructor(private radius: number) {
        super();
    }
    
    calculateArea(): number {
        return Math.PI * this.radius ** 2;
    }
}

const circle = new Circle(5);
circle.printArea();
