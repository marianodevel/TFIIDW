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
const primeraVisita = () => {
  if (localStorage.getItem("salones")) {
    console.log("Los datos ya están cargados");
    return false; // No es primera visita
  }
  return true; // Sí es primera visita
};

const llenarLocalStorage = async () => {
  try {
    const response = await fetch("./data/salones.json");
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const data = await response.json();
    if (!data.salones || !Array.isArray(data.salones))
      throw new Error("Formato inválido");
    localStorage.setItem("salones", JSON.stringify(data.salones));
  } catch (error) {
    console.error("Error:", error);
  }
};

async function iniciarApp() {
  if (primeraVisita()) {
    // Solo si es primera visita
    await llenarLocalStorage();
  }
  const salones = JSON.parse(localStorage.getItem("salones"));
  console.log("Salones:", salones);
}

iniciarApp();
