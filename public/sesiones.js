
export async function cargarSesiones(onAgregar) {
  // Traemos JSON desde el backend
  const response = await fetch("/data/sesiones.json");
  const dataSesion = await response.json();

  const contenedor = document.querySelector(".sesiones-container");
  contenedor.innerHTML = "";

  dataSesion.forEach(sesion => {
    const div = document.createElement("div");
    div.classList.add("sesion");

    div.innerHTML = `
      <img src="${sesion.imagen}" alt="${sesion.nombre}">
      <p>${sesion.nombre}</p>
      <p>Precio ${sesion.precio}</p>
      <button class="btn-agregar">Añadir al carrito</button>
    `;

    // Conectar el botón con la función de carrito
    div.querySelector(".btn-agregar").addEventListener("click", () => {
      onAgregar(sesion.id);
    });

    contenedor.appendChild(div);
  });
}

