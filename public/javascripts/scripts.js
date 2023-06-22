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


  //ordenar por consumos
  document.getElementById('ordenarPor').addEventListener('change', function() {
    ordenarTabla();
  });
  
  function ordenarTabla() {
    var tabla = document.querySelector('.gastos');
    var criterio = document.getElementById('ordenarPor').value;
    var filas = Array.from(tabla.querySelectorAll('tbody tr'));
  
    filas.sort(function(a, b) {
      var contenidoA = obtenerContenido(a, criterio);
      var contenidoB = obtenerContenido(b, criterio);
  
      if (criterio === 'importe') {
        return parseFloat(contenidoB.contenido) - parseFloat(contenidoA.contenido);
      } else if (criterio === 'color') {
        // Agrupar por color y ordenar por cantidad de cada color
        var contadorA = contarElementos(filas, criterio, contenidoA.contenido);
        var contadorB = contarElementos(filas, criterio, contenidoB.contenido);
        return contadorB - contadorA;
      } else {
        return contenidoA.contenido.localeCompare(contenidoB.contenido);
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
  
  //orden tabla ingreso
  document.getElementById('ordenarPorIngreso').addEventListener('change', function() {
    ordenarTablaIngreso();
  });
  
  function ordenarTablaIngreso() {
    var tabla = document.querySelector('.list-tableI');
    var criterio = document.getElementById('ordenarPorIngreso').value;
    var filas = Array.from(tabla.querySelectorAll('tr'));
  
    filas.sort(function(a, b) {
      var contenidoA = a.querySelector('.' + criterio).textContent;
      var contenidoB = b.querySelector('.' + criterio).textContent;
      return contenidoA.localeCompare(contenidoB);
    });
  
    var tbody = tabla.querySelector('tbody');
    filas.forEach(function(fila) {
      tbody.appendChild(fila);
    });
  }