// ============================
// REST PARAMETERS, SPREAD Y OVERLOADS
// ============================

// 1. REST PARAMETERS
function sum(...numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0);
}

console.log(sum(1, 2, 3, 4, 5));
console.log(sum());

// 2. REST PARAMETERS CON MÚLTIPLES TIPOS
function logMessages(prefix: string, ...messages: any[]): void {
    console.log(prefix, messages);
}

logMessages("INFO", "Message 1", "Message 2", 123);

// 3. REST PARAMETERS CON TIPOS ESPECÍFICOS
function joinStrings(separator: string, ...parts: string[]): string {
    return parts.join(separator);
}

const result = joinStrings("-", "hello", "world", "typescript");

// 4. SPREAD OPERATOR CON ARRAYS
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
const copied = [...arr1];

// 5. SPREAD OPERATOR CON OBJETOS
const user1 = { name: "John", age: 30 };
const user2 = { ...user1, city: "New York" };
const updated = { ...user1, age: 31 };

// 6. FUNCTION OVERLOADS
function format(value: string): string;
function format(value: number, digits?: number): string;
function format(value: boolean): string;
function format(value: string | number | boolean, digits?: number): string {
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    if (typeof value === "number") {
        return value.toFixed(digits ?? 2);
    }
    return value ? "true" : "false";
}

console.log(format("hello"));
console.log(format(3.14159, 1));
console.log(format(true));

// 7. FUNCTION OVERLOADS CON GENERICS
function reverse<T extends string>(value: T): T;
function reverse<T extends any[]>(value: T): T;
function reverse<T extends string | any[]>(value: T): T {
    if (typeof value === "string") {
        return value.split("").reverse().join("") as T;
    }
    return value.reverse() as T;
}

console.log(reverse("hello"));
console.log(reverse([1, 2, 3]));

// 8. CONSTRUCTOR OVERLOADS
class Shape {
    x: number;
    y: number;
    
    constructor(x: number, y: number);
    constructor(xy: { x: number; y: number });
    constructor(x: number | { x: number; y: number }, y?: number) {
        if (typeof x === "object") {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y!;
        }
    }
}

const shape1 = new Shape(10, 20);
const shape2 = new Shape({ x: 10, y: 20 });

// 9. METHOD OVERLOADS
class Storage {
    set<T>(key: string, value: T): void;
    set(key: string, value: unknown): void {
        // Implementación
    }
    
    get<T>(key: string): T | null;
    get(key: string): unknown {
        return null;
    }
}

// 10. VARIADIC TUPLE TYPES
function tuple<T extends readonly unknown[]>(...args: T): T {
    return args;
}

const t1 = tuple("a", 1, true);
const t2 = tuple(1, "b");

// 11. PARAMETERS TYPE
type FuncType = (x: number, y: string) => boolean;
type Params = Parameters<FuncType>;

function callFunction<T extends (...args: any[]) => any>(
    fn: T,
    ...args: Parameters<T>
): ReturnType<T> {
    return fn(...args);
}

// 12. ARRAY-LIKE SPREAD
function spread<T extends any[]>(...items: T): T {
    return items as T;
}

const args: [string, number] = ["hello", 42];
const result2 = spread(...args);

// 13. OPTIONAL PARAMS EN TUPLES
type TupleWithOptional = [string, number?, boolean?];

const t3: TupleWithOptional = ["a"];
const t4: TupleWithOptional = ["a", 1];
const t5: TupleWithOptional = ["a", 1, true];

// 14. VARIADIC REST PARAMETERS
function concat<T extends readonly any[]>(
    first: T,
    ...rest: T[]
): T[] {
    return [first, ...rest];
}

const combined2 = concat([1, 2], [3, 4], [5, 6]);

// 15. REST ELEMENT EN TUPLES
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];

const arr3: StringNumberBooleans = ["a", 1, true, false, true];
const arr4: StringBooleansNumber = ["a", true, false, 1];

// 16. SPREAD EN ARGUMENTOS
const calculateSum = (a: number, b: number, c: number) => a + b + c;
const numbers = [1, 2, 3] as const;
const total = calculateSum(...numbers);

// 17. REST PARAMETERS CON OBJETO
function createUser(
    name: string,
    ...options: Array<{ key: string; value: unknown }>
): { name: string; [key: string]: unknown } {
    const result: { name: string; [key: string]: unknown } = { name };
    for (const opt of options) {
        result[opt.key] = opt.value;
    }
    return result;
}

const newUser = createUser(
    "John",
    { key: "age", value: 30 },
    { key: "email", value: "john@example.com" }
);

// 18. DESTRUCTURING CON REST
const [first, ...rest18] = [1, 2, 3, 4, 5];
const { name: n, ...rest19 } = { name: "John", age: 30, city: "NY" };
