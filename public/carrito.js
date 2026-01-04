let productos = [];
let carrito = [];


export async function cargarProductos() {
  const response = await fetch("/data/sesiones.json");
  productos = await response.json();
}


function buscarProducto(id) {
  return productos.find(p => p.id === id);
}


export function agregarAlCarrito(idProducto) {
    
  const sesion = buscarProducto(idProducto);
  if (!sesion) return;

  
  const precio = Number(sesion.precio.replace("€", "").trim());

  
  const linea = carrito.find(l => l.id === idProducto);

  if (linea) {
    linea.cantidad += 1;
    linea.subtotal = +(linea.cantidad * precio).toFixed(2);
  } else {
    carrito.push({
      id: sesion.id,
      nombre: sesion.nombre,
      cantidad: 1,
      subtotal: +precio.toFixed(2)
    });
  }

  dibujarCarrito();
}


function dibujarCarrito() {
  const contenedor = document.querySelector(".carrito");
  const totalDiv = document.querySelector(".total");

  contenedor.innerHTML = "";
  let total = 0;

  carrito.forEach(l => {
    const div = document.createElement("div");
    div.textContent = `${l.nombre} - ${l.cantidad} uds - ${l.subtotal} €`;
    contenedor.appendChild(div);
    total += l.subtotal;
  });

  totalDiv.textContent = `Total: ${total.toFixed(2)} €`;
}
