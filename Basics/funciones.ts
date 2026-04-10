// Funciones

function greet(name: string): string {
    return `Hola, ${name}!`;
}

function add(a: number, b: number): number {
    return a + b;
}

function logMessage(message: string): void {
    console.log(`Mensaje: ${message}`);
}

const greetingMessage = greet("Santiago");
const sum = add(5, 10);
logMessage("Esta es una función que no devuelve nada.");

console.log(greetingMessage);
console.log(`La suma es: ${sum}`);