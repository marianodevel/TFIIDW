// script.js (versión actualizada)
const primeraVisita = () => {
  if (localStorage.getItem("salones")) {
    console.log("Los datos ya están cargados");
    return false;
  }
  return true;
};

const llenarLocalStorage = async () => {
  try {
    const response = await fetch("../data/salones.json");
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const data = await response.json();
    if (!data.salones || !Array.isArray(data.salones))
      throw new Error("Formato inválido");
    localStorage.setItem("salones", JSON.stringify(data.salones));
  } catch (error) {
    console.error("Error:", error);
  }
};

const renderizarCatalogo = () => {
  const salones = JSON.parse(localStorage.getItem("salones")) || [];
  const catalogoContainer = document.getElementById("catalogoSalones");

  if (catalogoContainer && salones.length > 0) {
    catalogoContainer.innerHTML = salones
      .map(
        (salon) => `
      <div class="col-12 col-sm-6 col-lg-4 mb-4">
        <article class="card h-100 w-80 bg-white">
          <div class="image-placeholder">
            <img class="salon-image" src="${salon.imagen}" alt="${salon.nombre}">
          </div>
          <div class="card-body">
            <h4 class="card-title">${salon.nombre}</h4>
            <p class="price">$${salon.precio.toLocaleString("es-AR")}</p>
            <p class="capacity">Capacidad ${salon.capacidad} personas</p>
          </div>
        </article>
      </div>
    `,
      )
      .join("");
  } else if (catalogoContainer) {
    catalogoContainer.innerHTML =
      '<p class="text-center">No hay salones disponibles</p>';
  }
};

async function iniciarApp() {
  if (primeraVisita()) {
    await llenarLocalStorage();
  }
  renderizarCatalogo();
}

document.addEventListener("DOMContentLoaded", iniciarApp);
