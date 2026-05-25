# Frontend - Bakery SaaS 🧁

**Frontend del sistema SaaS para panaderías y reposterías desarrollado con Next.js.**

## 📌 Descripción

Este módulo contiene la interfaz principal del sistema, incluyendo la landing page y el panel administrativo del MVP.

El objetivo principal es ofrecer una interfaz moderna e intuitiva para gestionar:

- Pedidos
- Ventas
- Inventario
- Autenticación de usuarios

## 🎯 Objetivo del MVP

**Validar una solución digital que permita a panaderías y reposterías mejorar la organización de sus operaciones diarias mediante una plataforma web centralizada.**

## 🚀 Funcionalidades del MVP

### Landing Page

- Presentación del proyecto.
- Información de la solución a problemas.
- Beneficios principales.
- Captación de posibles clientes.

### Autenticación

- Inicio de sesión.
- Protección de rutas.
- Manejo básico de sesiones.

### Gestión de pedidos

- Registro de pedidos.
- Consulta de pedidos.
- Actualización de estados.

### Inventario

- Visualización de ingredientes.
- Control básico de stock.

### Ventas

- Registro de ventas.
- Historial básico.

## 🛠️ Tecnologías

- Next.js
- TypeScript
- Tailwind CSS
- Axios
- React Hooks

## Arquitectura

**Feature-Based + Component Driven**

## 📂 Estructura del proyecto

frontend-SaaS/
│
├── public/
│
├── app/
│ ├── landing/
│ │ └── page.tsx
│ │
│ ├── dashboard/
│ ├── inventory/
│ ├── orders/
│ ├── sales/
│ ├── auth/
│ ├── layout.tsx
│ └── page.tsx
│
├── features/
│ │
│ ├── landing/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── services/
│ │ └── types/
│ │
│ ├── orders/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── services/
│ │ └── types/
│ │
│ ├── inventory/
│ │
│ ├── sales/
│ │
│ └── dashboard/
│
├── components/
│ ├── ui/
│ │ ├── Button/
│ │ ├── Input/
│ │ ├── Card/
│ │ └── Modal/
│ │
│ └── layout/
│
├── lib/
│
├── context/
│
├── styles/
│
├── types/
│
├── utils/
│
├── .env.local
└── package.json

### Ejemplo de estructura

features/orders/
│
├── components/
│ ├── OrderCard.tsx
│ ├── OrderTable.tsx
│ └── OrderForm.tsx
│
├── hooks/
│ └── useOrders.ts
│
├── services/
│ └── orders.service.ts
│
├── types/
│ └── order.types.ts
│
└── utils/

## ⚙️ Instalación

Instalar dependencias

npm install

## ▶️ Ejecutar el proyecto

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🌳 Flujo de trabajo

El frontend utiliza GitHub Flow.
Convención de ramas:

- feature/nombre-funcionalidad
- fix/nombre-error
- refactor/nombre-refactor

## 📈 Futuras implementaciones

Las siguientes funcionalidades se contemplan para futuras versiones:

- Dashboard analítico.
- Predicción de demanda.
- Reportes avanzados.
- Gráficas de ventas.
- Notificaciones automáticas.
- Gestión avanzada de producción.
- Integración de inteligencia artificial.

## 📌 Estado del proyecto

🚧 MVP en desarrollo
