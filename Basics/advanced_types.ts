// Tipos avanzados

// Union Types

let value: string | number;
value = "Hola";
value = 42;

// Intersection Types

interface A {
    a: string;
}

interface B {
    b: number;
}

type AB = A & B;

let abValue: AB = { a: "Hola", b: 42 };

// Literal Types

type Direction = "up" | "down" | "left" | "right";

let direction: Direction;
direction = "up";
direction = "down";

// Type Aliases

type ID = string | number;

let userId: ID;
userId = "abc123";
userId = 456;

// Nullable Types

let nullableValue: string | null;
nullableValue = "Esto es un string";
nullableValue = null;

console.log(`Valor union: ${value}, Valor intersección: ${JSON.stringify(abValue)}, Dirección: ${direction}, ID de usuario: ${userId}, Valor nullable: ${nullableValue}`);