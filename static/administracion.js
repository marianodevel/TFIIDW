document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const tablaBody = document.getElementById("tablaSalones");
  const salonModal = new bootstrap.Modal(document.getElementById("salonModal"));
  const modalTitle = document.getElementById("modalTitle");
  const formSalon = document.getElementById("formSalon");
  const imagenInput = document.getElementById("imagen");
  const imagenPreview = document.getElementById("imagenPreview");
  const preview = document.getElementById("preview");

  let salones = JSON.parse(localStorage.getItem("salones")) || [];
  let editMode = false;
  let currentEditIndex = null;

  // Configurar eventos
  function setupEventListeners() {
    // Botón para nuevo salón
    const header = document.querySelector(".card-header");
    if (!document.getElementById("btnNuevoSalon")) {
      const btnNuevo = document.createElement("button");
      btnNuevo.id = "btnNuevoSalon";
      btnNuevo.className = "btn btn-success ms-3";
      btnNuevo.innerHTML = '<i class="fas fa-plus me-1"></i> Nuevo Salón';
      btnNuevo.addEventListener("click", () => {
        editMode = false;
        currentEditIndex = null;
        modalTitle.textContent = "Nuevo Salón";
        formSalon.reset();
        imagenPreview.style.display = "none";
        imagenInput.required = true;
        salonModal.show();
      });
      header.appendChild(btnNuevo);
    }

    // Vista previa de imagen
    imagenInput.addEventListener("change", function (e) {
      if (this.files && this.files[0]) {
        const file = this.files[0];
        const validTypes = ["image/jpeg", "image/png", "image/gif"];

        if (!validTypes.includes(file.type)) {
          mostrarAlerta(
            "Formato de imagen no válido. Use JPG, PNG o GIF.",
            "danger",
          );
          this.value = "";
          return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
          preview.src = e.target.result;
          imagenPreview.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
    });

    // Enviar formulario
    formSalon.addEventListener("submit", function (e) {
      e.preventDefault();
      guardarSalon();
    });
  }

  // Guardar o actualizar salón
  function guardarSalon() {
    const nombre = document.getElementById("nombre").value.trim();
    const precio = parseInt(document.getElementById("precio").value);
    const capacidad = parseInt(document.getElementById("capacidad").value);
    const imagenFile = imagenInput.files[0];

    // Validaciones
    if (!nombre || isNaN(precio) || isNaN(capacidad)) {
      mostrarAlerta("Por favor complete todos los campos requeridos", "danger");
      return;
    }

    if (precio <= 0) {
      mostrarAlerta("El precio debe ser mayor que cero", "danger");
      return;
    }

    if (capacidad <= 0) {
      mostrarAlerta("La capacidad debe ser mayor que cero", "danger");
      return;
    }

    if (!editMode && !imagenFile) {
      mostrarAlerta("Debe seleccionar una imagen", "danger");
      return;
    }

    // Para producción real, aquí deberías subir la imagen a un servidor
    const imagen =
      editMode && !imagenFile
        ? salones[currentEditIndex].imagen
        : URL.createObjectURL(imagenFile);

    const salon = { nombre, precio, capacidad, imagen };

    if (editMode) {
      salones[currentEditIndex] = salon;
      mostrarAlerta("Salón actualizado correctamente", "success");
    } else {
      salones.push(salon);
      mostrarAlerta("Salón agregado correctamente", "success");
    }

    localStorage.setItem("salones", JSON.stringify(salones));
    cargarSalones();
    salonModal.hide();
  }

  // Cargar datos en la tabla
  function cargarSalones() {
    tablaBody.innerHTML = "";

    if (salones.length === 0) {
      tablaBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4 text-muted">
            <i class="fas fa-exclamation-circle me-2"></i>
            No hay salones registrados
          </td>
        </tr>
      `;
      return;
    }

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
        <td>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-warning" onclick="editarSalon(${index})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="eliminarSalon(${index})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      tablaBody.appendChild(row);
    });
  }

  // Funciones globales para los botones
  window.editarSalon = (index) => {
    editMode = true;
    currentEditIndex = index;
    const salon = salones[index];

    modalTitle.textContent = "Editar Salón";
    document.getElementById("nombre").value = salon.nombre;
    document.getElementById("precio").value = salon.precio;
    document.getElementById("capacidad").value = salon.capacidad;

    imagenPreview.style.display = "block";
    preview.src = salon.imagen;
    imagenInput.required = false;

    salonModal.show();
  };

  window.eliminarSalon = (index) => {
    if (confirm("¿Estás seguro de eliminar este salón?")) {
      salones.splice(index, 1);
      localStorage.setItem("salones", JSON.stringify(salones));
      cargarSalones();
      mostrarAlerta("Salón eliminado correctamente", "info");
    }
  };

  function mostrarAlerta(mensaje, tipo) {
    // Eliminar alertas existentes primero
    const alertasExistentes = document.querySelectorAll(".alert");
    alertasExistentes.forEach((alerta) => alerta.remove());

    const alerta = document.createElement("div");
    alerta.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alerta.innerHTML = `
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alerta);
    setTimeout(() => alerta.remove(), 3000);
  }

  // Inicializar
  setupEventListeners();
  cargarSalones();
});
