// ============================
// DECORATORS - Conceptos Intermedios
// ============================

// Los decoradores son funciones que modifican clases, propiedades, métodos
// Se ejecutan en tiempo de definición
// NOTA: Requiere "experimentalDecorators": true en tsconfig.json

// 1. DECORADOR DE CLASE
function Loggable(constructor: Function) {
    console.log(`Se creó la clase ${constructor.name}`);
}

// @Loggable
// class User {
//     name: string = "John";
// }

// 2. DECORADOR DE MÉTODO
function MethodDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
        console.log(`Llamando a ${propertyKey}`);
        return originalMethod.apply(this, args);
    };
    
    return descriptor;
}

class Calculator {
    // @MethodDecorator
    sum(a: number, b: number): number {
        return a + b;
    }
}

// 3. DECORADOR FACTORY
function Debounce(delay: number) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        let timeoutId: NodeJS.Timeout;
        
        descriptor.value = function(...args: any[]) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => originalMethod.apply(this, args), delay);
        };
        
        return descriptor;
    };
}

class Search {
    // @Debounce(300)
    find(query: string) {
        console.log(`Buscando: ${query}`);
    }
}

// 4. DECORADOR DE COMPOSICIÓN
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
        console.log(`Ejecutando ${propertyKey}`);
        return originalMethod.apply(this, args);
    };
    
    return descriptor;
}

function Timing(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
        const start = performance.now();
        const result = originalMethod.apply(this, args);
        const end = performance.now();
        console.log(`${propertyKey} tardó ${end - start}ms`);
        return result;
    };
    
    return descriptor;
}

class Processor {
    // @Log
    // @Timing
    process(data: string): string {
        return data.toUpperCase();
    }
}

// 5. DECORADOR DE PARÁMETRO (Requiere experimentalDecorators)
function Required(target: any, propertyKey: string, parameterIndex: number) {
    console.log(`Parámetro ${parameterIndex} en ${propertyKey} es requerido`);
}

// 6. DECORADOR PERSONALIZADO
function MemoizeDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cache = new Map();
    
    descriptor.value = function(...args: any[]) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            console.log(`Retornando del cache: ${key}`);
            return cache.get(key);
        }
        
        const result = originalMethod.apply(this, args);
        cache.set(key, result);
        return result;
    };
    
    return descriptor;
}

class ExpensiveCalculations {
    // @MemoizeDecorator
    fibonacci(n: number): number {
        if (n <= 1) return n;
        return this.fibonacci(n - 1) + this.fibonacci(n - 2);
    }
}

// 7. DECORADOR PARA VALIDACIÓN
function Validate(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
        for (let i = 0; i < args.length; i++) {
            if (args[i] === null || args[i] === undefined) {
                throw new Error(`Argumento ${i} no puede ser null/undefined`);
            }
        }
        return originalMethod.apply(this, args);
    };
    
    return descriptor;
}

// 8. DECORADOR PARA AUTORIZACIÓN
function Authorize(role: string) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        
        descriptor.value = function(...args: any[]) {
            const user = (this as any).currentUser;
            if (!user || user.role !== role) {
                throw new Error(`No tienes permisos para ejecutar ${propertyKey}`);
            }
            return originalMethod.apply(this, args);
        };
        
        return descriptor;
    };
}

// NOTAS:
// - Los decoradores son una característica experimental de TypeScript
// - Requieren "experimentalDecorators": true en tsconfig.json
// - Se ejecutan en orden bottom-up
// - Most useful para frameworks como Angular, NestJS, etc.
