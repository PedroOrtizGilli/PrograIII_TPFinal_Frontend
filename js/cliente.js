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
    const productContainer = document.getElementById('contenedor-productos');
    const nombre = localStorage.getItem('nombreUsuario');
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
        fetchYMostrarProductos();
    } else {
        console.log("Nota: No se encontró 'contenedor-productos' en esta página.");
    }

    //Muestro los productos disponibles
        async function fetchYMostrarProductos() {
        try {
            // Pedimos los productos a la API (ruta corregida)
            const response = await fetch('http://localhost:3000/products');
            if (!response.ok) throw new Error('Error al obtener productos');
            
            const data = await response.json();
            const productos = data.payload;

            // Limpiamos el contenedor
            productContainer.innerHTML = '';

            // Recorremos los productos y creamos una TARJETA por cada uno
            productos.forEach(producto => {
                
                // Creamos un nuevo div para la tarjeta
                const card = document.createElement('div');
                card.className = 'product-card'; // Le asignamos su clase CSS
               
                // Usamos una imagen "placeholder" si el producto no tiene una
                const urlDeImagen = producto.imagen || 'https://via.placeholder.com/250x200.png?text=Sin+Imagen'; 
                const nombreProducto = producto.nombreProducto;

                // Construimos el HTML interno de la tarjeta
                card.innerHTML = `
                    <img src="${urlDeImagen}" alt="${nombreProducto}">
                    <div class="product-info">
                        <h3>${nombreProducto}</h3>
                        <p class="product-tipo">${producto.tipo || 'N/A'}</p>
                        <p class="product-precio">$${producto.precio}</p>
                        <p class="product-stock">${producto.stock || 0} disponibles</p>
                    </div>
                `;

                // Añadimos la tarjeta completa al contenedor
                productContainer.appendChild(card);
            });

        } catch (error) {
            console.error(error);
            // Mensaje de error simple si algo falla
            productContainer.innerHTML = `<p class="error-message">Error al cargar productos.</p>`;
        }
    }
}