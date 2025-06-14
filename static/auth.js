document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorElement = document.getElementById("loginError");

    try {
      // Mostrar estado de carga
      const submitBtn = e.target.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Verificando...';

      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          expiresInMins: 30, // Token válido por 30 minutos
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Credenciales incorrectas");
      }

      const data = await response.json();

      // Guardar token y datos de usuario
      sessionStorage.setItem("accessToken", data.token);
      sessionStorage.setItem("user", JSON.stringify(data));

      // Redirigir al área administrativa
      window.location.href = "administracion.html"; // Cambiar por tu ruta
    } catch (error) {
      errorElement.textContent = error.message;
      errorElement.classList.remove("d-none");

      // Restaurar botón
      const submitBtn = e.target.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.textContent = "Ingresar";
    }
  });
