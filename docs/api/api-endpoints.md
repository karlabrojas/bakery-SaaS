# API Endpoints

## Objetivo

Definir los endpoints principales que serán implementados durante el desarrollo del MVP.

Todos los endpoints estarán agrupados bajo:

/api

# Autenticación

## Login

POST /api/auth/login

## Refresh Token

POST /api/auth/refresh

## Logout

POST /api/auth/logout

# Usuarios

## Obtener usuarios

GET /api/users

## Crear usuario

POST /api/users

## Actualizar usuario

PUT /api/users/:id

## Eliminar usuario

DELETE /api/users/:id

# Productos

## Obtener productos

GET /api/products

## Obtener producto por ID

GET /api/products/:id

## Crear producto

POST /api/products

## Actualizar producto

PUT /api/products/:id

## Eliminar producto

DELETE /api/products/:id

# Inventario

## Consultar inventario

GET /api/inventory

## Actualizar stock

PATCH /api/inventory/:id

## Consultar movimientos

GET /api/inventory/movements

# Clientes

## Obtener clientes

GET /api/customers

## Crear cliente

POST /api/customers

# Pedidos

## Obtener pedidos

GET /api/orders

## Crear pedido

POST /api/orders

## Actualizar estado

PATCH /api/orders/:id/status

# Ventas

## Obtener ventas

GET /api/sales

## Registrar venta

POST /api/sales

## Reportes

## Resumen general

GET /api/reports/dashboard

## Ventas por periodo

GET /api/reports/sale
