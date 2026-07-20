import { db } from "./firebase.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const formulario = document.getElementById("formReclamo");
const mensaje = document.getElementById("mensaje");

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        await addDoc(collection(db, "reclamos"), {

            nombre: document.getElementById("nombre").value,

            documento: document.getElementById("documento").value,

            correo: document.getElementById("correo").value,

            telefono: document.getElementById("telefono").value,

            direccion: document.getElementById("direccion").value,

            tipo: document.getElementById("tipo").value,

            pedido: document.getElementById("pedido").value,

            descripcion: document.getElementById("descripcion").value,

            estado: "Pendiente",

            fecha: new Date()

        });

        formulario.reset();

        mensaje.classList.remove("d-none");

        setTimeout(() => {

            mensaje.classList.add("d-none");

        }, 5000);

    } catch (error) {

        console.error(error);

        alert("❌ Ocurrió un error al enviar el reclamo.");

    }

});