# Backend - Bakery SaaS 🥖

**Backend del sistema SaaS para panaderías y reposterías desarrollado con Express y Supabase.**

## 📌 Descripción

Este módulo se encarga de la lógica del negocio y la administración de datos del sistema.

El backend permite:

- Gestionar pedidos.
- Administrar ventas.
- Controlar inventario.
- Manejar autenticación.
- Exponer APIs REST para el frontend.

## 🎯 Objetivo del MVP

**Desarrollar una API funcional y escalable que permita validar los procesos principales del sistema antes de integrar funcionalidades avanzadas.**

## 🚀 Funcionalidades del MVP

### Pedidos

- Crear pedidos.
- Consultar pedidos.
- Actualizar pedidos.
- Eliminar pedidos.

### Inventario

- Registro de ingredientes.
- Actualización de stock.
- Entradas y salidas básicas.

### 💰 Ventas

- Registro de ventas.
- Historial básico.

### Autenticación

- Login.
- Validación de usuarios.
- Protección de endpoints.

## 🛠️ Tecnologías

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Supabase

## 📂 Estructura del proyecto

src/
│
├── controllers/
│
├── routes/
│
├── middleware/
│
├── services/
│
├── prisma/
│
├── config/
│
├── utils/
│
├── types/
│
├── server.ts
│
└── app.ts

## ⚙️ Instalación

Instalar dependencias
npm install

## ▶️ Ejecutar servidor

npm run dev

## 📌 API REST

### Pedidos

GET /api/orders
POST /api/orders
PUT /api/orders/:id
DELETE /api/orders/:id

### Inventario

GET /api/inventory
POST /api/inventory
PUT /api/inventory/:id
DELETE /api/inventory/:id

### Ventas

GET /api/sales
POST /api/sales

## 🌳 Flujo de trabajo

El backend utiliza GitHub Flow.
Convención de ramas:

- feature/nombre-funcionalidad
- fix/nombre-error
- refactor/nombre-refactor

## 📈 Futuras implementaciones

Las siguientes funcionalidades están contempladas para futuras versiones:

- Predicción inteligente de demanda.
- Sistema de recomendaciones.
- Análisis de ventas.
- Integración de IA.
- Alertas automáticas de inventario.
- Reportes avanzados.
- Integración de clima y temporadas.

## 📌 Estado del proyecto

🚧 MVP en desarrollo
