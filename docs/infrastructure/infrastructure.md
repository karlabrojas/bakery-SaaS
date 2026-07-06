# Infraestructura

## Objetivo

La infraestructura del sistema tiene como objetivo proporcionar un entorno seguro, escalable y de bajo costo para el despliegue del MVP del SaaS para panaderías.

La solución propuesta se basa en servicios administrados, reduciendo la carga operativa del equipo de desarrollo y permitiendo concentrar los esfuerzos en la construcción
de funcionalidades de negocio.

# Arquitectura de Infraestructura

```text
┌───────────────────────┐
│       Usuario         │
└───────────┬───────────┘
            │ HTTPS
            ▼
┌───────────────────────┐
│       Frontend        │
│   Next.js (Vercel)    │
└───────────┬───────────┘
            │ HTTPS
            ▼
┌───────────────────────┐
│        Backend        │
│ Express.js (Render)   │
└───────────┬───────────┘
            │
     ┌──────┴──────┐
     │             │
     ▼             ▼
┌───────────┐ ┌───────────┐
│PostgreSQL │ │  Storage  │
│ Supabase  │ │ Supabase  │
└───────────┘ └───────────┘
```

# Frontend

## Plataforma de Despliegue

Vercel

## Tecnologías Desplegadas

- Next.js
- React
- TypeScript
- Tailwind CSS

## Justificación

Vercel es la plataforma oficial recomendada para aplicaciones desarrolladas con Next.js y proporciona una integración nativa
con GitHub, optimizando el flujo de despliegue continuo.

## Ventajas

- Integración directa con GitHub.
- Despliegues automáticos mediante Push o Pull Request.
- CDN global para distribución de contenido.
- Certificados SSL incluidos.
- Optimización automática para aplicaciones Next.js.
- Escalado administrado por la plataforma.

## Responsabilidad dentro de la arquitectura

- Renderizar la interfaz de usuario.
- Gestionar la navegación.
- Consumir la API REST.
- Administrar la experiencia de usuario.

# Backend

## Plataforma de Despliegue

Render

## Tecnologías Desplegadas

- Node.js
- Express.js
- TypeScript
- Prisma ORM

## Justificación

Render proporciona una solución sencilla para desplegar aplicaciones backend basadas en Node.js, permitiendo automatizar
procesos de construcción, despliegue y monitoreo sin necesidad de administrar servidores manualmente.

## Ventajas

- Configuración simple.
- Certificados SSL incluidos.
- Integración con GitHub.
- Despliegues automáticos.
- Variables de entorno seguras.
- Escalamiento vertical administrado.
- Monitoreo básico integrado.

## Responsabilidad dentro de la arquitectura

- Exponer la API REST.
- Ejecutar las reglas de negocio.
- Gestionar autenticación y autorización.
- Acceder a la base de datos.
- Gestionar integraciones futuras.

# Base de Datos

## Plataforma

Supabase

## Motor

PostgreSQL

## Justificación

Supabase proporciona una instancia administrada de PostgreSQL, eliminando la necesidad de gestionar infraestructura
de bases de datos y ofreciendo herramientas adicionales para administración, monitoreo y almacenamiento de archivos.

## Ventajas

- PostgreSQL administrado.
- Backups automáticos.
- Escalabilidad.
- Panel administrativo.
- Monitoreo integrado.
- Gestión centralizada de datos.
- Compatibilidad con Prisma ORM.

## Responsabilidad dentro de la arquitectura

- Gestión de relaciones entre entidades.
- Persistencia de información.
- Soporte para consultas analíticas futuras.

# Almacenamiento de Archivos

## Plataforma

Supabase Storage

## Uso previsto

El almacenamiento será utilizado para gestionar archivos relacionados con la operación de las panaderías.

### Ejemplos

- Fotografías de productos.
- Logotipos de negocios.
- Imágenes de perfil.
- Archivos de reportes exportados.

## Ventajas

- Integración nativa con Supabase.
- Control de acceso.
- Escalabilidad.
- Gestión simplificada de archivos.

# Variables de Entorno

Cada componente utilizará variables de entorno para proteger información sensible.

## Frontend

NEXT_PUBLIC_API_URL=

## Backend

PORT=
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
SUPABASE_URL=
SUPABASE_ANON_KEY=

# Estrategia de Despliegue

## Entornos

Se utilizarán tres entornos principales:

### Desarrollo

dev

Utilizado por el equipo de desarrollo para implementar nuevas funcionalidades.

### QA

qa

Utilizado para validación funcional y pruebas de integración.

### Producción

main

Entorno estable utilizado por los usuarios finales.

# Flujo de Despliegue

```text
feature/*
      │
      ▼
     dev
      │
      ▼
      qa
      │
      ▼
    main
```

Cada promoción entre entornos deberá realizarse mediante Pull Request y revisión de código.

# Consideraciones de Escalabilidad

La infraestructura propuesta es suficiente para soportar el MVP y las primeras fases de crecimiento del producto.

En futuras versiones podrá evolucionarse mediante:

- Balanceadores de carga.
- Caché distribuido con Redis.
- Contenedores Docker.
- Orquestación con Kubernetes.
- Servicios independientes para analítica e inteligencia artificial.
- Arquitectura basada en microservicios si el volumen de usuarios lo requiere.

# Evaluación de Viabilidad

| Componente    | Tecnología            | Viabilidad |
| ------------- | --------------------- | ---------- |
| Frontend      | Next.js + Vercel      | Alta       |
| Backend       | Express.js + Render   | Alta       |
| Base de Datos | PostgreSQL + Supabase | Alta       |
| Storage       | Supabase Storage      | Alta       |

La infraestructura seleccionada permite un despliegue rápido, costos reducidos y una administración simplificada,
cumpliendo adecuadamente los requerimientos técnicos y operativos del MVP.
