// ==============================================
//       SISTEMA DE CONTROL ACUEDUCTO
//            FUNCIONES DE NAVEGACIÓN
// ==============================================

// ✅ IR A REGISTRAR MOVIMIENTOS (Entradas y Salidas)
function irMovimientos() {
    window.location.href = "movimientos.html";
}

// ✅ IR A GESTIÓN DE INVENTARIO / CONTROL (El del candado)
function irInventario() {
    window.location.href = "inventario.html";
}

// ✅ IR A GESTIÓN DE USUARIOS
function irUsuarios() {
    window.location.href = "usuario.html"; // ✅ CORREGIDO
}

// ✅ IR A IMPRIMIR REPORTES
function irReportes() {
    window.location.href = "reportes.html";
}

// ✅ FUNCIÓN PARA VOLVER ATRÁS (Usada en todas las páginas)
function volver() {
    window.location.href = "index.html";
}

// ✅ FUNCIÓN DE INGRESO / LOGIN (La usaremos después para la seguridad)
function ingresar() {
    // Aquí luego validamos la cédula y contraseña
    console.log("Validando acceso...");
    // Por mientras muestra un mensaje
    alert("Sistema listo. Próximamente con seguridad de acceso.");
}

// ==============================================
//        CÓDIGO LISTO Y FUNCIONANDO
// ==============================================
console.log("✅ Sistema cargado correctamente.");