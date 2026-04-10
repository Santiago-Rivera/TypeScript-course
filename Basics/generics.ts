// Genericos

function identity<T>(arg: T): T {
    return arg;
}

let output1 = identity<string>("Hola Mundo");
let output2 = identity<number>(42);

console.log(output1);
console.log(output2);