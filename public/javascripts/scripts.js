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

  /*el id en el formulario de ingresos conecta con 'date-ingresos'*/
  document.getElementById('ordenarPor').addEventListener('change', function() {
    var tabla = document.getElementById('tabla');
    var ordenarPor = this.value;
    ordenarTabla(tabla, ordenarPor);
  });
  //orden segun lo que sea en tabla index
  document.getElementById('ordenarPor').addEventListener('change', function() {
    ordenarTabla();
  });

  function ordenarTabla() {
    var tabla = document.querySelector('.gastos');
    var criterio = document.getElementById('ordenarPor').value;
    var filas = Array.from(tabla.querySelectorAll('tr'));

    filas.sort(function(a, b) {
      var contenidoA = a.querySelector('.' + criterio).textContent;
      var contenidoB = b.querySelector('.' + criterio).textContent;
      return contenidoA.localeCompare(contenidoB);
    });

    for (var i = 0; i < filas.length; i++) {
      tabla.appendChild(filas[i]);
    }
  }
  