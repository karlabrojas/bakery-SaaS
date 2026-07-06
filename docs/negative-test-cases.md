# Negative Test Cases

## Autenticación

- Login con usuario inexistente.
- Login con contraseña incorrecta.
- Token inválido.
- Token expirado.
- Refresh token reutilizado.

## Ventas

- Cantidad negativa.
- Cantidad igual a cero.
- Producto inexistente.
- Producto sin inventario.
- Venta sin autenticación.

## Inventario

- Registrar salida mayor al stock.
- Registrar movimiento sin producto.
- Registrar cantidades negativas.

## Pedidos

- Pedido sin productos.
- Pedido con cliente inexistente.
- Cancelar pedido entregado.

## Multi-Tenant

- Consultar información de otra panadería.
- Modificar productos de otra panadería.
- Consultar ventas de otra panadería.