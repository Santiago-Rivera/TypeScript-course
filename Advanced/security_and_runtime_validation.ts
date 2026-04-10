// ============================
// SEGURIDAD DE TIPOS Y VALIDACIÓN RUNTIME
// ============================

// 1. VALIDADOR TIPADO
interface Validator<T> {
    validate(value: unknown): value is T;
    parse(value: unknown): T;
}

class StringValidator implements Validator<string> {
    validate(value: unknown): value is string {
        return typeof value === "string";
    }

    parse(value: unknown): string {
        if (!this.validate(value)) {
            throw new TypeError(`Expected string, got ${typeof value}`);
        }
        return value;
    }
}

// 2. ESQUEMA VALIDADOR TIPADO
type SchemaValidator<T> = {
    [K in keyof T]: Validator<T[K]>;
};

class ObjectValidator<T> implements Validator<T> {
    constructor(private schema: SchemaValidator<T>) {}

    validate(value: unknown): value is T {
        if (typeof value !== "object" || value === null) return false;
        const obj = value as Record<string, unknown>;

        for (const key in this.schema) {
            if (!this.schema[key].validate(obj[key])) {
                return false;
            }
        }
        return true;
    }

    parse(value: unknown): T {
        if (!this.validate(value)) {
            throw new TypeError("Object does not match schema");
        }
        return value;
    }
}

// 3. TIPO GUARDADO TIPADO
type TypeGuard<T> = (value: unknown) => value is T;

const isString: TypeGuard<string> = (value): value is string => {
    return typeof value === "string";
};

const isNumber: TypeGuard<number> = (value): value is number => {
    return typeof value === "number";
};

const isArray = <T,>(guard: TypeGuard<T>): TypeGuard<T[]> => {
    return (value): value is T[] => {
        return Array.isArray(value) && value.every(guard);
    };
};

// 4. ASERCIONES TIPADAS
type Assert<T> = (value: unknown, message?: string): asserts value is T;

const assertString: Assert<string> = (value, message = "Expected string") => {
    if (typeof value !== "string") {
        throw new TypeError(message);
    }
};

const assertDefined = <T,>(
    value: T | undefined,
    message = "Value is undefined"
): asserts value is T => {
    if (value === undefined) {
        throw new Error(message);
    }
};

// 5. REFINADOR DE TIPOS
type Refine<T, U extends T> = (value: T) => value is U;

const refineString = <T extends string>(pattern: RegExp): Refine<string, T> => {
    return (value): value is T => pattern.test(value);
};

// 6. DISCRIMINADOR TIPADO
type Discriminator<T> = {
    discriminate(value: unknown): keyof T | null;
};

type UserType = {
    admin: { role: "admin"; permissions: string[] };
    user: { role: "user"; name: string };
};

const userDiscriminator: Discriminator<UserType> = {
    discriminate(value) {
        if (typeof value !== "object" || value === null) return null;
        const obj = value as any;
        if (obj.role === "admin" && Array.isArray(obj.permissions)) {
            return "admin";
        }
        if (obj.role === "user" && typeof obj.name === "string") {
            return "user";
        }
        return null;
    },
};

// 7. PARSEADOR TIPADO
type Parser<T> = {
    parse(input: unknown): { success: true; value: T } | { success: false; error: string };
};

class EmailParser implements Parser<string> {
    parse(input: unknown): { success: true; value: string } | { success: false; error: string } {
        if (typeof input !== "string") {
            return { success: false, error: "Email must be a string" };
        }
        if (!/^[^@]+@[^@]+\.[^@]+$/.test(input)) {
            return { success: false, error: "Invalid email format" };
        }
        return { success: true, value: input };
    }
}

// 8. COERCIONADOR SEGURO
type Coercer<From, To> = {
    coerce(value: From): To | null;
};

class StringToNumberCoercer implements Coercer<string, number> {
    coerce(value: string): number | null {
        const num = Number(value);
        return Number.isNaN(num) ? null : num;
    }
}

// 9. CONSTRUCTOR TIPADO
type Constructor<T> = new (...args: any[]) => T;

type InstanceOf<T> = {
    check(value: unknown): value is T;
};

class InstanceOfChecker<T> implements InstanceOf<T> {
    constructor(private ctor: Constructor<T>) {}

    check(value: unknown): value is T {
        return value instanceof this.ctor;
    }
}

// 10. VALIDADOR COMPOSABLE
class CompositeValidator<T> implements Validator<T> {
    private validators: Array<(value: unknown) => boolean> = [];

