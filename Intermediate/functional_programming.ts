// ============================
// PROGRAMACIÓN FUNCIONAL AVANZADA
// ============================

// 1. HIGHER-ORDER FUNCTIONS - Funciones que aceptan o retornan funciones
function times(factor: number) {
    return (number: number) => number * factor;
}

const double = times(2);
const triple = times(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// 2. FUNCTION COMPOSITION - Combinar funciones
function compose<A, B, C>(
    f: (a: A) => B,
    g: (b: B) => C
): (a: A) => C {
    return (a) => g(f(a));
}

const addOne = (n: number) => n + 1;
const double2 = (n: number) => n * 2;

const addOneThenDouble = compose(addOne, double2);
console.log(addOneThenDouble(5)); // (5 + 1) * 2 = 12

// 3. FUNCTION COMPOSITION CON MÚLTIPLES FUNCIONES
function pipe<T>(...fns: Array<(arg: T) => T>) {
    return (value: T) => fns.reduce((acc, fn) => fn(acc), value);
}

const processNumber = pipe(
    (n: number) => n + 1,
    (n: number) => n * 2,
    (n: number) => n - 3
);

console.log(processNumber(5)); // ((5 + 1) * 2) - 3 = 9

// 4. CURRYING - Convertir función con múltiples argumentos en serie de funciones
function add(a: number) {
    return (b: number) => {
        return (c: number) => a + b + c;
    };
}

const add5 = add(5);
const add5and3 = add5(3);
const result = add5and3(2); // 10

// También se puede usar directamente:
console.log(add(5)(3)(2)); // 10

// 5. CURRYING GENÉRICO
function curry<T extends (...args: any[]) => any>(fn: T): any {
    const arity = fn.length;
    
    return function curried(...args: any[]) {
        if (args.length >= arity) {
            return fn(...args);
        } else {
            return (...moreArgs: any[]) => curried(...args, ...moreArgs);
        }
    };
}

const sum = (a: number, b: number, c: number) => a + b + c;
const curriedSum = curry(sum);

// Se puede usar de varias formas:
console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6
console.log(curriedSum(1)(2, 3)); // 6

// 6. PARTIAL APPLICATION - Fijar algunos argumentos
function partial<T extends (...args: any[]) => any>(
    fn: T,
    ...args: any[]
): (...rest: any[]) => any {
    return (...rest) => fn(...args, ...rest);
}

const multiply = (a: number, b: number, c: number) => a * b * c;
const multiplyBy2 = partial(multiply, 2);

console.log(multiplyBy2(3, 4)); // 2 * 3 * 4 = 24

// 7. MEMOIZATION - Cachear resultados de funciones
function memoize<Args extends any[], Return>(
    fn: (...args: Args) => Return
): (...args: Args) => Return {
    const cache = new Map<string, Return>();
    
    return (...args: Args) => {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            return cache.get(key)!;
        }
        
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
}

const fibonacci = memoize((n: number): number => {
    console.log(`Calculando fibonacci(${n})`);
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(5)); // Calcula solo una vez cada valor

// 8. REDUCER - Procesar arrays con acumulador
type Reducer<State, Action> = (state: State, action: Action) => State;

interface CounterState {
    count: number;
}

type CounterAction = 
    | { type: "INCREMENT"; payload?: number }
    | { type: "DECREMENT"; payload?: number }
    | { type: "RESET" };

const counterReducer: Reducer<CounterState, CounterAction> = (state, action) => {
    switch (action.type) {
        case "INCREMENT":
            return { count: state.count + (action.payload ?? 1) };
        case "DECREMENT":
            return { count: state.count - (action.payload ?? 1) };
        case "RESET":
            return { count: 0 };
    }
};

// 9. ARRAY REDUCE AVANZADO
const numbers = [1, 2, 3, 4, 5];
const sum2 = numbers.reduce((acc, num) => acc + num, 0);

// Group by
const grouped = [1, 2, 3, 4, 5, 6].reduce((acc: Record<number, number[]>, num) => {
    const key = num % 2; // 0 o 1
    if (!acc[key]) acc[key] = [];
    acc[key].push(num);
    return acc;
}, {});

// 10. FILTER + MAP + REDUCE PIPELINE
const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 17 },
    { name: "Charlie", age: 30 }
];

const averageAgeOfAdults = users
    .filter(user => user.age >= 18)
    .map(user => user.age)
    .reduce((sum, age, _, arr) => sum + age / arr.length, 0);

console.log(averageAgeOfAdults); // Promedio de edades de mayores de 18

// 11. DEBOUNCE FUNCTION
function debounce<T extends (...args: any[]) => any>(
    fn: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null;
    
    return (...args: Parameters<T>) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn(...args);
            timeoutId = null;
        }, wait);
    };
}

// 12. THROTTLE FUNCTION
function throttle<T extends (...args: any[]) => any>(
    fn: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle = false;
    
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

// 13. MONAD PATTERN
class Box<T> {
    constructor(private value: T) {}
    
    static of<U>(value: U): Box<U> {
        return new Box(value);
    }
    
    map<U>(fn: (value: T) => U): Box<U> {
        return Box.of(fn(this.value));
    }
    
    flatMap<U>(fn: (value: T) => Box<U>): Box<U> {
        return fn(this.value);
    }
    
    fold<U>(fn: (value: T) => U): U {
        return fn(this.value);
    }
}

const boxedValue = Box.of(5)
    .map(x => x * 2)
    .map(x => x + 1)
    .fold(x => x.toString());

console.log(boxedValue); // "11"
