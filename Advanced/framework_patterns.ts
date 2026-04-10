// ============================
// FRAMEWORK PATTERNS Y BEST PRACTICES AVANZADOS
// ============================

// 1. PATRÓN REACT CON TIPOS SEGUROS
type ReactNode = any; // En React: JSX.Element | ReactElement | ReactFragment | string | number | boolean | null | undefined
type ReactComponent<Props = any> = (props: Props) => ReactNode;

type WithChildren<T = {}> = T & { children?: ReactNode };

type ComponentProps<C> = C extends ReactComponent<infer P> ? P : never;

// 2. PATRÓN REDUX TIPADO
type Action<Type extends string = string, Payload = any> = {
    type: Type;
    payload: Payload;
};

type Reducer<State, Action2 extends Action = Action> = (
    state: State,
    action: Action2
) => State;

type DispatchAction<R extends Reducer<any>> = R extends Reducer<any, infer A>
    ? A
    : never;

// 3. PATRÓN EXPRESS TIPADO
type Handler<Path extends string = string> = (
    req: any,
    res: any
) => void | Promise<void>;

type Router = {
    get<P extends string>(path: P, handler: Handler<P>): Router;
    post<P extends string>(path: P, handler: Handler<P>): Router;
    put<P extends string>(path: P, handler: Handler<P>): Router;
    delete<P extends string>(path: P, handler: Handler<P>): Router;
};

// 4. PATRÓN GRAPHQL TIPADO
type GraphQLResolver<Parent = any, Args = any, Return = any> = (
    parent: Parent,
    args: Args,
    context: any
) => Return | Promise<Return>;

type GraphQLSchema<T> = {
    [K in keyof T]: GraphQLResolver<any, any, T[K]>;
};

// 5. PATRÓN STORE GLOBAL TIPADO
type Store<State> = {
    getState(): State;
    setState(state: Partial<State>): void;
    subscribe(listener: (state: State) => void): () => void;
};

function createStore<T>(initialState: T): Store<T> {
    let state = initialState;
    const listeners = new Set<(state: T) => void>();

    return {
        getState: () => state,
        setState: (newState) => {
            state = { ...state, ...newState };
            listeners.forEach(l => l(state));
        },
        subscribe: (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        }
    };
}

// 6. PATRÓN HOOK PERSONALIZADO TIPADO
type UseState<T> = [T, (value: T | ((prev: T) => T)) => void];

type UseEffect<T> = (
    effect: () => void | (() => void),
    deps?: readonly T[]
) => void;

// 7. PATRÓN FORMA TIPADA
type FormField<T> = {
    value: T;
    error?: string;
    touched: boolean;
    onChange: (value: T) => void;
    onBlur: () => void;
    reset: () => void;
};

type Form<T> = {
    [K in keyof T]: FormField<T[K]>;
};

// 8. PATRÓN MODAL TIPADO
type ModalState<T> = {
    isOpen: boolean;
    data?: T;
    open(data?: T): void;
    close(): void;
};

// 9. PATRÓN TABLA TIPADA
type TableColumn<T> = {
    key: keyof T;
    label: string;
    render?: (value: T[keyof T], row: T) => ReactNode;
    sortable?: boolean;
    filterable?: boolean;
};

type TableProps<T> = {
    columns: TableColumn<T>[];
    data: T[];
    onSelect?: (row: T) => void;
};

// 10. PATRÓN FORMULARIO CON VALIDACIÓN
type FormSchema<T> = {
    [K in keyof T]: {
        validate: (value: T[K]) => string | null;
        default: T[K];
    };
};

type FormValues<Schema> = {
    [K in keyof Schema]: Schema[K] extends { default: infer D } ? D : never;
};

// 11. PATRÓN PAGINACIÓN TIPADA
type PaginatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    hasNext: boolean;
};

type PaginationParams = {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};

// 12. PATRÓN API CLIENT TIPADO
type ApiEndpoint<Req = any, Res = any> = {
    request: (data: Req) => Promise<Res>;
    cache?: Map<string, Res>;
};

type ApiClient<T extends Record<string, ApiEndpoint>> = {
    [K in keyof T]: T[K] extends ApiEndpoint<infer Req, infer Res>
        ? (data: Req) => Promise<Res>
        : never;
};

// 13. PATRÓN INTERCEPTOR TIPADO
type Interceptor<T> = {
    request?: (config: T) => T | Promise<T>;
    response?: (response: any) => any | Promise<any>;
    error?: (error: Error) => void | Promise<void>;
};

// 14. PATRÓN CONTEXTO TIPADO
type Context<T> = {
    value: T;
    Provider: (props: { children?: ReactNode; value: T }) => ReactNode;
    useContext(): T;
};

// 15. PATRÓN SELECTOR TIPADO
type Selector<State, Selected> = (state: State) => Selected;

type UseSelector<State> = <Selected>(
    selector: Selector<State, Selected>,
    equalityFn?: (a: Selected, b: Selected) => boolean
) => Selected;

// 16. PATRÓN ACCIÓN TIPADA
type ActionCreator<Payload, Type extends string = string> = (
    payload: Payload
) => Action<Type, Payload>;

// 17. PATRÓN MIDDLEWARE TIPADO
type AsyncThunk<Arg, Return> = (arg: Arg) => Promise<Return>;

// 18. PATRÓN PLUGIN TIPADO
type Plugin<Config, Context> = {
    install(config: Config, context: Context): void;
    name: string;
    version: string;
};

type PluginConfig<P extends Plugin<any, any>> = P extends Plugin<infer C, any>
    ? C
    : never;

// 19. PATRÓN DIRECTIVE/DECORATOR TIPADO
type Directive<Phase extends "compile" | "runtime" = "runtime"> = {
    phase: Phase;
    apply<T>(target: T, ...args: any[]): T;
};

// 20. PATRÓN COMPOSICIÓN AVANZADA
type Compose<T extends readonly Function[]> = T extends [
    infer F extends (...args: any[]) => any,
    ...infer Rest extends Function[]
]
    ? (...args: Parameters<F>) => ReturnType<Compose<Rest>>
    : never;

// MEJORES PRÁCTICAS:
// 1. Siempre tipar PropTypes en React
// 2. Usar tipos genéricos para reutilización de código
// 3. Crear tipos de respuesta de API predefinidos
// 4. Usar discriminadores en uniones de tipos
// 5. Crear tipos de contexto para reducir prop drilling
// 6. Usar tipos genéricos para componentes reutilizables
// 7. Definir esquemas de validación con tipos
// 8. Documentar tipos complejos con comentarios
// 9. Reutilizar tipos en schemas y validadores
// 10. Mantener tipos separados por dominio/módulo

export {};
