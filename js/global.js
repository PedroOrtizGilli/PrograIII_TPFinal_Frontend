// Esperamos a que el DOM esté cargado para ejecutar la función
document.addEventListener('DOMContentLoaded', () => {
    inyectarLogoAdmin();
    imprimirDatosAlumnos();
});

function inyectarLogoAdmin() {
    const headerElement = document.querySelector('header.navbar');
    const h1Element = headerElement ? headerElement.querySelector('h1') : null;

    if (headerElement && h1Element) {
        
        const logoImg = `
            <img src="https://image.pngaaa.com/207/5123207-middle.png" 
                 alt="Logo Admin" 
                 class="admin-logo-img"> 
        `;

        const brandContainer = document.createElement('div');
        brandContainer.className = 'navbar-brand'; // Para CSS

        brandContainer.innerHTML = logoImg + h1Element.outerHTML;

        headerElement.replaceChild(brandContainer, h1Element);

        console.log("Logo (imagen) de Admin inyectado.");
    }
}

function imprimirDatosAlumnos() {
    // Definir los datos de los alumnos
    const alumnos = [
        {
            nombre: "Matías Ariel",
            apellido: "Schirone"
        },
        {
            nombre: "Pedro",
            apellido: "Ortiz Gilli"
        }
    ];

    const headerElement = document.querySelector('header.navbar');
    
    if (headerElement) {
        const alumnosContainer = document.createElement('div');
        alumnosContainer.className = 'alumnos-info'; // Para CSS

        let alumnosHTML = '<strong>Alumnos:</strong><br>'; 

        alumnosHTML += alumnos.map(a => `${a.nombre} ${a.apellido}`).join('<br>'); 
        
        alumnosContainer.innerHTML = alumnosHTML;

        headerElement.appendChild(alumnosContainer);
        
        console.log("Alumnos cargados desde global.js:");
        alumnos.forEach(a => console.log(`- ${a.nombre} ${a.apellido}`));
    }
}