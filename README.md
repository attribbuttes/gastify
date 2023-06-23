hasta aca:

<% consumos.sort(function(a, b) {
      var fechaA = new Date(a.fecha);
      var fechaB = new Date(b.fecha);
      return fechaB - fechaA;
  }).forEach(function(consumo) { %>
    <tr>

    esto ordena los datos en el index directo