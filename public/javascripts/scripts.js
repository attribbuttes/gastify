function calcularSuma() {
    var consumo = parseFloat(document.getElementById("name").value);
    var monto = parseFloat(document.getElementById("ammount").value);
    var suma = consumo + monto;
    document.getElementById("suma").value = suma.toFixed(2);
  }
  
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
      installmentDetailsField.style.display = 'none';
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
  