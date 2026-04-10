// ============================
// ADVANCED TYPE NARROWING Y GUARDS
// ============================

// 1. NARROWING CON DISCRIMINADORES COMPLEJOS
type Result2<T, E = Error> = 
    | { status: "success"; data: T }
    | { status: "error"; error: E }
    | { status: "pending" };

function handleResult<T, E>(result: Result2<T, E>): T | null {
    switch (result.status) {
        case "success":
            return result.data;
        case "error":
            throw result.error;
        case "pending":
            return null;
    }
}

// 2. TYPE GUARDS CON VALIDACIÓN COMPLEJA
interface User2 {
    name: string;
    email: string;
}

interface Admin extends User2 {
    permissions: string[];
    role: "admin";
}

function isAdmin(user: User2 | Admin): user is Admin {
    return "permissions" in user && "role" in user && user.role === "admin";
}

// 3. PREDICADOS GENÉRICOS AVANZADOS
function isInstanceOf<T extends { new(...args: any[]): any }>(
    ctor: T,
    obj: unknown
): obj is InstanceType<T> {
    return obj instanceof ctor;
}

class User3 {}
const obj: unknown = new User3();

if (isInstanceOf(User3, obj)) {
    console.log(obj); // Aquí sabemos que es User3
}

// 4. NARROWING CON CONVERSIONES DE TIPO
type Stringifiable = string | { toString(): string };

function narrowToString(value: Stringifiable): value is string {
    return typeof value === "string";
}

function getValue(value: Stringifiable): string {
    if (narrowToString(value)) {
        return value;
    }
    return value.toString();
}

// 5. NARROWING DE ARRAYS
function isTupleOf<T>(arr: any[], guard: (v: any) => v is T): arr is [T] {
    return arr.length === 1 && guard(arr[0]);
}

function isTupleOf32<T>(arr: any[], guard: (v: any) => v is T): arr is [T, T] {
    return arr.length === 2 && guard(arr[0]) && guard(arr[1]);
}

// 6. NARROWING CONDICIONAL
type Narrowed<T, U> = T extends U ? T : never;

function processValue<T>(value: T): Narrowed<T, string> | null {
    if (typeof value === "string") {
        return value as Narrowed<T, string>;
    }
    return null;
}

// 7. NARROWING CON VALIDADORES
type Validator<T> = (value: unknown) => value is T;

const stringValidator: Validator<string> = (v): v is string => typeof v === "string";
const numberValidator: Validator<number> = (v): v is number => typeof v === "number";

function validateArray<T>(items: unknown[], validator: Validator<T>): items is T[] {
    return items.every(validator);
}

// 8. NARROWING DE OBJETOS COMPLEJOS
type ValidUser = User2 & { __valid: true };

function isValidUser(obj: unknown): obj is ValidUser {
    return (
        typeof obj === "object" &&
        obj !== null &&
        "name" in obj &&
        "email" in obj &&
        typeof (obj as any).name === "string" &&
        typeof (obj as any).email === "string" &&
        (obj as any).email.includes("@")
    );
}

// 9. NARROWING EXHAUSTIVO
type ThrowIfFalse<T> = T extends false ? never : T;

function assertIsTrue<T extends boolean>(v: T): ThrowIfFalse<T> {
    if (!v) throw new Error("Expected true");
    return v as any;
}

// 10. NARROWING CON TYPEOF CUSTOMIZADO
function getType(value: unknown): string {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
}

// 11. NARROWING CON PROPIEDADES OPCIONALES
type WithOptional = { a: string; b?: number };

function hasB(obj: WithOptional): obj is WithOptional & { b: number } {
    return "b" in obj && typeof obj.b === "number";
}

// 12. NARROWING NEGATIVO
type NotString = string extends infer T ? Exclude<T, string> : never;

function isNotString(value: unknown): value is NotString {
    return typeof value !== "string";
}

// 13. NARROWING CON REGISTRO DE TIPOS
const typeRegistry = new Map<string, (v: unknown) => boolean>();

typeRegistry.set("user", (v) => typeof v === "object" && v !== null && "name" in v);
typeRegistry.set("string", (v) => typeof v === "string");

function validateType<T extends string>(type: T, value: unknown): value is T {
    return typeRegistry.get(type as string)?.(value) ?? false;
}

// 14. NARROWING CONDICIONAL DISTRIBUIDO
type IsString2<T> = T extends string ? true : string extends T ? "maybe" : false;

type Result3<T> = IsString2<T> extends true ? "definitely string" : "not string";

// 15. NARROWING CON MAPEO
type NarrowMap = {
    string: string;
    number: number;
    boolean: boolean;
    array: unknown[];
};

type Get<K extends keyof NarrowMap> = NarrowMap[K];

function narrowByType<K extends keyof NarrowMap>(type: K, value: unknown): value is Get<K> {
    if (type === "string") return typeof value === "string";
    if (type === "number") return typeof value === "number";
    if (type === "boolean") return typeof value === "boolean";
    if (type === "array") return Array.isArray(value);
    return false;
}

// 16. NARROWING DE VALORES LITERALES
type Literal<T extends string | number | boolean> = T extends any ? T : never;

function isLiteral<T extends string | number | boolean>(
    value: unknown,
    literal: T
): value is T {
    return value === literal;
}

// 17. NARROWING DE UNIONES
type Union = { type: "a"; value: string } | { type: "b"; value: number };

function narrowUnion<T extends Union["type"]>(
    obj: Union,
    type: T
): obj is Union & { type: T } {
    return obj.type === type;
}

// 18. NARROWING CON ERRORES
function assertExists<T>(value: T | null | undefined): asserts value is T {
    if (value == null) {
        throw new Error("Value does not exist");
    }
}

// Uso:
const maybeUser: User2 | null = null;
// assertExists(maybeUser); // Lanza error
// Después del assert, maybeUser es de tipo User2

// 19. NARROWING PARAMETRIZADO
function narrow<T, U extends T>(value: T, check: (v: T) => v is U): value is U {
    return check(value);
}

// 20. NARROWING CON TIPO LITERAL
type TaggedUnion = 
    | { tag: "success"; value: string }
    | { tag: "error"; error: Error }
    | { tag: "loading" };

function isSuccess(obj: TaggedUnion): obj is TaggedUnion & { tag: "success" } {
    return obj.tag === "success";
}

function isError(obj: TaggedUnion): obj is TaggedUnion & { tag: "error" } {
    return obj.tag === "error";
}

function isLoading(obj: TaggedUnion): obj is TaggedUnion & { tag: "loading" } {
    return obj.tag === "loading";
}
