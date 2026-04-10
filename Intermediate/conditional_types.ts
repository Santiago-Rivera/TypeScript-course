// ============================
// TIPOS CONDICIONALES Y MAPPED TYPES
// ============================

// 1. CONDITIONAL TYPES - Tipos basados en condiciones
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<number>; // false

// 2. CONDITIONAL TYPES CON TIPOS COMPLEJOS
type IsArray<T> = T extends any[] ? true : false;

type C = IsArray<number[]>; // true
type D = IsArray<string>; // false

// 3. DISTRIBUTED CONDITIONAL TYPES - Con uniones
type ToArray<T> = T extends any ? T[] : never;

type ArrStr = ToArray<string | number>; // string[] | number[]

// 4. INFERENCIA EN CONDITIONAL TYPES (infer)
type GetArrayType<T> = T extends (infer U)[] ? U : never;

type StrType = GetArrayType<string[]>; // string
type NumType = GetArrayType<number[]>; // number

// 5. MAPPED TYPES - Crear tipos iterando propiedades
type Readonly<T> = {
    readonly [K in keyof T]: T[K];
};

interface User {
    name: string;
    age: number;
}

type ReadonlyUser = Readonly<User>;
// Resultado: { readonly name: string; readonly age: number; }

// 6. MAPPED TYPES CON MODIFICADORES
type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};

type NullableUser = Nullable<User>;
// Resultado: { name: string | null; age: number | null; }

// 7. MAPPED TYPES COMO FUNCIONES
type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// Resultado: { getName: () => string; getAge: () => number; }

// 8. TEMPLATE LITERAL TYPES - Tipos con strings dinámicos
type EventName = `on${"Click" | "Hover" | "Focus"}`;
// "onClick" | "onHover" | "onFocus"

// 9. TEMPLATE LITERAL CON MAPPED TYPES
type Handlers<E extends Record<string, any>> = {
    [K in keyof E as `on${Capitalize<string & K>}`]: (event: E[K]) => void;
};

type Events = { click: Event; focus: Event };
type EventHandlers = Handlers<Events>;
// Resultado: { onClick: (event: Event) => void; onFocus: (event: Event) => void; }

// 10. AS CONST - Hacer tipos más específicos
const colors = {
    red: "#FF0000",
    blue: "#0000FF"
} as const;

type ColorType = typeof colors;
// Resultado: { readonly red: "#FF0000"; readonly blue: "#0000FF"; }

// 11. UTILITY TYPES POPULARES - Advance with built-in types

// Partial<T> - Todas las propiedades opcionales
type PartialUser = Partial<User>;
// { name?: string; age?: number; }

// Required<T> - Todas las propiedades requeridas
type RequiredUser = Required<Partial<User>>;
// { name: string; age: number; }

// Pick<T, K> - Seleccionar propiedades específicas
type UserPreview = Pick<User, "name">;
// { name: string; }

// Omit<T, K> - Excluir propiedades específicas
type UserWithoutAge = Omit<User, "age">;
// { name: string; }

// Record<K, T> - Crear objeto con llaves y tipo de valor
type Roles = Record<"admin" | "user" | "guest", boolean>;
// { admin: boolean; user: boolean; guest: boolean; }

// Extract<T, U> - Extraer tipos de unión que coinciden
type StringOrNumber = string | number | boolean;
type OnlyString = Extract<StringOrNumber, string>; // string

// Exclude<T, U> - Excluir tipos de unión
type WithoutString = Exclude<StringOrNumber, string>; // number | boolean

// NonNullable<T> - Remover null y undefined
type NonNull = NonNullable<string | null | undefined>; // string

// Returns<T> - Extraer tipo de retorno
type MyFunction = (x: number) => string;
type MyReturnType = ReturnType<MyFunction>; // string

// 12. ADVANCED CONDITIONAL TYPES
type Flatten<T> = T extends any[] ? Flatten<T[0]> : T;

type Nested = Flatten<[[["hello"]]]>; // string

// 13. TYPE PREDICATES
function isString(value: unknown): value is string {
    return typeof value === "string";
}

function processValue(value: unknown) {
    if (isString(value)) {
        // Aquí TypeScript sabe que 'value' es string
        console.log(value.toUpperCase());
    }
}

// 14. GENERIC CONSTRAINTS CON CONDITIONAL TYPES
type HasEmail<T> = T extends { email: string } ? T : never;

type UserWithEmail = HasEmail<User & { email: string }>;
