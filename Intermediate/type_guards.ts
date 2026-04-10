// ============================
// TYPE GUARDS Y DISCRIMINATED UNIONS
// ============================

// 1. TYPE GUARDS BÁSICOS - Narrowing de tipos
function processValue(value: string | number) {
    if (typeof value === "string") {
        console.log(value.toUpperCase());
    } else {
        console.log(value.toFixed(2));
    }
}

// 2. TYPE GUARDS CON INSTANCEOF
class Dog {
    bark() { console.log("woof"); }
}

class Cat {
    meow() { console.log("meow"); }
}

function animalSound(animal: Dog | Cat) {
    if (animal instanceof Dog) {
        animal.bark();
    } else if (animal instanceof Cat) {
        animal.meow();
    }
}

// 3. TYPE PREDICATES - Funciones que retornan type is
interface Fish {
    swim(): void;
}

interface Bird {
    fly(): void;
}

function isFish(animal: Fish | Bird): animal is Fish {
    return "swim" in animal;
}

function move(animal: Fish | Bird) {
    if (isFish(animal)) {
        animal.swim();
    } else {
        animal.fly();
    }
}

// 4. DISCRIMINATED UNIONS - Uniones con discriminador
type Success<T> = {
    status: "success";
    data: T;
};

type Error = {
    status: "error";
    message: string;
};

type Result<T> = Success<T> | Error;

function handleResult<T>(result: Result<T>) {
    if (result.status === "success") {
        console.log("Datos:", result.data);
    } else {
        console.log("Error:", result.message);
    }
}

// 5. DISCRIMINATED UNION CON MÚLTIPLES VARIANTES
type Shape = 
    | { kind: "circle"; radius: number }
    | { kind: "square"; side: number }
    | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.side ** 2;
        case "rectangle":
            return shape.width * shape.height;
    }
}

// 6. EXHAUSTIVENESS CHECKING - Verificar que se manejen todos los casos
function describeShape(shape: Shape): string {
    switch (shape.kind) {
        case "circle":
            return `Círculo con radio ${shape.radius}`;
        case "square":
            return `Cuadrado con lado ${shape.side}`;
        case "rectangle":
            return `Rectángulo ${shape.width}x${shape.height}`;
        default:
            // Si agregar una nueva variante, TypeScript dará error aquí
            const _exhaustive: never = shape;
            return _exhaustive;
    }
}

// 7. CUSTOM TYPE GUARDS CON OBJETO
interface User {
    type: "user";
    name: string;
}

interface Admin {
    type: "admin";
    name: string;
    permissions: string[];
}

type Account = User | Admin;

function isAdmin(account: Account): account is Admin {
    return account.type === "admin";
}

function displayAccount(account: Account) {
    if (isAdmin(account)) {
        console.log(`Admin ${account.name} con permisos:`, account.permissions);
    } else {
        console.log(`Usuario ${account.name}`);
    }
}

// 8. TRUTHY/FALSY TYPE GUARDS
function logValue(value: string | null | undefined) {
    if (value) {
        console.log(value.toLowerCase());
    }
}

// 9. EQUALITY TYPE GUARDS
type Literal = "a" | "b" | "c";

function handleLiteral(value: Literal, comparison: Literal) {
    if (value === comparison) {
        console.log("Son iguales");
    }
}

// 10. IN OPERATOR - Verificar propiedades
interface Admin2 {
    admin: true;
    permissions: string[];
}

interface User2 {
    admin?: false;
    email: string;
}

function hasPermissions(account: Admin2 | User2) {
    if ("permissions" in account) {
        console.log("Permisos:", account.permissions);
    }
}

// 11. CONST TYPE PARAMETERS
function identity<const T>(value: T): T {
    return value;
}

const result = identity("hello");
// result tiene tipo "hello" (literal), no string

// 12. AS CONST TYPE GUARDS
const statusCodes = {
    OK: 200,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
} as const;

type StatusCode = typeof statusCodes[keyof typeof statusCodes];
// type StatusCode = 200 | 404 | 500

function handleStatus(code: StatusCode) {
    // TypeScript conoce los valores específicos
}

// 13. OPTIONAL CHAINING Y NULLISH COALESCING
interface Config {
    database?: {
        host?: string;
        port?: number;
    };
}

function getHost(config: Config): string {
    return config.database?.host ?? "localhost";
}

// 14. UNKNOWN vs ANY
function processUnknown(value: unknown) {
    if (typeof value === "string") {
        console.log(value.toUpperCase());
    } else if (typeof value === "number") {
        console.log(value.toFixed(2));
    }
}

// 15. NEVER TYPE - Para casos imposibles
function assertNever(value: never) {
    throw new Error(`Valor inesperado: ${value}`);
}

function processShape(shape: Shape) {
    switch (shape.kind) {
        case "circle":
            return shape.radius;
        case "square":
            return shape.side;
        case "rectangle":
            return shape.width;
        default:
            assertNever(shape);
    }
}
