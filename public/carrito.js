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

    div.innerHTML = `
      <strong>${l.nombre}</strong> 
      <br>
      Cantidad: ${l.cantidad} | Subtotal: ${l.subtotal} €
      <br>
      <button class="mas">+</button>
      <button class="menos">-</button>
      <button class="eliminar">Eliminar</button>
    `;

    div.querySelector(".mas").addEventListener("click", () => {
      agregarAlCarrito(l.id);
    });

    div.querySelector(".menos").addEventListener("click", () => {
      quitarUno(l.id);
    });

    div.querySelector(".eliminar").addEventListener("click", () => {
      eliminarProducto(l.id);
    });

    contenedor.appendChild(div);
    total += l.subtotal;
  });

  totalDiv.innerHTML = `
    Total: ${total.toFixed(2)} €
    <br>
    <button class="vaciar">Vaciar carrito</button>
  `;

  totalDiv.querySelector(".vaciar")?.addEventListener("click", vaciarCarrito);
}


function quitarUno(idProducto) {
  const linea = carrito.find(l => l.id === idProducto);
  if (!linea) return;

  linea.cantidad -= 1;

  if (linea.cantidad <= 0) {
    carrito = carrito.filter(l => l.id !== idProducto);
  } else {
    const sesion = buscarProducto(idProducto);
    const precio = Number(sesion.precio.replace("€", "").trim());
    linea.subtotal = +(linea.cantidad * precio).toFixed(2);
  }

  dibujarCarrito();
}


function eliminarProducto(idProducto) {
  carrito = carrito.filter(l => l.id !== idProducto);
  dibujarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  dibujarCarrito();
}
  

