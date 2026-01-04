import { cargarSesiones } from "./sesiones.js";
import { cargarProductos, agregarAlCarrito } from "./carrito.js";

document.addEventListener("DOMContentLoaded", async () => {
 
  await cargarProductos();

  
  cargarSesiones(agregarAlCarrito);
});
