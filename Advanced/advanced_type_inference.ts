// ============================
// ADVANCED TYPE INFERENCE
// ============================

// 1. INFERENCIA CON ARRAYS
function inferArray<const T extends readonly unknown[]>(arr: T): T {
    return arr;
}

const tuple = inferArray([1, "hello", true] as const);
// type: readonly [1, "hello", true]

// 2. INFERENCIA CON OBJETOS
function inferObject<const T extends Record<string, any>>(obj: T): T {
    return obj;
}

const obj = inferObject({ a: 1, b: "test" } as const);
// type: { readonly a: 1; readonly b: "test"; }

// 3. INFERENCIA DE TIPOS GENÉRICOS COMPLEJOS
function createFactory<T, U extends (id: T) => any>(factory: U) {
    return (id: T): ReturnType<U> => factory(id);
}

// 4. INFERENCIA CON SOBRECARGAS
function process(value: string): string;
function process(value: number): number;
function process(value: string | number): string | number {
    return typeof value === "string" ? value.toUpperCase() : value * 2;
}

const strResult = process("hello"); // string
const numResult = process(5); // number

// 5. INFERENCIA CON GENERICS ANIDADOS
type Flatten2<T> = T extends Array<infer U> ? Flatten2<U> : T;

type FlatType = Flatten2<[[[string]]]>; // string

// 6. INFERENCIA DE PARÁMETROS
type ExtractParameters<T> = T extends (...args: infer P) => any ? P : never;

function myFunc(a: string, b: number, c: boolean) {
    return "result";
}

type Params = ExtractParameters<typeof myFunc>;
// [a: string, b: number, c: boolean]

// 7. INFERENCIA CON VALORES POR DEFECTO
type WithDefault<T, Default = unknown> = T extends undefined ? Default : T;

type StringOrDefault = WithDefault<string | undefined, "DEFAULT">;
// string | "DEFAULT"

// 8. INFERENCIA DE PROPIEDADES ANIDADAS
type NestedValue<T, K extends string> = K extends `${infer First}.${infer Rest}`
    ? First extends keyof T
        ? NestedValue<T[First] & object, Rest>
        : undefined
    : K extends keyof T
    ? T[K]
    : undefined;

// 9. INFERENCIA DE TIPOS GENÉRICOS LAZOS
type TreeNode<T> = {
    value: T;
    children?: TreeNode<T>[];
};

function createTree<T>(value: T, children?: TreeNode<T>[]): TreeNode<T> {
    return { value, ...(children && { children }) } as TreeNode<T>;
}

const tree = createTree("root", [
    createTree("child1"),
    createTree("child2")
]);

// 10. INFERENCIA CON DISCRIMINADORES
type Cat = { kind: "cat"; meow(): void };
type Dog = { kind: "dog"; bark(): void };
type Parrot = { kind: "parrot"; squawk(): void };

type Animal3 = Cat | Dog | Parrot;

function getAnimalAction<T extends Animal3>(animal: T): T extends { kind: infer K }
    ? K extends "cat"
        ? () => void
        : K extends "dog"
        ? () => void
        : () => void
    : never {
    if (animal.kind === "cat") {
        return (animal as Cat).meow as any;
    } else if (animal.kind === "dog") {
        return (animal as Dog).bark as any;
    } else {
        return (animal as Parrot).squawk as any;
    }
}

// 11. INFERENCIA DE CONTEXTO BIDIRECIONAL
const config: { [key: string]: string | number } = {
    timeout: 5000,
    retries: 3
};

// 12. INFERENCIA DE TIPOS CON TUPLAS VARIÁDICAS
type TupleToUnion<T extends readonly any[]> = T[number];

type NumOrString = TupleToUnion<[number, string, boolean]>;
// number | string | boolean

// 13. INFERENCIA DE ÍNDICES
type IndexOf<T extends readonly any[], E, N extends any[] = []> = T extends readonly [infer First, ...infer Rest]
    ? First extends E
        ? N['length']
        : IndexOf<Rest, E, [...N, any]>
    : -1;

type Index = IndexOf<[string, number, boolean], number>; // 1

// 14. INFERENCIA CON PROMESAS ANIDADAS
type AwaitedDeep<T> = T extends Promise<infer U>
    ? AwaitedDeep<U>
    : T extends { then(onfulfilled: (v: infer U) => any): any }
    ? AwaitedDeep<U>
    : T;

type DeepPromise = AwaitedDeep<Promise<Promise<string>>>;
// string

// 15. INFERENCIA DE TIPO DE CALLBACK
type CallbackParameter<T> = T extends (cb: (arg: infer P) => any) => any ? P : never;

function subscribe(callback: (data: { id: number; name: string }) => void) {
    // Implementation
}

type SubscriptionData = CallbackParameter<typeof subscribe>;
// { id: number; name: string; }

// 16. INFERENCIA CON CONDICIONALES MÚLTIPLES
type Infer<T> = T extends string
    ? "string"
    : T extends number
    ? "number"
    : T extends boolean
    ? "boolean"
    : T extends unknown[]
    ? "array"
    : "other";

type Type1 = Infer<"hello">; // "string"
type Type2 = Infer<42>; // "number"
type Type3 = Infer<[1, 2, 3]>; // "array"

// 17. INFERENCIA DE SOBRECARGA
type Overload<T> = T extends {
    (...args: infer A1): infer R1;
    (...args: infer A2): infer R2;
}
    ? [A1, R1] | [A2, R2]
    : T extends (...args: infer A) => infer R
    ? [A, R]
    : never;

// 18. INFERENCIA LAZY
type Lazy<T> = T extends () => infer U ? U : T;

type LazyType = Lazy<() => string>; // string

// 19. INFERENCIA DE PROPIEDADES OPCIONALES
type OptionalKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

interface Options2 {
    required: string;
    optional?: number;
}

type OptionalProps = OptionalKeys<Options2>; // "optional"

// 20. INFERENCIA DE TIPOS COMPLEJOS CON RECURSIÓN
type DeepKeys<T, Prefix extends string = ""> = {
    [K in keyof T]: K extends string
        ? T[K] extends object
            ? DeepKeys<T[K], `${Prefix}${Prefix extends "" ? "" : "."}${K}`>
            : `${Prefix}${Prefix extends "" ? "" : "."}${K}`
        : never;
}[keyof T];

type UserType = {
    name: string;
    profile: {
        age: number;
        email: string;
    };
};

type AllKeys = DeepKeys<UserType>;
// "name" | "profile.age" | "profile.email"
