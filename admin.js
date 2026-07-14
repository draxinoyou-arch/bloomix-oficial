// =========================================
// BLOOMIX ADMIN v2
// PARTE 1
// =========================================

import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// =========================================
// PROTEGER PANEL
// =========================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

    }

});

// =========================================
// CLOUDINARY
// =========================================

const CLOUD_NAME = "fhkugeoo";
const UPLOAD_PRESET = "bloomix";

// =========================================
// ELEMENTOS DEL HTML
// =========================================

const formulario = document.getElementById("formProducto");

const imagen = document.getElementById("imagen");

const preview = document.getElementById("previewImagen");

const nombre = document.getElementById("nombre");

const precio = document.getElementById("precio");

const categoria = document.getElementById("categoria");

const descripcion = document.getElementById("descripcion");

const destacado = document.getElementById("destacado");

const oferta = document.getElementById("oferta");
const tablaProductos = document.getElementById("tablaProductos");

const totalProductos = document.getElementById("totalProductos");

// =========================================
// VARIABLES
// =========================================

let imagenURL = "";
let editando = false;

let productoEditar = "";

// =========================================
// VISTA PREVIA
// =========================================

imagen.addEventListener("change", () => {

    const archivo = imagen.files[0];

    if (!archivo) return;

    const lector = new FileReader();

    lector.onload = (e) => {

        preview.src = e.target.result;

    };

    lector.readAsDataURL(archivo);

});
// =========================================
// SUBIR IMAGEN A CLOUDINARY
// =========================================

async function subirImagen() {

    const archivo = imagen.files[0];

    if (!archivo) {
        alert("Selecciona una imagen.");
        return null;
    }

    const datos = new FormData();

    datos.append("file", archivo);
    datos.append("upload_preset", UPLOAD_PRESET);

    try {

        const respuesta = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: datos
            }
        );

        const resultado = await respuesta.json();

        if (!resultado.secure_url) {
            console.error(resultado);
            alert("Error al subir la imagen.");
            return null;
        }

        return resultado.secure_url;

    } catch (error) {

        console.error(error);

        alert("No se pudo conectar con Cloudinary.");

        return null;

    }

}
// =========================================
// GUARDAR PRODUCTO EN FIRESTORE
// =========================================

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const urlImagen = await subirImagen();

    if (!urlImagen) return;

    try {

        if (editando) {

    await updateDoc(doc(db, "productos", productoEditar), {

        nombre: nombre.value,

        precio: Number(precio.value),

        categoria: categoria.value,

        descripcion: descripcion.value,

        imagen: urlImagen,

        destacado: destacado.checked,

        oferta: oferta.checked

    });

    alert("✅ Producto actualizado correctamente");

    editando = false;

    productoEditar = "";

    document.querySelector("button[type='submit']").innerHTML =
    '<i class="fa-solid fa-floppy-disk"></i> Guardar Producto';

} else {

    await addDoc(collection(db, "productos"), {

        nombre: nombre.value,

        precio: Number(precio.value),

        categoria: categoria.value,

        descripcion: descripcion.value,

        imagen: urlImagen,

        destacado: destacado.checked,

        oferta: oferta.checked,

        fecha: new Date()

    });

    alert("✅ Producto guardado correctamente");

}

        alert("✅ Producto guardado correctamente");

        formulario.reset();

        preview.src =
        "https://placehold.co/300x300?text=Vista+Previa";

        imagenURL = "";
        await cargarProductos();

    } catch (error) {

        console.error("Error Firestore:", error);

        alert("❌ No se pudo guardar el producto");

    }

});
// =========================================
// CARGAR PRODUCTOS
// =========================================

async function cargarProductos() {

    tablaProductos.innerHTML = "";

    const consulta = await getDocs(collection(db, "productos"));

    totalProductos.textContent = consulta.size;

    if (consulta.empty) {

        tablaProductos.innerHTML = `
        <tr>
            <td colspan="6" class="text-center text-muted py-5">
                <i class="fa-solid fa-box-open fa-3x mb-3"></i>
                <br><br>
                Todavía no hay productos registrados.
            </td>
        </tr>
        `;

        return;

    }

    consulta.forEach((documento) => {

    const p = documento.data();

    const id = documento.id;

        tablaProductos.innerHTML += `
        <tr>

            <td>
                <img src="${p.imagen}"
                     width="60"
                     height="60"
                     style="object-fit:cover;border-radius:10px;">
            </td>

            <td>${p.nombre}</td>

            <td>${p.categoria}</td>

            <td>S/ ${p.precio}</td>

            <td>
                ${p.oferta ? "🔥 Oferta" : ""}
                ${p.destacado ? " ⭐ Destacado" : ""}
            </td>

            <td>

    <button
    class="btn btn-warning btn-sm me-2"
    onclick="editarProducto('${id}')">

        ✏️ Editar

    </button>

    <button
    class="btn btn-danger btn-sm"
    onclick="eliminarProducto('${id}')">

        🗑 Eliminar

    </button>

</td>

        </tr>
        `;

    });

}

// =========================================
// INICIAR
// =========================================

cargarProductos();
// ==========================
// ELIMINAR PRODUCTO
// ==========================

window.eliminarProducto = async function(id){

    const confirmar = confirm(
        "¿Eliminar este producto?"
    );

    if(!confirmar) return;

    await deleteDoc(
        doc(db,"productos",id)
    );

    cargarProductos();

}
window.editarProducto = async function(id){

    productoEditar = id;

    editando = true;

    const consulta = await getDocs(collection(db,"productos"));

    consulta.forEach(documento=>{

        if(documento.id===id){

            const p=documento.data();

            nombre.value=p.nombre;

            precio.value=p.precio;

            categoria.value=p.categoria;

            descripcion.value=p.descripcion;

            destacado.checked=p.destacado;

            oferta.checked=p.oferta;

            preview.src=p.imagen;

        }

    });

    document.querySelector("button[type='submit']").innerHTML=

    "💾 Actualizar producto";

}
// =========================================
// CERRAR SESIÓN
// =========================================

const btnSalir = document.getElementById("btnSalir");

if (btnSalir) {

    btnSalir.addEventListener("click", async () => {

        try {

            await signOut(auth);

            window.location.href = "login.html";

        } catch (error) {

            console.error(error);

            alert("No se pudo cerrar la sesión.");

        }

    });

}