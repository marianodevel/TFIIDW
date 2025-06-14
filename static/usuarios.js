// Verificación de autenticación
const token = sessionStorage.getItem("accessToken");
if (!token) {
  alert("Acceso no autorizado");
  window.location.href = "../login.html";
}

// Cargar usuarios desde dummyjson.com
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("https://dummyjson.com/users");
    if (!response.ok) throw new Error("Error al cargar usuarios");

    const data = await response.json();
    const tablaUsuarios = document.getElementById("tablaUsuarios");

    if (data.users && data.users.length > 0) {
      tablaUsuarios.innerHTML = data.users
        .map(
          (user, index) => `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${user.username}</td>
                    <td>${user.firstName} ${user.lastName}</td>
                </tr>
            `,
        )
        .join("");
    } else {
      tablaUsuarios.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center py-4 text-muted">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        No se encontraron usuarios
                    </td>
                </tr>`;
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("tablaUsuarios").innerHTML = `
            <tr>
                <td colspan="3" class="text-center py-4 text-danger">
                    <i class="fas fa-times-circle me-2"></i>
                    Error al cargar los usuarios
                </td>
            </tr>`;
  }
});
