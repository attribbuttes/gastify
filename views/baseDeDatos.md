gastos

gastos
id
fecha
consumo
importe     ----|que los importes se sumen y se haga un total mensual
tipo_pago   ----|que cuando se selecciona tarjeta se carguen esos datos en un fondo separado x 			tarjeta
categoria   ----|que se se puedan agrupar para ver x separado
texto_libre
color
monto_total
cantidad_pagos
valor_cuota
id_gastos	|fk| tiene que conectar con algo


se carga un gasto, fecha, importe, consumo, el tipo de pago abre opciones 'efectivo', 'tarjeta de credito', 'debito', 'otro'
el tipo tarjeta tiene opciones de cuotas para lo cual el importe se calcula en todos como 'monto_total'
en la tabla de gastos el 'consumo' tiene que poder agruparse 'roxi', 'toti', 'auto'...
id_gastos

**--**

ingresos

id
importe
cliente 
fecha
texto
categoria
horas
tipo_pago
color
idcliente
id_fk


gastos pronosticados del mes

