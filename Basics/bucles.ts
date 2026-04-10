// Bucles

const numbers: number[] = [1, 2, 3, 4, 5];

// For
for (let i = 0; i < numbers.length; i++) {
    console.log(numbers[i]);
}

// For...of
for (const number of numbers) {
    console.log(number);
}

// For...in
for (const index in numbers) {
    console.log(numbers[index]);
}

// While
let j = 0;
while (j < numbers.length) {
    console.log(numbers[j]);
    j++;
}

// Do...while
let k = 0;
do {
    console.log(numbers[k]);
    k++;
} while (k < numbers.length);