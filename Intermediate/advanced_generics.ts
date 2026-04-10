// ============================
// GENERICS AVANZADOS
// ============================

// 1. GENERIC CONSTRAINTS - Limitar tipos genéricos
interface HasId {
    id: number;
}

function getId<T extends HasId>(obj: T): number {
    return obj.id;
}

// Funciona
getId({ id: 1, name: "John" });

// Error: type '{ name: string }' does not satisfy the constraint 'HasId'
// getId({ name: "John" });

// 2. MULTIPLE CONSTRAINTS
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
    return { ...obj1, ...obj2 } as T & U;
}

const merged = merge({ a: 1 }, { b: 2 });
// { a: 1, b: 2 }

// 3. KEYOF CONSTRAINT - Acceder a propiedades con seguridad de tipos
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

interface User {
    name: string;
    age: number;
}

const user: User = { name: "John", age: 30 };
const name = getProperty(user, "name"); // type: string
// getProperty(user, "email"); // Error!

// 4. CONDITIONAL GENERICS
type IsString<T> = T extends string ? true : false;

function process<T>(value: T): T extends string ? string : number {
    if (typeof value === "string") {
        return value.toUpperCase() as any;
    }
    return (value as any) + 1;
}

// 5. DEFAULT GENERIC TYPES
function createArray<T = string>(length: number, fill: T): T[] {
    return Array(length).fill(fill);
}

const strArray = createArray(3, "hello"); // string[]
const numArray = createArray<number>(3, 42); // number[]

// 6. GENERIC FUNCTION TYPES
type Filter<T> = (item: T) => boolean;

function filterArray<T>(arr: T[], predicate: Filter<T>): T[] {
    return arr.filter(predicate);
}

const numbers = [1, 2, 3, 4, 5];
const evenNumbers = filterArray(numbers, n => n % 2 === 0); // [2, 4]

// 7. GENERIC FACTORY PATTERN
interface Constructor<T> {
    new (): T;
}

function create<T>(ctor: Constructor<T>): T {
    return new ctor();
}

class UserClass {
    name = "John";
}

const userInstance = create(UserClass); // UserClass

// 8. RECURSIVE GENERICS - Tipos recursivos
type JsonValue = 
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [key: string]: JsonValue };

function parseJson<T extends JsonValue>(json: T): T {
    return JSON.parse(JSON.stringify(json));
}

// 9. PARAMETER IN GENERIC CONSTRAINTS
function getLength<T extends { length: number }>(obj: T): number {
    return obj.length;
}

getLength("hello"); // 5
getLength([1, 2, 3]); // 3
getLength({ length: 10 }); // 10

// 10. EXTRACT SPECIFIC TYPE FROM UNION
function extractByType<T, U extends T>(arr: T[], type: (item: T) => item is U): U[] {
    return arr.filter(type);
}

type Animal = { type: "dog"; name: string } | { type: "cat"; name: string };

const animals: Animal[] = [
    { type: "dog", name: "Rex" },
    { type: "cat", name: "Whiskers" }
];

const isDog = (animal: Animal): animal is { type: "dog"; name: string } => 
    animal.type === "dog";

const dogs = extractByType(animals, isDog);

// 11. VARIADIC TUPLE TYPES
function concatArrays<T, U>(first: T[], ...rest: T[][]): T[] {
    return [first, ...rest].reduce((acc, arr) => [...acc, ...arr], []);
}

const result1 = concatArrays(["a", "b"], ["c", "d"]);
const result2 = concatArrays([1, 2], [3, 4]);

// 12. INFER EN TIPOS CONDICIONALES
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type MyFunc = (x: number) => string;
type MyReturn = ReturnType<MyFunc>; // string

// 13. INFER CON TUPLES
type TupleToObject<T extends readonly (string | number)[]> = {
    [K in T[number]]: K;
};

type MyTuple = ["foo", "bar"];
type MyObject = TupleToObject<MyTuple>;
// { foo: "foo"; bar: "bar"; }

// 14. NAMESPACE GENERICS
namespace Generic {
    export function identity<T>(value: T): T {
        return value;
    }
    
    export interface Container<T> {
        value: T;
        getValue(): T;
    }
    
    export class Box<T> implements Container<T> {
        constructor(public value: T) {}
        getValue(): T {
            return this.value;
        }
    }
}

const box = new Generic.Box(42);
const boxValue = box.getValue(); // 42

// 15. COMPLEX GENERIC PATTERN - EventEmitter
type EventMap = Record<string, any>;

class EventEmitter<Events extends EventMap> {
    private listeners = new Map<keyof Events, Set<Function>>();
    
    on<E extends keyof Events>(event: E, listener: (data: Events[E]) => void): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(listener);
    }
    
    emit<E extends keyof Events>(event: E, data: Events[E]): void {
        this.listeners.get(event)?.forEach(listener => listener(data));
    }
}

interface MyEvents {
    "user:login": { userId: number };
    "user:logout": { userId: number };
}

const emitter = new EventEmitter<MyEvents>();
emitter.on("user:login", (data) => {
    console.log(`Usuario ${data.userId} inició sesión`);
});
emitter.emit("user:login", { userId: 1 });
