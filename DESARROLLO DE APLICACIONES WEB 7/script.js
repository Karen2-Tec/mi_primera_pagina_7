// 1. Array de objetos que simula los registros del Inventario (Colección base)
let baseDrops = [
    { id: 1, nombre: "Air Jordan 1 High 'Chicago'", categoria: "Sneakers", stock: 5, descripcion: "Piel premium combinada en bloques blancos, rojos y negros clásicos." },
    { id: 2, nombre: "Baggy Cargo Denim Desgastado", categoria: "Streetwear", stock: 0, descripcion: "Mezclilla pesada de corte ancho con bolsillos utilitarios laterales." },
    { id: 3, nombre: "Cangurera Leather Cherry Red", categoria: "Accesorios", stock: 14, descripcion: "Herrajes pesados con correa ajustable y cuero texturizado." }
];

// 2. Enrutador de secciones del lado del cliente (Simula rutas en Flask)
function navegar(seccionId) {
    const secciones = document.querySelectorAll('.content-section');
    secciones.forEach(sec => sec.classList.add('d-none'));

    const seccionActiva = document.getElementById(`view-${seccionId}`);
    if (seccionActiva) {
        seccionActiva.classList.remove('d-none');
    }

    // Actualiza el link seleccionado en el navbar
    const enlaces = document.querySelectorAll('.navbar-nav .nav-link');
    enlaces.forEach(enlace => {
        enlace.classList.remove('active');
        if (enlace.getAttribute('onclick').includes(seccionId)) {
            enlace.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const formDrop = document.getElementById('form-drop');
    const inputNombre = document.getElementById('drop-nombre');
    const selectCategoria = document.getElementById('drop-categoria');
    const inputStock = document.getElementById('drop-stock');
    const txtDescripcion = document.getElementById('drop-descripcion');
    
    const alertContainer = document.getElementById('alert-container');
    const listaDropsCards = document.getElementById('lista-drops-cards');
    const totalDropsBadge = document.getElementById('total-drops-badge');
    const mensajeVacio = document.getElementById('mensaje-vacio');

    // Inicializar visualización del catálogo
    renderizarInventarioCompleto();

    // --- LÓGICA DE VALIDACIÓN (Semana 6) ---
    function validarNombre() {
        const valor = inputNombre.value.trim();
        if (valor === '' || valor.length < 5) { marcarInvalido(inputNombre); return false; }
        marcarValido(inputNombre); return true;
    }

    function validarCategoria() {
        if (!selectCategoria.value) { marcarInvalido(selectCategoria); return false; }
        marcarValido(selectCategoria); return true;
    }

    function validarStock() {
        const valor = inputStock.value.trim();
        if (valor === '' || parseInt(valor) < 0 || isNaN(parseInt(valor))) { marcarInvalido(inputStock); return false; }
        marcarValido(inputStock); return true;
    }

    function validarDescripcion() {
        const valor = txtDescripcion.value.trim();
        if (valor === '' || valor.length < 15) { marcarInvalido(txtDescripcion); return false; }
        marcarValido(txtDescripcion); return true;
    }

    function marcarInvalido(el) { el.classList.remove('is-valid'); el.classList.add('is-invalid'); }
    function marcarValido(el) { el.classList.remove('is-invalid'); el.classList.add('is-valid'); }

    inputNombre.addEventListener('input', validarNombre);
    selectCategoria.addEventListener('change', validarCategoria);
    inputStock.addEventListener('input', validarStock);
    txtDescripcion.addEventListener('input', validarDescripcion);

    // --- ESTRUCTURA REPETITIVA Y CONDICIONALES (Semana 7) ---
    function renderizarInventarioCompleto() {
        listaDropsCards.innerHTML = '';

        // Condicional: Verificar si el inventario está vacío
        if (baseDrops.length === 0) {
            mensajeVacio.classList.remove('d-none');
            totalDropsBadge.innerText = "Total: 0";
            return;
        } else {
            mensajeVacio.classList.add('d-none');
        }

        // Estructura Repetitiva (.forEach) para inyectar tarjetas de inventario
        baseDrops.forEach((item) => {
            const stockStyle = item.stock > 0 ? 'background: rgba(34, 197, 94, 0.1); color: #22c55e;' : 'background: rgba(239, 68, 68, 0.1); color: #ef4444;';
            const stockLabel = item.stock > 0 ? `En Stock: ${item.stock} unidades` : 'Agotado / Out of Stock';

            const colCard = document.createElement('div');
            colCard.className = 'col-12 col-md-6 col-lg-4';
            colCard.innerHTML = `
                <div class="card product-inventory-card h-100 d-flex flex-column justify-content-between p-3">
                    <div>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="tag-cat">${item.categoria}</span>
                            <small class="text-muted">ID: ${item.id.toString().slice(-4)}</small>
                        </div>
                        <h4 class="h5 text-white fw-bold card-title">${item.nombre}</h4>
                        <p class="text-muted-urban small card-text">${item.descripcion}</p>
                    </div>
                    <div class="mt-3 d-flex justify-content-between align-items-center">
                        <span class="badge-stock-dinamico" style="${stockStyle}">${stockLabel}</span>
                        <button class="btn-delete-drop" data-id="${item.id}">Eliminar</button>
                    </div>
                </div>
            `;

            colCard.querySelector('.btn-delete-drop').addEventListener('click', () => {
                eliminarDrop(item.id);
            });

            listaDropsCards.appendChild(colCard);
        });

        totalDropsBadge.innerText = `Total: ${baseDrops.length}`;
    }

    // Registrar nuevo drop en memoria interna
    formDrop.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validarNombre() && validarCategoria() && validarStock() && validarDescripcion()) {
            const nuevoObj = {
                id: Date.now(),
                nombre: inputNombre.value.trim(),
                categoria: selectCategoria.value,
                stock: parseInt(inputStock.value),
                descripcion: txtDescripcion.value.trim()
            };

            baseDrops.push(nuevoObj);
            renderizarInventarioCompleto();
            
            formDrop.reset();
            document.querySelectorAll('.form-input').forEach(i => i.classList.remove('is-valid'));
            
            // Simulación de redirección automática al inventario tras registrar
            navegar('inventario');
        } else {
            mostrarAlerta('Por favor, complete todos los campos correctamente.', 'danger');
        }
    });

    function eliminarDrop(id) {
        baseDrops = baseDrops.filter(item => item.id !== id);
        renderizarInventarioCompleto();
    }

    function mostrarAlerta(msg, tipo) {
        alertContainer.innerHTML = `<div class="urban-alert alert-${tipo}">${msg}</div>`;
        setTimeout(() => alertContainer.innerHTML = '', 3500);
    }
});