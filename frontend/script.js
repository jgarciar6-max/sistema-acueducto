const form = document.getElementById('formPqr');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        numeroRadicado: document.getElementById('numeroRadicado').value,
        cliente: {
            nombre: document.getElementById('nombre').value,
            nic: document.getElementById('nic').value,
            direccion: document.getElementById('direccion').value
        },
        tipoTrabajo: document.getElementById('tipoTrabajo').value,
        descripcionProblema: document.getElementById('descripcionProblema').value,
        tecnicoResponsable: document.getElementById('tecnicoResponsable').value
    };

    try {
        const respuesta = await fetch('http://192.168.0.104:5000/api/pqr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();
        console.log(resultado);
        
        document.getElementById('mensajeExito').style.display = 'block';
        form.reset();
        
        setTimeout(() => {
            document.getElementById('mensajeExito').style.display = 'none';
        }, 3000);

    } catch (error) {
        console.error('Error:', error);
        alert('❌ Hubo un error al enviar');
    }
});
