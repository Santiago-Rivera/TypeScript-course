// Export

export const PI = 3.14159;

export function sumar(a: number, b: number): number {
    return a + b;
}

export class Persona {
    constructor(public nombre: string, public edad: number) {}
}

export interface Producto {
    id: number;
    nombre: string;
    precio: number;
}

export type ID = number | string;

console.log(PI);
console.log(sumar(5, 10));
console.log(new Persona("Juan", 30));
console.log({ id: 1, nombre: "Producto 1", precio: 100 });
console.log("ID: " + (42 as ID));