// administracion.js
document.addEventListener("DOMContentLoaded", () => {
  const cargarSalones = () => {
    const salones = JSON.parse(localStorage.getItem("salones")) || [];
    const tablaBody = document.getElementById("tablaSalones");

    // Limpiar tabla antes de cargar
    tablaBody.innerHTML = "";

    if (salones.length === 0) {
      tablaBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-4 text-muted">
            <i class="fas fa-exclamation-circle me-2"></i>
            No hay salones registrados
          </td>
        </tr>
      `;
      return;
    }

    // Llenar tabla con datos
    salones.forEach((salon, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <th scope="row">${index + 1}</th>
        <td>${salon.nombre}</td>
        <td>$${salon.precio.toLocaleString("es-AR")}</td>
        <td>${salon.capacidad} personas</td>
        <td>
          <img src="${salon.imagen}" alt="${salon.nombre}" 
               class="img-thumbnail" style="width: 80px; height: 60px; object-fit: cover;">
        </td>
      `;

      tablaBody.appendChild(row);
    });
  };

  // Cargar datos al iniciar
  cargarSalones();
});