    addValidator(validator: (value: unknown) => boolean): this {
        this.validators.push(validator);
        return this;
    }

    validate(value: unknown): value is T {
        return this.validators.every(v => v(value));
    }

    parse(value: unknown): T {
        if (!this.validate(value)) {
            throw new TypeError("Validation failed");
        }
        return value as T;
    }
}

// 11. RUNTIME TYPE INFO
type RuntimeType = "string" | "number" | "boolean" | "object" | "array" | "null" | "undefined";

function getRuntimeType(value: unknown): RuntimeType {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value as RuntimeType;
}

// 12. TABLA DE TIPOS TIPADA
type TypeMap = {
    string: string;
    number: number;
    boolean: boolean;
};

type GetType<K extends keyof TypeMap> = TypeMap[K];

// 13. TIPADO CONDICIONAL RUNTIME
type ConditionalType<T> = T extends string ? "string" : T extends number ? "number" : "other";

// 14. TIPADO CON HERENCIAS
abstract class BaseValidator<T> {
    abstract validate(value: unknown): value is T;

    abstract parse(value: unknown): T;

    optional(): Validator<T | undefined> {
        return {
            validate: (v): v is T | undefined => v === undefined || this.validate(v),
            parse: (v) => (v === undefined ? undefined : this.parse(v)),
        };
    }

    nullable(): Validator<T | null> {
        return {
            validate: (v): v is T | null => v === null || this.validate(v),
            parse: (v) => (v === null ? null : this.parse(v)),
        };
    }
}

// 15. NIVEL DE CONFIANZA TIPADO
type Confidence = "high" | "medium" | "low";

type ValidatedValue<T> = {
    value: T;
    confidence: Confidence;
};

// 16. PATRÓN RESULTADO TIPADO
type Result<T, E = Error> = { success: true; value: T } | { success: false; error: E };

const ok = <T,>(value: T): Result<T> => ({ success: true, value });
const err = <E,>(error: E): Result<never, E> => ({ success: false, error });

// 17. TIPADO CON TRACK DE CAMBIOS
type Tracked<T> = {
    value: T;
    isDirty: boolean;
    changed: Set<keyof T>;
};

// 18. TIPADO CON AUTORIZACIÓN
type Authorized<T, Role extends string> = {
    _authorized: Role;
    data: T;
};

const authorize = <T, R extends string>(data: T, role: R): Authorized<T, R> => ({
    _authorized: role,
    data,
});

// 19. TIPADO CON VERSIONADO
type Versioned<T> = {
    version: number;
    data: T;
    timestamp: Date;
};

// 20. TIPADO CON PROVENIENCIA
type Provenance<T> = {
    data: T;
    source: "api" | "database" | "cache" | "user";
    timestamp: Date;
};

// MEJORES PRÁCTICAS PARA SEGURIDAD:
// 1. Validar SIEMPRE en límites de sistema (API, BD, cookies)
// 2. Usar type guards para narrowing de tipos
// 3. No confiar nunca en tipos de TypeScript en runtime
// 4. Implementar validadores para toda entrada externa
// 5. Usar aserciones para garantizar precondiciones
// 6. Crear parsers para transformar datos externos
// 7. Usar discriminadores para uniones complejas
// 8. Implementar logs de validación fallida
// 9. Usar result types en lugar de excepciones
// 10. Documentar qué datos son validados en cada punto

// EJEMPLO COMPLETO:
interface User {
    id: string;
    email: string;
    age: number;
}

const userValidator = new ObjectValidator<User>({
    id: new StringValidator(),
    email: {
        validate: (v): v is string => typeof v === "string" && /^[^@]+@[^@]+\.[^@]+$/.test(v),
        parse: (v) => {
            const sv = new StringValidator();
            const str = sv.parse(v);
            if (!/^[^@]+@[^@]+\.[^@]+$/.test(str)) {
                throw new TypeError("Invalid email");
            }
            return str;
        },
    },
    age: {
        validate: (v): v is number => typeof v === "number" && v >= 0 && v <= 150,
        parse: (v) => {
            const num = typeof v === "number" ? v : Number(v);
            if (Number.isNaN(num) || num < 0 || num > 150) {
                throw new TypeError("Invalid age");
            }
            return num;
        },
    },
});

// Uso seguro:
const data = userValidator.validate(JSON.parse(jsonString)) ? userValidator.parse(JSON.parse(jsonString)) : null;

export {};
