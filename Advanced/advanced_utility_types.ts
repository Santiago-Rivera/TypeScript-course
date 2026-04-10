// ============================
// ADVANCED UTILITY TYPES
// ============================

// 1. DEEP PARTIAL
type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

interface Config {
    server: {
        port: number;
        host: string;
        ssl: {
            enabled: boolean;
        };
    };
}

type PartialConfig = DeepPartial<Config>;

// 2. REQUIRED ANIDADO
type DeepRequired<T> = {
    [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};

// 3. READONLY CONDICIONAL
type ConditionalReadonly<T, K extends keyof T> = {
    readonly [P in K]: T[P];
} & {
    [P in Exclude<keyof T, K>]: T[P];
};

// 4. VALOR POR DEFECTO EN TIPOS
type WithDefaults<T, D> = {
    [K in keyof T]: K extends keyof D ? D[K] : T[K];
};

type Options = {
    timeout: number;
    retries: number;
    verbose: boolean;
};

type DefaultOptions = WithDefaults<
    Options,
    { timeout: 5000; retries: 3 }
>;

// 5. KEYS CON TIPOS ESPECÍFICOS
type KeysOfType<T, U> = {
    [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

type StringKeys = KeysOfType<{ name: string; age: number; email: string }, string>;
// "name" | "email"

type NumberKeys = KeysOfType<{ name: string; age: number; count: number }, number>;
// "age" | "count"

// 6. REMOVER FUNCIONES DE UN TIPO
type RemoveFunctions<T> = {
    [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

interface User {
    name: string;
    age: number;
    greet(): void;
    getId(): number;
}

type UserWithoutMethods = RemoveFunctions<User>;
// { name: string; age: number; }

// 7. HACER PROPIEDADES OPCIONALES/REQUERIDAS SELECTIVAMENTE
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
}

type ProductWithOptionalPrice = PartialBy<Product, "price">;
type ProductWithRequiredDescription = RequiredBy<Product, "description">;

// 8. TIPO DE PROMESA ANIDADA
type Awaited<T> = T extends Promise<infer U>
    ? U extends Promise<any>
        ? Awaited<U>
        : U
    : T;

type PromiseValue = Awaited<Promise<Promise<string>>>; // string

// 9. TIPO DE FUNCIÓN CON ARGUMENTOS TIPADOS
type Callable<Args extends any[], Return> = (...args: Args) => Return;

type MyFunction = Callable<[string, number], boolean>;
const fn: MyFunction = (s, n) => s.length > n;

// 10. EXTRAER PARÁMETROS DE CONSTRUCTOR
type ConstructorParams<T> = T extends { new(...args: infer P): any } ? P : never;

class MyClass {
    constructor(name: string, age: number) {}
}

type MyClassParams = ConstructorParams<typeof MyClass>;
// [name: string, age: number]

// 11. TIPO DE INSTANCIA
type InstanceType<T> = T extends { new(...args: any[]): infer U } ? U : never;

type MyInstance = InstanceType<typeof MyClass>;
// MyClass

// 12. VALORES A TIPOS
const roles = ["admin", "user", "guest"] as const;
type Role = typeof roles[number]; // "admin" | "user" | "guest"

// 13. TIPO DE ENUM
enum Status {
    Active = "ACTIVE",
    Inactive = "INACTIVE",
    Pending = "PENDING"
}

type StatusType = keyof typeof Status; // "Active" | "Inactive" | "Pending"

// 14. TIPO DE OBJETO MUTABLE A INMUTABLE
type Readonly2<T> = {
    readonly [K in keyof T]: T[K] extends object ? Readonly2<T[K]> : T[K];
};

// 15. TIPO DE PROPIEDADES PÚBLICAS
type PublicKeys<T> = {
    [K in keyof T]: string extends K ? never : K;
}[keyof T];

class Rectangle {
    public width: number;
    public height: number;
    private color: string;

    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;
        this.color = "black";
    }
}

type RectKeys = PublicKeys<Rectangle>;
// "width" | "height"

// 16. TIPO DE ARRAY TUPLA A OBJETO
type TupleToObject3<T extends readonly (string | number)[]> = {
    [K in T[number]]: K;
};

type Tuple = ["foo", "bar", 123];
type TupleObj = TupleToObject3<Tuple>;
// { foo: "foo"; bar: "bar"; 123: 123; }

// 17. TIPO DE CLAVE-VALOR GENÉRICO
type KeyValue<K extends string | number | symbol, V> = {
    key: K;
    value: V;
};

type User2 = KeyValue<"userId", number>;
// { key: "userId"; value: number; }

// 18. TIPO DE FILTRO CONDICIONAL
type FilterBy<T, U> = T extends U ? T : never;

type StringsOnly = FilterBy<string | number | boolean, string>;
// string

// 19. TIPO DEFINITIVAMENTE ASIGNADO
type NonNullableProperties<T> = {
    [K in keyof T]-?: Exclude<T[K], null | undefined>;
};

// 20. TIPO DE PROMESA VALIDADA
type ValidatedPromise<T> = Promise<{ success: true; value: T } | { success: false; error: Error }>;

async function safeOperation<T>(
    fn: () => Promise<T>
): ValidatedPromise<T> {
    try {
        const value = await fn();
        return { success: true, value };
    } catch (error) {
        return { success: false, error: error as Error };
    }
}
