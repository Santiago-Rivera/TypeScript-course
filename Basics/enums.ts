// Enums

enum Direction {
    Up,
    Down,
    Left,
    Right
}

let dir: Direction = Direction.Up;
console.log(`Dirección: ${Direction[dir]}`); // Output: Dirección: Up

enum Color {
    Red = 1,
    Green,
    Blue
}

let color: Color = Color.Green;
console.log(`Color: ${Color[color]}`); // Output: Color: Green

enum Status {
    Active = "ACTIVE",
    Inactive = "INACTIVE",
    Pending = "PENDING"
}

let status: Status = Status.Active;
console.log(`Status: ${status}`); // Output: Status: ACTIVE