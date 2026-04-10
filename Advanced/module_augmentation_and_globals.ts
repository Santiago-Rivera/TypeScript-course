// ============================
// MODULE AUGMENTATION Y DECLARACIONES GLOBALES
// ============================

// 1. MÓDULO AUGMENTATION
declare module "express" {
    interface Request {
        userId?: number;
        user?: { id: number; name: string };
    }
}

// Ahora puedes usar req.userId en Express

// 2. DECLARACIONES GLOBALES
declare global {
    interface Window {
        myCustomApi: {
            getData(): Promise<any>;
            setData(data: any): void;
        };
    }

    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            API_KEY: string;
            NODE_ENV: "development" | "production" | "test";
        }
    }
}

// Acceso a variables globales con tipo
console.log(process.env.DATABASE_URL);
window.myCustomApi.getData();

// 3. TIPOS NOMINALES (BRANDED TYPES)
type UserId = string & { readonly __brand: "UserId" };
type Email = string & { readonly __brand: "Email" };

function createUserId(value: string): UserId {
    return value as UserId;
}

function createEmail(value: string): Email {
    return value as Email;
}

function getUserById(id: UserId): void {
    console.log(`Getting user ${id}`);
}

// Esto funciona
const userId = createUserId("123");
getUserById(userId);

// Esto NO funciona (compile-time error)
// getUserById("123"); // Error: Type 'string' is not assignable to type 'UserId'

// 4. NOMINALES CON SÍMBOLOS
const EmailBrand = Symbol("Email");
type ValidEmail = string & { [EmailBrand]: true };

function isValidEmail(email: string): email is ValidEmail {
    return email.includes("@");
}

function sendEmail(email: ValidEmail): void {
    console.log(`Sending to ${email}`);
}

// 5. TIPOS PRIVADOS CON SÍMBOLOS
const privateKey = Symbol("private");

type PrivateData = {
    [privateKey]: string;
    publicData: string;
};

// 6. TIPOS DE CONFIGURACIÓN ESTRICTA
type StrictConfig = {
    strict: true;
    allowMissing: false;
    readonly frozen: true;
};

type LooseConfig = {
    strict: false;
    allowMissing: true;
    frozen: false;
};

type Config = StrictConfig | LooseConfig;

// 7. TIPADO FUERTE DE COLECCIONES
type Collection<T, Id extends string | number = string> = Map<Id, T>;

function createCollection<T, Id extends string | number = string>(): Collection<T, Id> {
    return new Map();
}

// 8. TIPOS CON RESTRICCIONES DE COMPATIBILIDAD
type Compatible<A, B> = A extends B ? (B extends A ? true : false) : false;

type IsCompatible = Compatible<string | number, string>;
// false (string no extiende string | number y vice versa no es exacto)

// 9. TIPOS DE VERSIÓN
type Version<Major extends number, Minor extends number = 0, Patch extends number = 0> = 
    `${Major}.${Minor}.${Patch}`;

type V1 = Version<1>; // "1.0.0"
type V2 = Version<2, 5, 3>; // "2.5.3"

// 10. TIPOS SEALED (NO EXTENSIBLES)
type Sealed<T> = T & { readonly __sealed: true };

type SealedUser = Sealed<{ name: string; age: number }>;

// 11. PHANTOM TYPES
type Branded<T, Brand> = T & { readonly __brand: Brand };

type PositiveNumber = Branded<number, "PositiveNumber">;
type NegativeNumber = Branded<number, "NegativeNumber">;

function createPositive(n: number): PositiveNumber {
    if (n <= 0) throw new Error("Not positive");
    return n as PositiveNumber;
}

// 12. TIPOS DE ESTADO MÁQUINA
type State = "idle" | "loading" | "success" | "error";

type ValidTransition = {
    idle: "loading";
    loading: "success" | "error";
    success: "idle";
    error: "idle";
};

type CanTransition<From extends State, To extends State> = 
    To extends ValidTransition[From] ? true : false;

type Test1 = CanTransition<"idle", "loading">; // true
type Test2 = CanTransition<"idle", "success">; // false

// 13. TIPOS DE CONTEXTO CON TIPOS GENÉRICOS
type Context<T> = {
    value: T;
    set(newValue: T): void;
    get(): T;
    reset(): void;
};

function createContext<T>(initialValue: T): Context<T> {
    let value = initialValue;
    return {
        value,
        set(newValue) {
            value = newValue;
        },
        get() {
            return value;
        },
        reset() {
            value = initialValue;
        }
    };
}

// 14. TIPOS OPAQUOS
type Opaque<T, K> = T & { readonly __opaque: K };

type AuthToken = Opaque<string, "AuthToken">;
type RefreshToken = Opaque<string, "RefreshToken">;

// 15. TIPOS DE EFECTO
type Effect<T> = {
    readonly run: () => T;
    readonly chain: <U>(f: (v: T) => Effect<U>) => Effect<U>;
    readonly map: <U>(f: (v: T) => U) => Effect<U>;
};

// 16. TIPOS DE BUILDER GENÉRICO
type BuilderState = {
    fields: Record<string, any>;
    required: Set<string>;
};

type Builder2<T extends BuilderState> = {
    set<K extends string, V>(key: K, value: V): Builder2<T>;
    build(): any;
};

// 17. TIPOS CON VALIDACIÓN
type Validated<T, Rules> = T & { readonly __validated: Rules };

type PositiveInt = Validated<number, { positive: true; integer: true }>;

// 18. TIPOS DE RUTA SEGURA
type SafeRoute = {
    "/" : void;
    "/users" : void;
    "/users/:id" : { id: string };
    "/posts/:id/comments/:commentId" : { id: string; commentId: string };
};

type ExtractParams<Route extends string> = Route extends `${infer _}/:${infer Param}${infer Rest}`
    ? { [K in Param]: string } & ExtractParams<Rest>
    : {};

type UserParams = ExtractParams<"/users/:id">;
// { id: string; }

// 19. TIPOS DE LOGGER CON NIVELES
type LogLevel = "debug" | "info" | "warn" | "error";

type Logger2 = {
    debug: (message: string) => void;
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
};

// 20. TIPOS DE OBSERVACIÓN REACTIVOS
type Reactive<T> = T & {
    onChange(listener: (value: T) => void): void;
    onError(listener: (error: Error) => void): void;
};

export {};
