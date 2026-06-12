# Seguridad

## Objetivo

Proteger la información almacenada por las panaderías y reducir los riesgos asociados a accesos no autorizados, pérdida de datos y
vulnerabilidades comunes en aplicaciones web.

# Protección de Datos

## HTTPS

Toda comunicación entre cliente y servidor deberá realizarse mediante HTTPS.

Beneficios:

- Cifrado de información.
- Protección contra ataques Man-In-The-Middle.
- Integridad de los datos transmitidos.

## Variables de Entorno

Información sensible almacenada mediante variables de entorno.

Ejemplos:

- DATABASE_URL
- JWT_SECRET
- JWT_REFRESH_SECRET
- SUPABASE_URL

## Protección de Contraseñas

Las contraseñas serán almacenadas utilizando:

- bcrypt

Nunca se almacenarán contraseñas en texto plano.

# Control de Acceso

El sistema implementará Role-Based Access Control (RBAC).

Roles iniciales:

## Administrador

Permisos:

- Gestionar usuarios.
- Gestionar productos.
- Gestionar inventario.
- Gestionar ventas.
- Gestionar pedidos.
- Consultar reportes.

## Empleado

Permisos:

- Registrar ventas.
- Gestionar pedidos.
- Consultar inventario.

# Protección contra Vulnerabilidades

## SQL Injection

Mitigación:

- Prisma ORM.
- Consultas parametrizadas.

## Cross-Site Scripting (XSS)

Mitigación:

- Sanitización de entradas.
- Escape automático de React.

## Cross-Site Request Forgery (CSRF)

Mitigación:

- Tokens JWT.
- Validación de origen.

## Fuerza Bruta

Mitigación:

- Rate Limiting.
- Bloqueo temporal de intentos fallidos.

# Middleware de Seguridad

Se implementarán:

- Helmet
- CORS
- Rate Limiter
- Validación con Zod

# Auditoría

Se registrarán eventos críticos:

- Inicio de sesión.
- Cierre de sesión.
- Cambios de contraseña.
- Operaciones administrativas.
