//Funcionalidad del indexcliente.html
if (window.location.pathname.endsWith('indexCliente.html')) {
    //Reseteo el nombre del cliente
    localStorage.removeItem('nombreUsuario');

    const form = document.getElementById('formNombre');
    //Recibo y envio la informacion del cliente
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const nombreUsuario = document.getElementById('fnombre').value;
            localStorage.setItem('nombreUsuario', nombreUsuario);
            window.location.href = './views/cliente/autoservice.html';
        });
    }
}

//Funcionalidad de autoservice.html
if (window.location.pathname.endsWith('autoservice.html')) {
    //Variables que vamos a usar
    const productContainer = document.getElementById('contenedor-productos');
    const nombre = localStorage.getItem('nombreUsuario');
    const btnCarrito = document.getElementById('btn-carrito');
    const filtroNav = document.getElementById('filtro-nav');
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let todosLosProductos = []

    //Muestro el nombre del cliente
    if (nombre) {
        const saludo = document.getElementById('saludo');
        if (saludo) {
            saludo.textContent = `¡Hola, ${nombre}! Bienvenido al autoservicio`;
        }
    //Si no hay nombre redirijo al indexCliente.html
    } else {
        window.location.href = '../../indexCliente.html';
    } 
    //Reviso que exista productContainer para traer los productos
    if (productContainer) {
        fetchFunction();
        actualizarContadorCarrito();
    } else {
        console.log("Nota: No se encontró 'contenedor-productos' en esta página.");
    }

    //Redirigir al carrito
    btnCarrito.addEventListener('click', () => {
        window.location.href = './carrito.html';
    });

     //Cargar productos desde la API
    async function fetchFunction() {
        try {
            const response = await fetch('http://localhost:3000/products');
            if (!response.ok) throw new Error('Error al obtener productos');
            
            const data = await response.json();
            todosLosProductos = data.payload;
            mostrarProductos(todosLosProductos);
        } catch (error) {
            console.error(error);
            productContainer.innerHTML = `<p class="error-message">Error al cargar productos.</p>`;
        }
    }
    //Creo y muestro las tarjetas de producto
    function mostrarProductos(lista) {
        productContainer.innerHTML = '';
        lista.forEach(producto => {
            const card = document.createElement('div');
            card.className = 'product-card';
            const urlDeImagen = producto.imagen || 'https://via.placeholder.com/250x200.png?text=Sin+Imagen'; 
            card.innerHTML = `
                <img src="${urlDeImagen}" alt="${producto.nombreProducto}">
                <div class="product-info">
                    <h3>${producto.nombreProducto}</h3>
                    <p class="product-tipo">${producto.tipo || 'N/A'}</p>
                    <p class="product-precio">$${producto.precio}</p>
                    <p class="product-stock">${producto.stock || 0} disponibles</p>
                    <button class="btn-comprar" data-id="${producto.id}">Comprar</button>
                </div>
            `;
            productContainer.appendChild(card);
            const boton = card.querySelector('.btn-comprar');
            boton.addEventListener('click', () => comprar(producto.id))
        });
    }
    //Filtrado por pinceles, acrilicos o todos los productos
    filtroNav.addEventListener('click', (e) => {
        e.preventDefault(); //evita recarga al hacer clic en los <a>

        if (!todosLosProductos.length) return; // si aún no cargaron los productos, no hace nada

        const filtro = e.target.id;

        if (filtro === 'todos') {
            mostrarProductos(todosLosProductos);
            console.log("Mostramos todos los productos");
        } else if (filtro === 'pinceles') {
            const filtrados = todosLosProductos.filter(p =>
                p.tipo?.toLowerCase().includes('pincel')
            );
            mostrarProductos(filtrados);
            console.log("Mostramos todos los pinceles");
        } else if (filtro === 'acrilicos') {
            const filtrados = todosLosProductos.filter(p =>
                p.tipo?.toLowerCase().includes('acrilic')
            );
            mostrarProductos(filtrados);
            console.log("Mostramos todos los acrilicos");
        }
    });
    //Agregar al carrito un producto
    function comprar(idProducto) {
        const productoSeleccionado = todosLosProductos.find(prod => prod.id === idProducto);
        if(!productoSeleccionado) return;
        const itemEnCarrito = carrito.find(item => item.id === productoSeleccionado.id);

        if (itemEnCarrito) {
            itemEnCarrito.cantidad++;
        } else {
            carrito.push({
                ...productoSeleccionado,
                cantidad: 1
            });
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarContadorCarrito();
    }
    //Actualiza el contador de productos al lado del icono del carrito
    function actualizarContadorCarrito() {
        const contador = document.getElementById('contador-carrito');
        const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];

        let totalCantidad = carritoGuardado.reduce((acc, item) => acc + item.cantidad, 0);

        contador.textContent = totalCantidad;
    }
}

//Funcionalidad de 'carrito.html'
if(window.location.pathname.endsWith('carrito.html')){
    //Variables
    const contenedorCarrito = document.getElementById('contenedor-productos');
    const subtotalSpan = document.getElementById('subtotal');
    const envioSpan = document.getElementById('envio');
    const impuestosSpan = document.getElementById('impuestos');
    const totalSpan = document.getElementById('total');

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    mostrarCarrito();
    actualizarTotales();
    //Creo y mustro los items del carrito
    function mostrarCarrito() {
        contenedorCarrito.innerHTML = '';

        if (carrito.length === 0) {
            contenedorCarrito.innerHTML = `<p>El carrito está vacío.</p>`;
            return;
        }

        carrito.forEach((prod, index) => {
            const div = document.createElement('div');
            div.classList.add('item-carrito');
            div.innerHTML = `
                <img src="${prod.imagen}" alt="${prod.nombreProducto}">
                
                <div class="info">
                    <p>${prod.nombreProducto}</p>
                    <p>$${prod.precio}</p>
                    <div class="cantidad">
                        <button class="btn-restar" data-index="${index}">-</button>
                        <span>${prod.cantidad}</span>
                        <button class="btn-sumar" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="btn-eliminar" data-index="${index}">Eliminar</button>
            `;
            contenedorCarrito.appendChild(div);
        });
        agregarEventos();
    }

    //Eventos de los botones
    function agregarEventos() {
        //Sumar
        document.querySelectorAll('.btn-sumar').forEach(btn => {
            btn.addEventListener('click', () => {
                let i = btn.dataset.index;
                carrito[i].cantidad++;
                guardar();
            });
        });

        //Restar
        document.querySelectorAll('.btn-restar').forEach(btn => {
            btn.addEventListener('click', () => {
                let i = btn.dataset.index;

                if (carrito[i].cantidad > 1) {
                    carrito[i].cantidad--;
                } else {
                    carrito.splice(i, 1); // si llega a 0, se elimina
                }

                guardar();
            });
        });

        //Eliminar
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', () => {
                let i = btn.dataset.index;
                carrito.splice(i, 1);

                guardar();
            });
        });
    }
    //Guardo en localStorage
    function guardar() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
        actualizarTotales();
    }
    //Actualizo el resumen de la compra
    function actualizarTotales() {
        let subtotal = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);

        let envio = subtotal > 0 ? 2500 : 0;
        let impuestos = subtotal * 0.21;
        let total = subtotal + envio + impuestos;

        subtotalSpan.textContent = `$${subtotal}`;
        envioSpan.textContent = `$${envio}`;
        impuestosSpan.textContent = `$${impuestos.toFixed(2)}`;
        totalSpan.textContent = `$${total.toFixed(2)}`;
    }
}