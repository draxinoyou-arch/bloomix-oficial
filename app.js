let carrito = [];

function agregarCarrito(nombre, precio) {
  let producto = carrito.find(p => p.nombre === nombre);

  if (producto) {
    producto.cantidad++;
  } else {
    carrito.push({
      nombre: nombre,
      precio: precio,
      cantidad: 1
    });
  }

  mostrarCarrito();
}

function cambiarCantidad(nombre, cambio) {
  let producto = carrito.find(p => p.nombre === nombre);

  if (!producto) return;

  producto.cantidad += cambio;

  if (producto.cantidad <= 0) {
    carrito = carrito.filter(p => p.nombre !== nombre);
  }

  mostrarCarrito();
}

function mostrarCarrito() {
  let html = "<h2>🛒 Carrito</h2>";

  let total = 0;

  carrito.forEach(producto => {
    let subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    html += `
      <p>
        <b>${producto.nombre}</b><br>
        <button onclick="cambiarCantidad('${producto.nombre}',-1)">➖</button>
        ${producto.cantidad}
        <button onclick="cambiarCantidad('${producto.nombre}',1)">➕</button>
        = S/ ${subtotal}
      </p>
    `;
  });

  html += `<h3>Total: S/ ${total}</h3>`;

  document.getElementById("carrito").innerHTML = html;
}
