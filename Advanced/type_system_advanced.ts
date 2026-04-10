// ============================
// TIPOS ESTRUCTURA AVANZADOS Y TYPE SYSTEM
// ============================

// 1. RECURSIÓN DE TIPOS
type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

interface User {
    name: string;
    address: {
        city: string;
        country: string;
    };
}

type DeepReadonlyUser = DeepReadonly<User>;
// Resultado: todas las propiedades son readonly recursivamente

// 2. TIPOS COMPLEJOS CON RECURSIÓN
type JsonValue = 
    | string 
    | number 
    | boolean 
    | null 
    | JsonValue[] 
    | { [key: string]: JsonValue };

function parseJson<T extends JsonValue>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

// 3. ÍNDICES TIPEADOS AVANZADOS
type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Setters<T> = {
    [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

interface Person {
    name: string;
    age: number;
}

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number; }

type PersonSetters = Setters<Person>;
// { setName: (value: string) => void; setAge: (value: number) => void; }

// 4. TIPOS PREDICADOS AVANZADOS
function isOfType<T>(obj: unknown, check: (v: unknown) => v is T): obj is T {
    return check(obj);
}

const isString = (v: unknown): v is string => typeof v === "string";
const value: unknown = "hello";

if (isOfType(value, isString)) {
    console.log(value.toUpperCase());
}

// 5. TIPOS GENÉRICOS CON RESTRICCIONES ESTRICTAS
type ArrayElement<T> = T extends (infer U)[] ? U : never;
type StringArray = ArrayElement<string[]>; // string
type NumberArray = ArrayElement<number[]>; // number

// 6. TIPOS DE PROFUNDIDAD ANIDADA
type Depth<T, N extends any[] = []> = T extends { [key: string]: infer U }
    ? Depth<U, [...N, any]>
    : N['length'];

type ShallowDepth = Depth<{ a: string }>;
type DeepDepth = Depth<{ a: { b: { c: string } } }>;

// 7. TIPOS CON TRANSFORMACIÓN
type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

// Útil para simplificar tipos intersectados
type Merged = Prettify<{ a: string } & { b: number }>;
// { a: string; b: number; }

// 8. TIPOS DE TRANSFORMACIÓN DE CLAVES
type snake_case<S extends string> = S extends `${infer T}${infer U}`
    ? `${T extends Uppercase<T> ? "_" : ""}${Lowercase<T>}${snake_case<U>}`
    : S;

type SnakeCaseKeys<T> = {
    [K in keyof T as snake_case<string & K>]: T[K];
};

type CamelCaseUser = {
    firstName: string;
    lastName: string;
};

type SnakeCaseUser = SnakeCaseKeys<CamelCaseUser>;
// { first_name: string; last_name: string; }

// 9. TIPOS DE VALIDACIÓN EN TIEMPO DE COMPILACIÓN
type ValidateEmail<S extends string> = S extends `${string}@${string}.${string}`
    ? S
    : never;

type Email1 = ValidateEmail<"test@example.com">; // OK
// type Email2 = ValidateEmail<"invalid">; // Error

// 10. TIPOS DISTRIBUTIVOS AVANZADOS
type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;

type FlatArray1 = Flatten<[1, [2, [3, 4]]]>; // 1 | 2 | 3 | 4
type FlatArray2 = Flatten<string[]>; // string

// 11. TIPOS DE COMPOSICIÓN
type Compose<T extends readonly ((...args: any) => any)[]> = T extends readonly [
  infer F extends (...args: any) => any,
  ...infer Rest extends ((...args: any) => any)[]
]
    ? (args: Parameters<F>) => ReturnType<Compose<Rest>>
    : never;

// 12. TIPOS DE BUILDER PATTERN
type Builder<T, Built = {}> = {
    [K in keyof T]: (value: T[K]) => Builder<Omit<T, K>, Built & { [P in K]: T[K] }>;
} & {
    build(): Built & T;
};

// 13. TIPOS CON CONTRAINTES EN UNIONES
type Without<T, U> = T extends U ? never : T;

type StringOrNumber = string | number | boolean;
type OnlyStringOrNumber = Without<StringOrNumber, boolean>;
// string | number

// 14. TIPOS DE ACCESO A PROPIEDADES ANIDADAS
type DeepPath<T, P extends string> = P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
        ? DeepPath<T[K], Rest>
        : never
    : P extends keyof T
    ? T[P]
    : never;

type UserData = {
    profile: {
        address: {
            city: string;
        };
    };
};

type CityType = DeepPath<UserData, "profile.address.city">; // string

// 15. TIPOS DE BRANCHING AVANZADOS
type Branch<T, U, V> = T extends true ? U : V;

type IsString<T> = T extends string ? true : false;
type StringCheck = Branch<IsString<"hello">, "YES", "NO">; // "YES"
