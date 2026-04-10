// ============================
// ASYNC/AWAIT Y PROMISES
// ============================

// 1. PROMESAS BÁSICAS
const promise1 = new Promise<string>((resolve, reject) => {
    setTimeout(() => {
        resolve("Éxito!");
    }, 1000);
});

// 2. ASYNC FUNCTION
async function fetchUser(id: number): Promise<{ id: number; name: string }> {
    // Simular una llamada API
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ id, name: "John Doe" });
        }, 1000);
    });
}

// 3. AWAIT
async function getAndPrintUser(id: number) {
    try {
        const user = await fetchUser(id);
        console.log("Usuario:", user);
    } catch (error) {
        console.error("Error:", error);
    }
}

// 4. PROMISE.ALL - Ejecutar múltiples promesas en paralelo
async function fetchMultipleUsers(ids: number[]) {
    const promises = ids.map(id => fetchUser(id));
    const users = await Promise.all(promises);
    return users;
}

// 5. PROMISE.RACE - Primera promesa que se resuelva
async function firstToRespond() {
    const promise1 = new Promise<string>((resolve) => {
        setTimeout(() => resolve("Primera"), 1000);
    });
    
    const promise2 = new Promise<string>((resolve) => {
        setTimeout(() => resolve("Segunda"), 500);
    });
    
    const result = await Promise.race([promise1, promise2]);
    console.log(result); // "Segunda"
}

// 6. PROMISE.ALLSETTLED - Espera a que todas se resuelvan (sin importar si fallan)
async function allSettledExample() {
    const promises = [
        Promise.resolve(1),
        Promise.reject("Error"),
        Promise.resolve(3)
    ];
    
    const results = await Promise.allSettled(promises);
    results.forEach((result) => {
        if (result.status === "fulfilled") {
            console.log("Éxito:", result.value);
        } else {
            console.log("Fallo:", result.reason);
        }
    });
}

// 7. CHAINING DE PROMISES CON .THEN()
function getDataChain() {
    return fetchUser(1)
        .then(user => {
            console.log("Usuario obtenido:", user);
            return user.id;
        })
        .then(id => {
            console.log("ID:", id);
            return "Completado";
        })
        .catch(error => {
            console.error("Error en la cadena:", error);
        });
}

// 8. MANEJO DE ERRORES EN ASYNC/AWAIT
async function robustFetch(url: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof TypeError) {
            console.error("Error de red:", error);
        } else {
            console.error("Error:", error);
        }
        throw error;
    }
}

// 9. FINALLY - Se ejecuta siempre
async function fetchWithFinally() {
    try {
        const user = await fetchUser(1);
        console.log(user);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        console.log("Petición completada");
    }
}

// 10. PROMISE CONSTRUCTOR CON TIPO GENÉRICO
function delay<T>(ms: number, value: T): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(value), ms);
    });
}

// 11. ASYNC ITERATOR
async function* asyncGenerator() {
    yield 1;
    yield 2;
    yield await delay(100, 3);
}

async function iterateAsync() {
    for await (const value of asyncGenerator()) {
        console.log(value);
    }
}

// 12. TOMAR MÚLTIPLES RESULTADOS
type ApiResponse = {
    data: unknown;
    status: number;
};

async function fetchMultiple(): Promise<ApiResponse[]> {
    const results = await Promise.all([
        fetch("https://api.example.com/1"),
        fetch("https://api.example.com/2"),
        fetch("https://api.example.com/3")
    ]);
    
    return Promise.all(
        results.map(res => 
            res.json().then(data => ({ data, status: res.status }))
        )
    );
}
