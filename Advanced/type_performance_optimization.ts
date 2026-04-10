// ============================
// PERFORMANCE Y OPTIMIZACIÓN DE TIPOS
// ============================

// 1. LAZY EVALUATION DE TIPOS
type Lazy<T> = () => T;

type LazyEvaluator<T> = Lazy<T> & {
    evaluate(): T;
};

// 2. MEMOIZACIÓN DE TIPOS
type Memoize<T extends Function> = T & {
    cache: WeakMap<any, any>;
};

// 3. ÍNDICES DISTRIBUIDOS OPTIMIZADOS
type KeysOf<T> = {
    [K in keyof T]: K;
}[keyof T];

// 4. TIPOS CONDICIONALES ENCADENADOS (evitar)
// ❌ LENTO:
type SlowCondition<T> = T extends string 
    ? "string" 
    : T extends number 
    ? "number" 
    : T extends boolean 
    ? "boolean" 
    : "other";

// ✅ RÁPIDO - Usar discriminadores:
type FastConditionMap = {
    string: "string";
    number: "number";
    boolean: "boolean";
    other: "other";
};

// 5. EVITAR RECURSIÓN INFINITA
type SafeRecursion<T, Depth extends number = 0> = 
    Depth extends 10 ? T : 
    T extends Array<infer U> ? SafeRecursion<U, [Depth, number][0]> : 
    T;

// 6. TIPOS PRIMITIVOS ESPECIALIZADOS
type Opaque2<T, K> = T & { readonly __opaque: K };

// Especializar para tipos primitivos
type UserId2 = Opaque2<number, "UserId">;
type ProductId = Opaque2<number, "ProductId">;

// 7. UNIONES MANTENIBLES
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type HttpStatus = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 500;

// 8. TIPOS GENÉRICOS CON RESTRICCIONES EXHAUSTIVAS
type Constrain<T, U extends T> = U;

type ValidConfig = Constrain<any, {
    timeout: number;
    retries: number;
}>;

// 9. FUNCIONES SOBRECARGADAS ORGANIZADAS
function process3(value: string): string;
function process3(value: number): number;
function process3(value: boolean): boolean;
function process3(value: string | number | boolean): string | number | boolean {
    if (typeof value === "string") return value.toUpperCase();
    if (typeof value === "number") return value * 2;
    return !value;
}

// 10. TIPOS COMPLEJOS DESCOMPUESTOS
type Request2 = {
    method: HttpMethod;
    url: string;
    headers: Record<string, string>;
};

type Response2 = {
    status: HttpStatus;
    body: unknown;
    headers: Record<string, string>;
};

// 11. EVITAR TIPOS DEMASIADO GENERALES
// ❌ MALO: any tipo de dato
// type AnyData = any;

// ✅ BUENO: Genérico bien restringido
type Data<T = unknown> = {
    value: T;
    timestamp: number;
};

// 12. MAPEOS INVERSOS EFICIENTES
type InvertMap<T extends Record<string, string>> = {
    [K in T[keyof T]]: {
        [P in keyof T]: T[P] extends K ? P : never;
    }[keyof T];
};

// 13. TIPOS PARA VALIDACIÓN EN COMPILACIÓN
type AssertExtends<T, U extends T> = true;

// Ejemplo con tipo genérico
type BaseEntity<T = {}> = { id: number } & T;
type Check = AssertExtends<BaseEntity<any>, { id: number }>;

// 14. CACHÉ DE TIPOS CON SOBRECARGA
type Cache2<K, V> = {
    cached: Map<K, V>;
    get(key: K): V | undefined;
    set(key: K, value: V): void;
};

// 15. TIPOS PARA API SEGURA
type SafeAPI = {
    get<T>(url: string): Promise<T>;
    post<T, D>(url: string, data: D): Promise<T>;
    put<T, D>(url: string, data: D): Promise<T>;
    delete<T>(url: string): Promise<T>;
};

// 16. TIPOS RECURSIVOS CON LÍMITE
type DeepOmit<T, K extends string, Depth extends number = 0> = 
    Depth extends 5 ? T :
    {
        [P in keyof T as P extends K ? never : P]: 
        T[P] extends object ? DeepOmit<T[P], K, [Depth, number][0]> : T[P];
    };

// 17. COMPOSICIÓN DE TIPOS PEQUEÑOS
type Name = { name: string };
type Email2 = { email: string };
type Password = { password: string };

type User4 = Name & Email2;
type UserWithPassword = User4 & Password;

// 18. TIPOS PARA PATRONES DE DISEÑO
type Singleton<T> = {
    getInstance(): T;
};

type Factory<T> = {
    create(...args: any[]): T;
};

type Builder3<T> = {
    set<K extends keyof T>(key: K, value: T[K]): Builder3<T>;
    build(): T;
};

// 19. TIPOS PARA TRANSFORMACIÓN SEGURA
type Transform<T, U> = {
    (value: T): U;
};

type ComposedTransform<T, U, V> = (value: T) => V;

// 20. TIPOS PARA TESTING
type TestCase<T = any> = {
    description: string;
    input: T;
    expected: T;
};

type TestSuite<T = any> = {
    name: string;
    tests: TestCase<T>[];
};

type TestRunner = {
    run<T>(suite: TestSuite<T>): void;
};

// RECOMENDACIONES DE PERFORMANCE:
// 1. Evitar tipos demasiado profundamente anidados
// 2. Usar discriminadores en lugar de condicionales complejos
// 3. Cachear tipos complejos que se reutilizan
// 4. Limitar la profundidad de recursión
// 5. Usar intersecciones en lugar de unions cuando sea posible
// 6. Especializar tipos genéricos cuando sea necesario
// 7. Evitar ciclos en definiciones de tipos
// 8. Usar tipos primitivos especializados (branding)
// 9. Mantener interfaces simples y enfocadas
// 10. Documentar tipos complejos con ejemplos

// Ejemplo de optimización:
// ❌ LENTO:
type SlowLookup<T extends Record<string, any>, K extends keyof T> = T extends { [P in K]: infer V } ? V : never;

// ✅ RÁPIDO:
type FastLookup<T extends Record<string, any>, K extends keyof T> = T[K];
