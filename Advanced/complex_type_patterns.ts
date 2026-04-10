// ============================
// PATRONES COMPLEJOS DE TIPOS
// ============================

// 1. FINITE STATE MACHINE TYPES
type FSM<T extends string = string> = {
    [state in T]: {
        on: Record<string, T>;
        actions?: Record<string, () => void>;
    };
};

type UserStateMachine = FSM<"idle" | "loading" | "loaded" | "error">;

// 2. TIPOS DE CONFIGURACIÓN JERÁRQUICA
type DeepPartial2<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial2<T[K]> : T[K];
};

type DeepRequired2<T> = {
    [K in keyof T]-?: T[K] extends object ? DeepRequired2<T[K]> : T[K];
};

interface AppConfig {
    database: {
        host: string;
        port: number;
        credentials: {
            username: string;
            password: string;
        };
    };
    server: {
        port: number;
        ssl: boolean;
    };
}

type PartialAppConfig = DeepPartial2<AppConfig>;
type RequiredAppConfig = DeepRequired2<PartialAppConfig>;

// 3. TIPOS DE SERIALIZACIÓN
type Serializable2<T> = {
    toJSON(): string;
    fromJSON(json: string): T;
};

type Portable<T> = T & Serializable2<T>;

// 4. TIPOS DE PLUGIN SYSTEM
type Plugin<Config = any, Context = any> = {
    name: string;
    version: string;
    install(config: Config): void;
    execute(context: Context): any;
};

type PluginRegistry = Map<string, Plugin>;

// 5. TIPOS DE MIDDLEWARE CHAIN
type Middleware<Ctx> = (ctx: Ctx, next: () => Promise<void>) => Promise<void>;

type MiddlewareChain<Ctx> = {
    use(middleware: Middleware<Ctx>): MiddlewareChain<Ctx>;
    execute(ctx: Ctx): Promise<void>;
};

// 6. TIPOS DE VALIDADOR CON ESQUEMA
type ValidatorSchema<T> = {
    [K in keyof T]: (value: unknown) => value is T[K];
};

type SchemaValidator<T> = {
    validate(obj: unknown): obj is T;
    validateField<K extends keyof T>(field: K, value: unknown): value is T[K];
};

// 7. TIPOS DE ORM
type TableColumn<T> = {
    type: T;
    nullable?: boolean;
    default?: T;
    primaryKey?: boolean;
    unique?: boolean;
};

type TableSchema<T> = {
    [K in keyof T]: TableColumn<T[K]>;
};

type Entity<T> = {
    [K in keyof T]-?: T[K];
    id: number;
    createdAt: Date;
    updatedAt: Date;
};

// 8. TIPOS DE QUERY BUILDER
type QueryBuilder2<T, Selected extends keyof T = keyof T> = {
    select<K extends keyof T>(...fields: K[]): QueryBuilder2<T, K>;
    where(condition: Partial<T>): QueryBuilder2<T, Selected>;
    orderBy<K extends keyof T>(field: K, direction: "ASC" | "DESC"): QueryBuilder2<T, Selected>;
    limit(count: number): QueryBuilder2<T, Selected>;
    offset(count: number): QueryBuilder2<T, Selected>;
    build(): Promise<Pick<T, Selected>[]>;
};

// 9. TIPOS DE INYECTOR DE DEPENDENCIAS
type ServiceFactory<T> = () => T;

type ServiceMap = {
    [key: string]: any;
};

type Injector = {
    register<T>(name: string, factory: ServiceFactory<T>): void;
    get<T>(name: string): T;
    has(name: string): boolean;
};

// 10. TIPOS PARA GRÁFICOS DE DEPENDENCIAS
type Dependency = {
    name: string;
    version: string;
    dependencies: Dependency[];
};

type DependencyGraph = {
    addNode(name: string): void;
    addEdge(from: string, to: string): void;
    hasCycle(): boolean;
    topologicalSort(): string[];
};

// 11. TIPOS PARA MÁQUINAS DE ESTADO EXTENDIDAS
type XState<States, Context = any> = {
    initial: States;
    context: Context;
    states: {
        [K in States]: {
            on: Record<string, States>;
            entry?: (ctx: Context) => void;
            exit?: (ctx: Context) => void;
        };
    };
};

// 12. TIPOS PARA STREAMING
type Stream<T> = {
    read(): Promise<T | null>;
    write(data: T): Promise<void>;
    close(): Promise<void>;
};

type TransformStream<In, Out> = {
    transform(data: In): Out;
};

// 13. TIPOS PARA OBSERVABLES
type Observer2<T> = {
    next(value: T): void;
    error(err: Error): void;
    complete(): void;
};

type Observable<T> = {
    subscribe(observer: Partial<Observer2<T>>): Subscription;
};

type Subscription = {
    unsubscribe(): void;
};

// 14. TIPOS DE CONTROLADOR DE ERRORES
type ErrorHandler<T extends Error = Error> = (error: T) => void;

type ErrorBoundary<T extends Error = Error> = {
    handle(error: T): void;
    onError(handler: ErrorHandler<T>): ErrorBoundary<T>;
    reset(): void;
};

// 15. TIPOS PARA CACHING
type CacheStrategy = "LRU" | "LFU" | "FIFO";

type Cache<K, V> = {
    get(key: K): V | null;
    set(key: K, value: V): void;
    has(key: K): boolean;
    delete(key: K): void;
    clear(): void;
    size: number;
};

// 16. TIPOS PARA EJECUCIÓN PARALELA
type Parallel<T extends readonly any[]> = Promise<T>;

async function parallel<T extends readonly any[]>(
    ...tasks: { [K in keyof T]: () => Promise<T[K]> }
): Parallel<T> {
    return Promise.all(tasks.map(t => t())) as any;
}

// 17. TIPOS PARA COMPOSICIÓN DE FUNCIONES
type Pipe<T extends readonly ((x: any) => any)[]> = (x: Parameters<T[0]>[0]) => ReturnType<T extends readonly [...any, infer Last extends (x: any) => any] ? Last : never>;

// 18. TIPOS PARA FUNCIONES RECURSIVAS
type RecursiveFunction<T, U> = (value: T, recurse: RecursiveFunction<T, U>) => U;

// 19. TIPOS PARA PATRONES COMPLEJOS
type Pattern<T> = {
    match<U>(patterns: { [K in keyof T]: (value: T[K]) => U }): U;
};

// 20. TIPOS PARA DATOS ESTRUCTURADOS
type Struct<T> = {
    get<K extends keyof T>(key: K): T[K];
    set<K extends keyof T>(key: K, value: T[K]): void;
    toObject(): T;
};
