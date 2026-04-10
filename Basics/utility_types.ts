// Tipos utilitarios

// Partial

interface User {
    id: number;
    name: string;
    email: string;
}

type PartialUser = Partial<User>;

let partialUser: PartialUser = {
    name: "Santiago"
};

// Readonly

type ReadonlyUser = Readonly<User>;

let readonlyUser: ReadonlyUser = {
    id: 1,
    name: "Santiago",
    email: "santiago@example.com"
};

// Pick

type UserNameEmail = Pick<User, "name" | "email">;

let userNameEmail: UserNameEmail = {
    name: "Santiago",
    email: "santiago@example.com"
};

// Omit

type UserWithoutEmail = Omit<User, "email">;

let userWithoutEmail: UserWithoutEmail = {
    id: 1,
    name: "Santiago"
};

console.log(`Partial User: ${JSON.stringify(partialUser)}, Readonly User: ${JSON.stringify(readonlyUser)}, Picked User: ${JSON.stringify(userNameEmail)}, Omitted User: ${JSON.stringify(userWithoutEmail)}`);