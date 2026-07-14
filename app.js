/* =====================================
   BLOOMIX OFICIAL
   APP.JS - PARTE 1
===================================== */

let carrito = JSON.parse(localStorage.getItem("carritoBloomix")) || [];

const carritoPanel = document.getElementById("carritoPanel");
const overlay = document.getElementById("overlay");
const carritoHTML = document.getElementById("carrito");
const contador = document.getElementById("contador");
const totalHTML = document.getElementById("totalCarrito");

/* ==========================
   ABRIR CARRITO
========================== */

function abrirCarrito() {

    carritoPanel.classList.add("activo");
    overlay.classList.add("activo");

}

/* ==========================
   CERRAR CARRITO
========================== */

function cerrarCarrito() {

    carritoPanel.classList.remove("activo");
    overlay.classList.remove("activo");

}

/* ==========================
   GUARDAR LOCAL
========================== */

function guardarCarrito() {

    localStorage.setItem(
        "carritoBloomix",
        JSON.stringify(carrito)
    );

}

/* ==========================
   AGREGAR PRODUCTO
========================== */

function agregarCarrito(nombre, precio){

    const existe = carrito.find(
        producto => producto.nombre === nombre
    );

    if(existe){

        existe.cantidad++;

    }else{

        carrito.push({

            nombre:nombre,
            precio:precio,
            cantidad:1

        });

    }

    guardarCarrito();

    actualizarCarrito();

    abrirCarrito();

}
/* ==========================
   ACTUALIZAR CARRITO
========================== */

function actualizarCarrito(){

    if(carrito.length===0){

        carritoHTML.innerHTML=`

        <div class="carrito-vacio">

            <i class="fa-solid fa-bag-shopping"></i>

            <p>Tu carrito está vacío.</p>

        </div>

        `;

        contador.textContent="0";

        totalHTML.textContent="S/ 0.00";

        guardarCarrito();

        return;

    }

    let html="";

    let total=0;

    let cantidadTotal=0;

    carrito.forEach((producto,index)=>{

        const subtotal=producto.precio*producto.cantidad;

        total+=subtotal;

        cantidadTotal+=producto.cantidad;

        html+=`

        <div class="carrito-item">

            <div>

                <h4>${producto.nombre}</h4>

                <p>S/ ${producto.precio.toFixed(2)}</p>
            </div>

            <div class="cantidad">

                <button onclick="restarCantidad(${index})">−</button>

                <span>${producto.cantidad}</span>

                <button onclick="sumarCantidad(${index})">+</button>

            </div>

        </div>

        `;

    });

    carritoHTML.innerHTML=html;

    contador.textContent=cantidadTotal;

    totalHTML.textContent="S/ "+total.toFixed(2);

    guardarCarrito();

}

/* ==========================
   SUMAR
========================== */

function sumarCantidad(index){

    carrito[index].cantidad++;

    actualizarCarrito();

}

/* ==========================
   RESTAR
========================== */

function restarCantidad(index){

    carrito[index].cantidad--;

    if(carrito[index].cantidad<=0){

        carrito.splice(index,1);

    }

    actualizarCarrito();

}
/* ==========================
   BUSCADOR
========================== */

const buscador = document.getElementById("buscar");

if (buscador) {

    buscador.addEventListener("keyup", function () {

        const texto = this.value.toLowerCase();

        document.querySelectorAll(".producto").forEach(producto => {

            const nombre = producto.querySelector("h3").textContent.toLowerCase();

            producto.style.display = nombre.includes(texto) ? "block" : "none";

        });

    });

}

/* ==========================
   FILTRO CATEGORÍAS
========================== */

const botonesCategorias = document.querySelectorAll(".categoria-btn");

botonesCategorias.forEach(boton => {

    boton.addEventListener("click", function () {

        botonesCategorias.forEach(btn => btn.classList.remove("activo"));

        this.classList.add("activo");

        const categoria = this.dataset.categoria;

        document.querySelectorAll(".producto").forEach(producto => {

            if (
                categoria === "todos" ||
                producto.dataset.categoria === categoria
            ) {

                producto.style.display = "block";

            } else {

                producto.style.display = "none";

            }

        });

    });

});

/* ==========================
   WHATSAPP
========================== */

function enviarWhatsApp(){

    if(carrito.length===0){

        alert("Tu carrito está vacío.");

        return;

    }

    let mensaje="🛍️ *Pedido Bloomix Oficial*%0A%0A";

    let total=0;

    carrito.forEach(producto=>{

        const subtotal=producto.precio*producto.cantidad;

        total+=subtotal;

        mensaje+=
`• ${producto.nombre}%0A`;
        mensaje+=
`Cantidad: ${producto.cantidad}%0A`;
        mensaje+=
`Subtotal: S/ ${subtotal.toFixed(2)}%0A%0A`;

    });

    mensaje+=`💰 *TOTAL:* S/ ${total.toFixed(2)}`;

    window.open(

        "https://wa.me/51930598363?text="+mensaje,

        "_blank"

    );

}

/* ==========================
   INICIAR
========================== */

actualizarCarrito();
const btnVerProductos = document.getElementById("verProductos");

if (btnVerProductos) {

    btnVerProductos.addEventListener("click", () => {

        document.getElementById("productos").scrollIntoView({
            behavior: "smooth"
        });

    });

}
// =========================
// CARGAR PRODUCTOS
// =========================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAy5l2ycbWT17mXWiAh_VtzF94T2Dx_Fe0",
    authDomain: "bloomix-oficial-f98ff.firebaseapp.com",
    projectId: "bloomix-oficial-f98ff",
    storageBucket: "bloomix-oficial-f98ff.firebasestorage.app",
    messagingSenderId: "1034656114873",
    appId: "1:1034656114873:web:b20edfca314959d8d01368"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cargarProductos() {

    const contenedor = document.getElementById("listaProductos");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    const consulta = await getDocs(collection(db, "productos"));

    consulta.forEach((doc) => {

        const p = doc.data();

        contenedor.innerHTML += `

<div class="col-lg-3 col-md-6 producto"
     data-categoria="${p.categoria}">

<div class="card-producto">

<img src="${p.imagen}">

<div class="contenido">

<small>${p.categoria}</small>

<h3>${p.nombre}</h3>

<p>${p.descripcion}</p>

<div class="precio">

S/ ${p.precio}

</div>

<button
class="btn-carrito"
onclick="agregarCarrito('${p.nombre}',${p.precio})">

Añadir al carrito

</button>

</div>

</div>

</div>

`;

    });

}

cargarProductos();
// =========================
// HACER FUNCIONES GLOBALES
// =========================

window.agregarCarrito = agregarCarrito;
window.abrirCarrito = abrirCarrito;
window.cerrarCarrito = cerrarCarrito;
window.sumarCantidad = sumarCantidad;
window.restarCantidad = restarCantidad;
window.enviarWhatsApp = enviarWhatsApp;