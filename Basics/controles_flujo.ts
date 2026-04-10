// Controles de flujo

// If-else

let age: number = 20;

if (age < 18) {
    console.log("Eres menor de edad");
} else if (age >= 18 && age < 65) {
    console.log("Eres adulto");
} else {
    console.log("Eres adulto mayor");
}

// Switch

let day: number = 3;

switch (day) {
    case 1:
        console.log("Lunes");
        break;
    case 2:
        console.log("Martes");
        break;
    case 3:
        console.log("Miércoles");
        break;
    case 4:
        console.log("Jueves");
        break;
    case 5:
        console.log("Viernes");
        break;
    case 6:
        console.log("Sábado");
        break;
    case 7:
        console.log("Domingo");
        break;
    default:
        console.log("Día no válido");
        break;
}
