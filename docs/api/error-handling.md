# Manejo de Errores

## Objetivo

Establecer un formato uniforme para las respuestas de error de la API, facilitando el desarrollo del frontend y el monitoreo del sistema.

# Estructura General

Todas las respuestas de error seguirán el siguiente formato:

```json
{
  "success": false,
  "message": "Descripción del error",
  "error": {
    "code": "ERROR_CODE"
  }
}
```

# Errores de Validación

Código HTTP:

400 Bad Request

Ejemplo:

```json
{
  "success": false,
  "message": "Los datos enviados son inválidos",
  "error": {
    "code": "VALIDATION_ERROR"
  }
}
```

# Errores de Autenticación

Código HTTP:

401 Unauthorized

Ejemplo:

```json
{
  "success": false,
  "message": "Token inválido o expirado",
  "error": {
    "code": "INVALID_TOKEN"
  }
}
```

# Errores de Autorización

Código HTTP:

403 Forbidden

Ejemplo:

```json
{
  "success": false,
  "message": "No tiene permisos para realizar esta acción",
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS"
  }
}
```

# Recursos No Encontrados

Código HTTP:

404 Not Found

# Conflictos

Código HTTP:

409 Conflict

Ejemplo:

```json
{
  "success": false,
  "message": "El correo electrónico ya existe",
  "error": {
    "code": "EMAIL_ALREADY_EXISTS"
  }
}
```

# Errores Internos

Código HTTP:

500 Internal Server Error

Ejemplo:

```json
{
  "success": false,
  "message": "Error interno del servidor",
  "error": {
    "code": "INTERNAL_SERVER_ERROR"
  }
}
```
