# Autenticación

## Objetivo

Garantizar que únicamente usuarios autorizados puedan acceder a los recursos del sistema, protegiendo la información de las panaderías y
asegurando la integridad de los datos.

# Estrategia de Autenticación

El sistema utilizará autenticación basada en JSON Web Tokens (JWT) junto con Refresh Token Rotation.

Este enfoque permite mantener sesiones seguras, escalables y compatibles con arquitecturas basadas en APIs REST.

# Componentes

## Access Token

Token de corta duración utilizado para acceder a los recursos protegidos.

### Características

- Firmado con JWT.
- Contiene información básica del usuario.
- Validez aproximada de 15 minutos.
- Se envía en cada petición autenticada.

## Refresh Token

Token de larga duración utilizado para generar nuevos Access Tokens sin necesidad de que el usuario vuelva a iniciar sesión.

### Características

- Validez aproximada de 7 días.
- Se almacena de forma segura.
- Se renueva en cada uso mediante Refresh Token Rotation.

# Flujo de Autenticación

```text
Usuario
   │
   ▼
Login
   │
   ▼
Backend valida credenciales
   │
   ▼
Genera Access Token
Genera Refresh Token
   │
   ▼
Frontend almacena sesión
```

# Seguridad de Contraseñas

Las contraseñas nunca serán almacenadas en texto plano.

Se utilizará:

- bcrypt

Características:

- Hash irreversible.
- Protección contra ataques de fuerza bruta.
- Salt automático.

# Cierre de Sesión

Al cerrar sesión:

- El Refresh Token será invalidado.
- La sesión será eliminada del cliente.
- El usuario deberá autenticarse nuevamente.

# Beneficios

- Seguridad elevada.
- Escalabilidad.
- Compatibilidad con APIs REST.
- Mejor experiencia de usuario.
