# Modelo de Datos

## Tecnologías

### PostgreSQL

PostgreSQL será el sistema gestor de bases de datos principal del proyecto debido a su robustez, confiabilidad
y capacidad para manejar aplicaciones empresariales con altos niveles de consistencia e integridad de datos.

Entre sus principales características destacan:

- Soporte completo para SQL.
- Transacciones ACID.
- Relaciones complejas entre entidades.
- Índices avanzados para optimización de consultas.
- Seguridad y control de acceso avanzado.

### Supabase

Supabase será utilizado como proveedor de infraestructura para la base de datos PostgreSQL, proporcionando
herramientas de administración y servicios adicionales que facilitan el desarrollo y mantenimiento del sistema.

Además de PostgreSQL administrado, Supabase ofrece:

- Backups automáticos.
- Escalabilidad gestionada.
- Panel administrativo para gestión de datos.
- Monitoreo y métricas.
- Almacenamiento de archivos (Storage).
- Gestión centralizada de usuarios.
- API de acceso a datos.

# Justificación de la Selección

La combinación de PostgreSQL y Supabase permite disponer de una solución robusta, escalable y de bajo costo para la etapa inicial del proyecto.

Las principales razones para su adopción son:

- Reducción de costos operativos.
- Administración simplificada de la infraestructura.
- Alta disponibilidad.
- Facilidad de integración con aplicaciones Node.js.
- Compatibilidad con Prisma ORM.

Esta solución cubre adecuadamente las necesidades del Producto Mínimo Viable (MVP) y proporciona una base sólida para
futuras funcionalidades analíticas y de inteligencia artificial.

# Modelo de Datos General

El sistema seguirá un modelo relacional orientado a soportar múltiples panaderías dentro de una misma plataforma SaaS.

Cada panadería será propietaria de sus propios productos, inventarios, ventas, pedidos y clientes, garantizando
el aislamiento lógico de la información.

# Entidades Principales

## Bakery (Panaderías)

Representa a cada empresa o panadería registrada en la plataforma.

### Responsabilidades

- Almacenar información general del negocio.
- Servir como entidad raíz para el aislamiento de datos.
- Relacionar usuarios, productos, ventas y pedidos.

### Atributos principales

- id
- name
- address
- phone
- email
- created_at
- updated_at

## User (Usuarios)

Representa a las personas que utilizan la plataforma.

### Responsabilidades

- Acceso al sistema.
- Gestión de operaciones.
- Administración de módulos.

### Atributos principales

- id
- bakery_id
- first_name
- last_name
- email
- password_hash
- role
- is_active
- created_at

### Roles iniciales

- Administrador
- Empleado

## Product (Productos)

Representa los productos comercializados por una panadería.

### Atributos principales

- id
- bakery_id
- name
- description
- price
- category
- is_active
- created_at

## Inventory (Inventario)

Controla las existencias actuales de cada producto.

### Responsabilidades

- Monitorear stock disponible.
- Determinar disponibilidad de venta.
- Generar alertas de inventario.

### Atributos principales

- id
- bakery_id
- product_id
- quantity
- minimum_stock
- updated_at

## InventoryMovement (Movimientos de Inventario)

Registra todas las entradas y salidas de inventario.

### Tipos de movimiento

- Entrada
- Salida
- Ajuste
- Merma

### Atributos principales

- id
- inventory_id
- movement_type
- quantity
- reason
- created_at

## Customer (Clientes)

Representa a los clientes de la panadería.

### Responsabilidades

- Historial de compras.
- Seguimiento de pedidos.
- Análisis de comportamiento.

### Atributos principales

- id
- bakery_id
- first_name
- last_name
- phone
- email
- created_at

## Order (Pedidos)

Representa pedidos realizados por clientes.

### Responsabilidades

- Registrar solicitudes.
- Gestionar estados del pedido.
- Coordinar entregas.

### Estados iniciales

- Pendiente
- En preparación
- Listo
- Entregado
- Cancelado

### Atributos principales

- id
- bakery_id
- customer_id
- total_amount
- status
- created_at

## OrderItem (Detalle de Pedido)

Permite asociar múltiples productos a un pedido.

### Atributos principales

- id
- order_id
- product_id
- quantity
- unit_price
- subtotal

## Sale (Ventas)

Representa las ventas realizadas por la panadería.

### Responsabilidades

- Registrar ingresos.
- Generar reportes.
- Alimentar estadísticas.

### Atributos principales

- id
- bakery_id
- customer_id
- total_amount
- payment_method
- created_at

## SaleItem (Detalle de Venta)

Permite registrar los productos vendidos en cada transacción.

### Atributos principales

- id
- sale_id
- product_id
- quantity
- unit_price
- subtotal

---

# Relaciones Principales

```text
Bakery
│
├── Users
├── Products
├── Inventory
├── Customers
├── Orders
└── Sales

Products
│
├── Inventory
├── OrderItems
└── SaleItems

Orders
│
└── OrderItems

Sales
│
└── SaleItems

Inventory
│
└── InventoryMovements
```

# Escalabilidad Futura

El modelo de datos ha sido diseñado para permitir la incorporación futura de:

- Sucursales múltiples.
- Proveedores.
- Compras de materia prima.
- Producción diaria.
- Reportes financieros.
- Predicción de demanda mediante IA.
- Recomendaciones automáticas de reposición de inventario.
- Integraciones con sistemas de facturación.
