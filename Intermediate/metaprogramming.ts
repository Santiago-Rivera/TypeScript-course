// ============================
// METAPROGRAMMING Y REFLECTION
// ============================

// 1. OBJECT.KEYS, OBJECT.ENTRIES
interface User {
    name: string;
    age: number;
    email: string;
}

const user: User = {
    name: "John",
    age: 30,
    email: "john@example.com"
};

// Object.keys
const keys = Object.keys(user) as (keyof User)[];
console.log(keys);

// Object.entries
const entries = Object.entries(user) as [keyof User, User[keyof User]][];
entries.forEach(([key, value]) => {
    console.log(`${String(key)}: ${value}`);
});

// 2. PROXY - INTERCEPCIÓN
const handler: ProxyHandler<any> = {
    get: (target, prop) => {
        console.log(`Getting property: ${String(prop)}`);
        return target[prop as keyof User];
    },
    set: (target, prop, value) => {
        console.log(`Setting property ${String(prop)} to ${value}`);
        target[prop as keyof User] = value;
        return true;
    },
    has: (target, prop) => {
        console.log(`Checking if ${String(prop)} exists`);
        return prop in target;
    },
    deleteProperty: (target, prop) => {
        console.log(`Deleting property ${String(prop)}`);
        delete target[prop as keyof User];
        return true;
    }
};

const proxiedUser: any = new Proxy(user, handler);
proxiedUser.name;
proxiedUser.age = 31;
'email' in proxiedUser;
delete proxiedUser.email;

// 3. REFLECT API
const obj = { x: 1, y: 2 };

const value = Reflect.get(obj, "x");
Reflect.set(obj, "z", 3);
const hasX = Reflect.has(obj, "x");
Reflect.deleteProperty(obj, "y");
const allKeys = Reflect.ownKeys(obj);

// 4. PROPERTY DESCRIPTORS
const obj2: any = {};

Object.defineProperty(obj2, "prop", {
    value: 42,
    writable: false,
    enumerable: true,
    configurable: false
});

const desc = Object.getOwnPropertyDescriptor(obj2, "prop");

// 5. GETTERS Y SETTERS AVANZADOS
class Temperature {
    private _celsius = 0;
    
    get celsius(): number {
        console.log("Getting celsius");
        return this._celsius;
    }
    
    set celsius(value: number) {
        console.log(`Setting celsius to ${value}`);
        if (value < -273.15) {
            throw new Error("Absolute zero is -273.15°C");
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

// 6. SYMBOL PARA PROPIEDADES PRIVADAS
const privateData = Symbol("privateData");

class SecureClass {
    [privateData] = "secret";
    
    getSecret(): string {
        return this[privateData];
    }
}

const secure = new SecureClass();
console.log(Object.keys(secure));
console.log(Object.getOwnPropertySymbols(secure));

// 7. WEAK MAPS PARA METADATA
const metadata = new WeakMap<object, Map<string, unknown>>();

function setMetadata(target: object, key: string, value: unknown) {
    if (!metadata.has(target)) {
        metadata.set(target, new Map());
    }
    metadata.get(target)!.set(key, value);
}

function getMetadata(target: object, key: string): unknown {
    return metadata.get(target)?.get(key);
}

const obj3 = {};
setMetadata(obj3, "version", "1.0");
console.log(getMetadata(obj3, "version"));

// 8. CLASS REFLECTION
class Person {
    constructor(public name: string, public age: number) {}
    
    greet() {
        return `Hello, I'm ${this.name}`;
    }
}

function showClassInfo(ctor: Function) {
    console.log(`Class name: ${ctor.name}`);
    console.log(`Properties:`, Object.getOwnPropertyNames(ctor.prototype));
}

showClassInfo(Person);

// 9. DYNAMIC PROPERTY ACCESS
function getSafeProperty<T extends object, K extends keyof T>(
    obj: T,
    key: K,
    defaultValue: T[K]
): T[K] {
    return key in obj ? obj[key] : defaultValue;
}

const config = { timeout: 5000 };
const retries = getSafeProperty(config, "timeout" as any, 3);

// 10. COMPUTED PROPERTY NAMES
function createObject(keys: string[], value: unknown): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const key of keys) {
        result[key] = value;
    }
    return result;
}

const obj4 = createObject(["a", "b", "c"], 0);

// 11. TYPE ASSERTION GUARDS
function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function processRecord(value: unknown) {
    if (isRecord(value)) {
        console.log(Object.keys(value));
    }
}

// 12. ITERATE OVER OBJECT TYPES
type IterateObject<T extends object> = {
    [K in keyof T]: (value: T[K]) => void;
};

function iterateObject<T extends object>(
    obj: T,
    callbacks: IterateObject<T>
) {
    for (const key in obj) {
        (callbacks[key as keyof T] as any)(obj[key]);
    }
}

const callbacks = {
    name: (v: string) => console.log(`Name: ${v}`),
    age: (v: number) => console.log(`Age: ${v}`)
};

iterateObject({ name: "John", age: 30 }, callbacks);

// 13. ABSTRACT SYNTAX
function parseExpression(str: string): any {
    try {
        return Function(`"use strict"; return (${str})`)();
    } catch (e) {
        throw new Error(`Invalid expression: ${str}`);
    }
}

const expr = parseExpression("2 + 2 * 3");
console.log(expr);
