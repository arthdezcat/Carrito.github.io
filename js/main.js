const productos = [
    { id: 1, nombre: 'Laptop Dell Modelo AnicronX1', precio: 22500, imagen:'imagen/Laptop.jpg', detalle: 'Procesador de tercera generación Intel® Core™ i3-3217U (caché de 3 MB, 1,8 GHz), Windows 11 Pro, Gráficos HD 4000 Intel® (para procesadores de 3ra generación Intel® CoreTM i3, i5, i7), Memoria DDR3 compartida de dos canales de 1600 MHz de 8 GB'},
    { id: 2, nombre: 'Monitor Gamer Dell 27 pulgadas', precio: 6500, imagen:'imagen/MonitorG.jpg', detalle: 'Tamaño de la vista diagonal (pulgadas) 34.18, Proporción de aspecto 21:09, Resolución 3440 x 1440 at 175Hz, Conectividad HDMI; DP, Tipo de Panel Quantum Dot OLED Antireflection'},
    { id: 3, nombre: 'Impresora 3D Marca Genius', precio: 15000, imagen:'imagen/Impresora3D.jpg', detalle: 'Material	Aluminio, Color	Negro, Dimensiones del producto	30D x 30W x 40H centimeters, Peso del producto	12,9 Kilogramos'},
    { id: 4, nombre: 'Setup de Desarrollo (Mesa y luces)', precio: 12200, imagen:'imagen/setup.jpg', detalle: ''},
    { id: 5, nombre: 'Camara HD Ultra', precio: 12500, imagen:'imagen/CamaraHD.jpg', detalle: ''},
];

const productosSection = document.querySelector('.productos');
const listaCarrito = document.querySelector('.lista-carrito');
const vaciarCarritoBtn = document.querySelector('.vaciar-carrito');
const totalCompra = document.querySelector('.total-compra');


const imprimirTicketBtn = document.querySelector('.imprimir-ticket');
const ticketModal = document.getElementById('ticket-modal');
const ticketContent = document.querySelector('.modal-content');
const closeModal = document.querySelector('.close');

    function renderProductos() {
        productos.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');
            
            const imagenProducto = document.createElement('img');
            imagenProducto.src=producto.imagen;
            imagenProducto.width=100;
            imagenProducto.height=100;
            imagenProducto.classList.add('zoom');

            productoDiv.appendChild(imagenProducto);

            const nombreProducto=document.createElement('h3');
            nombreProducto.textContent= producto.nombre;
            productoDiv.appendChild(nombreProducto);

            const precioProducto= document.createElement('p');
            precioProducto.textContent=producto.precio;
            productoDiv.appendChild(precioProducto);



            const botonAgregar = document.createElement('button');
            botonAgregar.textContent= 'Agregar al Carrito';
            botonAgregar.classList.add('agregar-carrito');
            botonAgregar.dataset.id = producto.id;
            productoDiv.appendChild(botonAgregar);

            const botonDetalle = document.createElement('button');
            botonDetalle.textContent='Mas detalle +';
            botonDetalle.classList.add('ver-detalle');
            botonDetalle.dataset.id= producto.id;
            botonDetalle.addEventListener('click', mostrarDetalles);
            productoDiv.appendChild(botonDetalle);


            productosSection.appendChild(productoDiv);
        })
    }

function mostrarDetalles(e){
    const productoId=parseInt(e.target.dataset.id);
    const producto=productos.find(p => p.id === productoId);

    ticketContent.innerHTML = '<h2>Especificaciones Producto</h2><p>'+producto.detalle+'</p>';
    ticketModal.style.display='block';
}


function agregarAlCarrito(e) {
    if (e.target.classList.contains('agregar-carrito')) {
        const productoId = parseInt(e.target.dataset.id);
        const producto = productos.find(p => p.id === productoId);
        const carrito = getCarrito();
        const itemIndex = carrito.findIndex(item => item.id === productoId);

        if (itemIndex >= 0) {
            carrito[itemIndex].cantidad++;
        } else {
            carrito.push({
                ...producto,
                cantidad: 1,
            });
        }

        saveCarrito(carrito);
        renderCarrito();
    }
}

function getCarrito() {
    const carritoJSON = localStorage.getItem('carrito');
    return carritoJSON ? JSON.parse(carritoJSON) : [];
}

function saveCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function vaciarCarrito() {
    localStorage.removeItem('carrito');
    renderCarrito();
}

function calcularTotal(carrito) {
    let total = 0;
    carrito.forEach(item => {
        total += item.precio * item.cantidad;
    });
    return total;
}

function renderCarrito() {
    const carrito = getCarrito();
    listaCarrito.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML =
            '<p>' + item.nombre + ' - ' 
            + item.cantidad + ' - ' 
            + item.precio * item.cantidad + '</p>'+'<button class="eliminar-producto" data-id='+ item.id+'>Eliminar</ button>';

            itemDiv.querySelector('.eliminar-producto').addEventListener('click', eliminarDelCarrito);

        listaCarrito.appendChild(itemDiv);
        total += item.precio * item.cantidad;
    });

    totalCompra.innerHTML = 'Total Compra: ' + total;
}

function eliminarDelCarrito(e){

    const productoId= parseInt(e.target.dataset.id);

    let carrito=getCarrito();

    carrito = carrito.filter(item => item.id !== productoId);

    saveCarrito(carrito);
    renderCarrito();
}



function generarTicketHTML() {
    const carrito = getCarrito();
    let ticketHTML = 
        "<h1>Mi tienda online</h1>"+
        "<h2>Ticket de compra</h2>"+
        "<div class=ticket-items>";

    carrito.forEach(item => {
        ticketHTML += "<p> "+ item.nombre + " | " + item.cantidad + " | " + item.precio * item.cantidad + " </p>";
    });

    ticketHTML += "</div>" +
        "<p class=total-compra>Total: $ " + calcularTotal(carrito) + "</p>";

    return ticketHTML;
}

function mostrarTicketModal() {
    ticketContent.innerHTML = generarTicketHTML();
    ticketModal.style.display = 'block';
}

function cerrarTicketModal() {
    ticketModal.style.display = 'none';
}

imprimirTicketBtn.addEventListener('click', mostrarTicketModal);
closeModal.addEventListener('click', cerrarTicketModal);

// Cerrar la ventana modal al hacer clic fuera de ella
window.addEventListener('click', function (event) {
    if (event.target === ticketModal) {
        cerrarTicketModal();
    }
});

productosSection.addEventListener('click', agregarAlCarrito);
vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

renderProductos();
renderCarrito();