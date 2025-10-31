let contenedorProductos = document.getElementById("contenedor_productos")

async function obtenerProductos(){
    let url = "http://localhost:3000/productos"
    try{
        let respuesta = await fetch(url)
        let productos = await respuesta.json();

        console.table(productos.payload);
        //Para evitar que la politica de seguridad cors bloquee nuestra peticion fetch 
        //a esa url necesitamos habilitar cors desde nuestra API rest

        mostrarProductos(productos.payload);

    } catch(err){
        console.error("Error en la busqueda de productos", err.message);
    }
}

function mostrarProductos(productos){
    let htmlProductos = ""
    productos.forEach(prod => {
        htmlProductos += `
            <div class="card_producto">
                <img src="${prod.imagen} alt="${prod.nombreProducto}">
                <h3>${prod.nombreProducto}</h3>
                <p>${prod.precio}</p>
            </div>
        `
    });
    contenedorProductos.innerHTML = htmlProductos;
}

function init(){
    obtenerProductos();
}

init();