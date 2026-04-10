// ============================
// ERROR HANDLING Y VALIDACIÓN
// ============================

// 1. CUSTOM ERROR CLASSES
class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

class DatabaseError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = "DatabaseError";
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}

// 2. RESULT TYPE
type Result<T, E = Error> = 
    | { success: true; value: T }
    | { success: false; error: E };

function safeDivide(a: number, b: number): Result<number> {
    if (b === 0) {
        return {
            success: false,
            error: new Error("Cannot divide by zero")
        };
    }
    return { success: true, value: a / b };
}

const resultDiv = safeDivide(10, 2);
if (resultDiv.success) {
    console.log(resultDiv.value);
}

// 3. OPTION/MAYBE PATTERN
type Option<T> = { kind: "some"; value: T } | { kind: "none" };

function parseNumber(input: string): Option<number> {
    const num = parseInt(input);
    return isNaN(num) ? { kind: "none" } : { kind: "some", value: num };
}

function getOrElse<T>(option: Option<T>, defaultValue: T): T {
    return option.kind === "some" ? option.value : defaultValue;
}

const num = parseNumber("42");
console.log(getOrElse(num, 0));

// 4. VALIDATION SCHEMA
interface ValidationRule {
    validate: (value: unknown) => string | null;
}

const emailRule: ValidationRule = {
    validate: (value: unknown) => {
        if (typeof value !== "string") return "Must be a string";
        if (!value.includes("@")) return "Must contain @";
        return null;
    }
};

const ageRule: ValidationRule = {
    validate: (value: unknown) => {
        if (typeof value !== "number") return "Must be a number";
        if (value < 0 || value > 150) return "Must be between 0 and 150";
        return null;
    }
};

type Schema<T> = {
    [K in keyof T]: ValidationRule;
};

function validate<T extends object>(
    data: Partial<T>,
    schema: Schema<T>
): { valid: true } | { valid: false; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    
    for (const key in schema) {
        const rule = schema[key as keyof T];
        const error = rule.validate((data as any)[key]);
        if (error) {
            errors[key] = error;
        }
    }
    
    if (Object.keys(errors).length === 0) {
        return { valid: true };
    }
    
    return { valid: false, errors };
}

const userSchema: Schema<{ email: string; age: number }> = {
    email: emailRule,
    age: ageRule
};

const validation = validate({ email: "test@example.com", age: 25 }, userSchema);

// 5. ASSERT FUNCTION
function assert(condition: boolean, message: string): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

function processUser(user: { name?: string } | null) {
    assert(user !== null, "User must not be null");
    assert(user.name !== undefined, "User must have a name");
    console.log(user.name.toUpperCase());
}

// 6. ASYNC RESULT TYPE
type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

async function getUserAsync(id: number): AsyncResult<{ id: number; name: string }> {
    if (id < 0) {
        return { success: false, error: new ValidationError("Invalid ID") };
    }
    return { success: true, value: { id, name: "John" } };
}

// 7. RESULT CHAINING HELPER
function flatMap<T, U, E>(
    result: Result<T, E>,
    fn: (value: T) => Result<U, E>
): Result<U, E> {
    if (result.success) {
        return fn(result.value);
    }
    return result;
}

function map<T, U, E>(
    result: Result<T, E>,
    fn: (value: T) => U
): Result<U, E> {
    if (result.success) {
        return { success: true, value: fn(result.value) };
    }
    return result;
}

// 8. ERROR RECOVERY CON RETRY
async function fetchWithRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3
): Promise<T> {
    let lastError: Error | null = null;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    }
    
    throw lastError ?? new Error("Unknown error");
}

// 9. TRY MONAD
class Try<T> {
    private constructor(private result: Result<T>) {}
    
    static of<U>(fn: () => U): Try<U> {
        try {
            return new Try({ success: true, value: fn() });
        } catch (error) {
            return new Try({
                success: false,
                error: error instanceof Error ? error : new Error(String(error))
            });
        }
    }
    
    map<U>(fn: (value: T) => U): Try<U> {
        if (this.result.success) {
            return Try.of(() => fn((this.result as any).value));
        }
        return new Try(this.result as any);
    }
    
    flatMap<U>(fn: (value: T) => Try<U>): Try<U> {
        if (this.result.success) {
            return fn(this.result.value);
        }
        return new Try(this.result as any);
    }
    
    getOrElse(defaultValue: T): T {
        return this.result.success ? this.result.value : defaultValue;
    }
    
    fold<U>(onError: (error: Error) => U, onSuccess: (value: T) => U): U {
        return this.result.success 
            ? onSuccess(this.result.value)
            : onError(this.result.error);
    }
}

const tryResult = Try.of(() => parseInt("42"))
    .map(x => x * 2)
    .map(x => x + 1)
    .fold(
        error => `Error: ${error.message}`,
        value => `Success: ${value}`
    );
