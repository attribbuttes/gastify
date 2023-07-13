function guardarDatos() {
  document.getElementById('formulario').submit(); // Enviar el formulario
}

document.getElementById('py_mtd').addEventListener('change', function() {
  var paymentDetailsField = document.getElementById('paymentDetails');
  var installmentDetailsField = document.getElementById('installmentDetails');

  if (this.value === 'tarjeta') {
    paymentDetailsField.style.display = 'block';
    installmentDetailsField.style.display = 'none';
  } else {
    paymentDetailsField.style.display = 'none';
    installmentDetailsField.style.display = 'block'; // Modificado para mostrar los detalles de cuotas
  }
});

document.getElementById('installments').addEventListener('change', function() {
  var paymentAmountField = document.getElementById('paymentAmount');
  var installmentAmountField = document.getElementById('installmentAmount');
  var totalAmount = parseFloat(paymentAmountField.value);
  var installments = parseInt(this.value);

  if (!isNaN(totalAmount) && !isNaN(installments) && installments > 1) {
    var installmentAmount = totalAmount / installments;
    installmentAmountField.value = installmentAmount.toFixed(2);
    document.getElementById('installmentDetails').style.display = 'block';
  } else {
    document.getElementById('installmentDetails').style.display = 'none';
  }
});

var fechaActual = new Date();

    // Formatear la fecha en formato YYYY-MM-DD (que es el formato requerido por el campo de fecha)
    var fechaFormateada = fechaActual.toISOString().split('T')[0];

    // Establecer la fecha actual como valor predeterminado en el campo de fecha
    document.getElementById("date").value = fechaFormateada;

    var today = new Date().toISOString().split('T')[0];
  document.getElementById('date-ingresos').value = today;


  /*function ordenarPorfechaDescendente(consumos) {
    consumos.sort(function(a, b) {
      var fechaA = new Date(a.fecha);
      var fechaB = new Date(b.fecha);
      return fechaB - fechaA;
    });
    return consumos;
  }*/

//mostrar titulo en rojo
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('h1').forEach(function(h1Element) {
    h1Element.style.color = 'red';
  });
});

//mostrar datos segun fecha ultima
document.addEventListener('DOMContentLoaded', function() {
  ordenarTabla();
});

function ordenarTabla() {
  var tabla = document.querySelector('.list-tableI');
  var criterio = 'fecha';
  var filas = Array.from(tabla.querySelectorAll('tbody tr'));

  filas.sort(function(a, b) {
    var contenidoA = obtenerContenido(a, criterio);
    var contenidoB = obtenerContenido(b, criterio);

    if (criterio === 'fecha') {
      return new Date(contenidoB.contenido) - new Date(contenidoA.contenido);
    } else if (criterio === 'cliente' || criterio === 'categoria') {
      return contenidoA.contenido.localeCompare(contenidoB.contenido);
    } else if (criterio === 'importe' || criterio === 'horas') {
      return parseFloat(contenidoB.contenido) - parseFloat(contenidoA.contenido);
    }
  });

  var tbody = tabla.querySelector('tbody');
  filas.forEach(function(fila) {
    tbody.appendChild(fila);
  });
}

function obtenerContenido(fila, criterio) {
  var contenido = fila.querySelector('.' + criterio).textContent;
  return {
    contenido: contenido,
    tipo: isNaN(parseFloat(contenido)) ? 'texto' : 'numero'
  };
}
//cambiar el color de la columna importe
window.addEventListener('DOMContentLoaded', function() {
  var importeCells = document.querySelectorAll('.importe');
  
  importeCells.forEach(function(cell) {
    cell.style.color = 'red';
  });
});

//anula la seleccion de color en el formulario
var elementosColor = document.querySelectorAll('#color');

// Iterar sobre los elementos y realizar acciones en cada uno
elementosColor.forEach(function(elemento) {
  // Hacer algo con cada elemento
  elemento.disabled = true; // Por ejemplo, deshabilitar cada elemento
});

//boton de subir
var scrollToTopButton = document.getElementById('scrollToTop');

scrollToTopButton.addEventListener('click', function() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Hace que el desplazamiento sea suave
  });
});
