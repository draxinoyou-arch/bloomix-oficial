
let carrito = [];

function agregarCarrito(nombre, precio) {
  carrito.push({
    nombre: nombre,
    precio: precio
  });

  mostrarCarrito();
}

function mostrarCarrito() {
  let html = "<h2>🛒 Carrito</h2>";

  let total = 0;

  carrito.forEach(producto => {
    html += `<p>${producto.nombre} - S/ ${producto.precio}</p>`;
    total += producto.precio;
  });

  html += `<h3>Total: S/ ${total}</h3>`;

  document.getElementById("carrito").innerHTML = html;
}
