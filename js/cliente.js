//funcionalidad del indexcliente.html
if (window.location.pathname.endsWith('indexCliente.html')) {
    //reseteo el nombre del cliente
    localStorage.removeItem('nombreUsuario');

    const form = document.getElementById('formNombre');
    //recibo y envio la informacion del cliente
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const nombreUsuario = document.getElementById('fnombre').value;
            localStorage.setItem('nombreUsuario', nombreUsuario);
            window.location.href = './views/cliente/autoservice.html';
        });
    }
}

//funcionalidad de autoservice.html
if (window.location.pathname.endsWith('autoservice.html')) {
    //Variables que vamos a usar
    const productContainer = document.getElementById('contenedor-productos');
    const nombre = localStorage.getItem('nombreUsuario');
    const btnCarrito = document.getElementById('btn-carrito');

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

    if (productContainer) {
        fetchFunction();
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
                </div>
            `;
            productContainer.appendChild(card);
        });
    }
}