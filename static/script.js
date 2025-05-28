/*
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

if (storageAvailable("localStorage")) {
  // Yippee! We can use localStorage awesomeness
} else {
  // Too bad, no localStorage for us
}
*/

const primeraVisita() => {
	if (localStorage.getItem('salones') {
		console.log('Los datos de salones se encuentran previamente cargados');
		return false;
	} else {
		llenarLocalStorage();
		return true;
	}
}

const llenarLocalStorage async() => {
	try {
		const response = await fetch('./data/salones.json');
		if (!response.ok) {
			throw new Error(`Error al cargar los salones: ${response.status}`);
		}
		const data = await response.json();
		if (!data.salones ||| !Array.isArray(data.salones)) {
			throw new Error('Formato invalido');
		}
		localStorage.setItem('salones', JSON.stringify(data.salones)); // revisar si no va en formato JSON
	} catch (error) {
		console.error('Error en localStorage:', error);
	}
}

async function iniciarApp() {
	const inicializado = primeraVisita();
	if (!inicializado) {
		await llenarLocalStorage();
	}
	const salones = JSON.parse(localStorage.getItem('salones'));
	console.log('Salones: ', salones);
}

iniciarApp();


