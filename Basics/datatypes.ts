// Tipos de Datos

// Number

let age: number = 30;
let price: number = 19.99;

// String

let name: string = "Juan";
let greeting: string = `Hola, mi nombre es ${name}`;

// Boolean

let isDeveloper: boolean = true;
let isStudent: boolean = false;

// Null y Undefined

let nullValue: null = null;
let undefinedValue: undefined = undefined;

// Simbol

let uniqueIdValue: symbol = Symbol("id");

// BigInt

let bigNumber: bigint = 9007199254740991n;

// Any

let anyValue: any = "Esto puede ser cualquier cosa";
anyValue = 42;
anyValue = true;

console.log(`Edad: ${age}, Precio: ${price}, Nombre: ${name}, Saludo: ${greeting}, Es desarrollador: ${isDeveloper}, Es estudiante: ${isStudent}, Valor nulo: ${nullValue}, Valor indefinido: ${undefinedValue}, Valor cualquiera: ${anyValue}, ID único: ${String(uniqueIdValue)}, Número grande: ${bigNumber}`);