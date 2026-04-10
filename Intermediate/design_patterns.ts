// ============================
// DESIGN PATTERNS EN TYPESCRIPT
// ============================

// 1. SINGLETON PATTERN
class Database {
    private static instance: Database;
    private data: Map<string, unknown> = new Map();
    
    private constructor() {}
    
    static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    
    set(key: string, value: unknown) {
        this.data.set(key, value);
    }
    
    get(key: string) {
        return this.data.get(key);
    }
}

const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true

// 2. OBSERVER PATTERN
type Observer<T> = (data: T) => void;

class Subject<T> {
    private observers: Set<Observer<T>> = new Set();
    
    subscribe(observer: Observer<T>) {
        this.observers.add(observer);
        return () => this.observers.delete(observer);
    }
    
    notify(data: T) {
        this.observers.forEach(observer => observer(data));
    }
}

const subject = new Subject<string>();

const unsubscribe = subject.subscribe((msg) => {
    console.log(`Observer 1: ${msg}`);
});

subject.subscribe((msg) => {
    console.log(`Observer 2: ${msg}`);
});

subject.notify("Hello!");
unsubscribe();
subject.notify("Goodbye!");

// 3. BUILDER PATTERN
class QueryBuilder {
    private query: string = "SELECT * FROM users";
    private conditions: string[] = [];
    
    where(condition: string): this {
        this.conditions.push(condition);
        return this;
    }
    
    limit(count: number): this {
        this.query += ` LIMIT ${count}`;
        return this;
    }
    
    build(): string {
        if (this.conditions.length > 0) {
            this.query += " WHERE " + this.conditions.join(" AND ");
        }
        return this.query;
    }
}

const query = new QueryBuilder()
    .where("age > 18")
    .where("country = 'USA'")
    .limit(10)
    .build();

console.log(query);

// 4. FACTORY PATTERN
interface Shape {
    draw(): void;
}

class Circle implements Shape {
    draw() { console.log("Drawing circle"); }
}

class Square implements Shape {
    draw() { console.log("Drawing square"); }
}

class ShapeFactory {
    static create(type: "circle" | "square"): Shape {
        switch (type) {
            case "circle":
                return new Circle();
            case "square":
                return new Square();
            default:
                throw new Error(`Unknown shape: ${type}`);
        }
    }
}

const shape = ShapeFactory.create("circle");
shape.draw();

// 5. DEPENDENCY INJECTION
interface Logger {
    log(message: string): void;
}

class ConsoleLogger implements Logger {
    log(message: string) {
        console.log(`[LOG] ${message}`);
    }
}

class UserService {
    constructor(private logger: Logger) {}
    
    createUser(name: string) {
        this.logger.log(`Creating user: ${name}`);
        return { id: 1, name };
    }
}

const logger = new ConsoleLogger();
const userService = new UserService(logger);
userService.createUser("John");

// 6. STRATEGY PATTERN
interface PaymentStrategy {
    pay(amount: number): void;
}

class CreditCardPayment implements PaymentStrategy {
    pay(amount: number) {
        console.log(`Paid $${amount} with credit card`);
    }
}

class PayPalPayment implements PaymentStrategy {
    pay(amount: number) {
        console.log(`Paid $${amount} with PayPal`);
    }
}

class ShoppingCart {
    private strategy: PaymentStrategy | null = null;
    
    setPaymentStrategy(strategy: PaymentStrategy) {
        this.strategy = strategy;
    }
    
    checkout(amount: number) {
        if (!this.strategy) {
            throw new Error("Payment strategy not set");
        }
        this.strategy.pay(amount);
    }
}

const cart = new ShoppingCart();
cart.setPaymentStrategy(new CreditCardPayment());
cart.checkout(100);

// 7. DECORATOR PATTERN
interface Component {
    operation(): string;
}

class ConcreteComponent implements Component {
    operation(): string {
        return "ConcreteComponent";
    }
}

abstract class Decorator implements Component {
    constructor(protected component: Component) {}
    
    operation(): string {
        return this.component.operation();
    }
}

class ConcreteDecoratorA extends Decorator {
    operation(): string {
        return `ConcreteDecoratorA(${super.operation()})`;
    }
}

class ConcreteDecoratorB extends Decorator {
    operation(): string {
        return `ConcreteDecoratorB(${super.operation()})`;
    }
}

const component = new ConcreteComponent();
const decorated1 = new ConcreteDecoratorA(component);
const decorated2 = new ConcreteDecoratorB(decorated1);

console.log(decorated2.operation());

// 8. PROXY PATTERN
interface User {
    getName(): string;
}

class RealUser implements User {
    constructor(private name: string) {}
    
    getName(): string {
        console.log("Fetching user from database");
        return this.name;
    }
}

class UserProxy implements User {
    private user: RealUser | null = null;
    
    constructor(private name: string) {}
    
    getName(): string {
        if (!this.user) {
            this.user = new RealUser(this.name);
        }
        return this.user.getName();
    }
}

const userProxy = new UserProxy("John");
console.log(userProxy.getName());
