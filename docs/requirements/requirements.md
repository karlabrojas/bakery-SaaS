# Requerimientos del Sistema

## Requerimientos Funcionales

### RF-01 Gestión de Autenticación

El sistema deberá permitir a los usuarios iniciar sesión mediante correo electrónico y contraseña.

### RF-02 Gestión de Sesiones

El sistema deberá gestionar sesiones utilizando Access Tokens y Refresh Tokens para mantener la autenticación segura de los usuarios.

### RF-03 Cierre de Sesión

El sistema deberá permitir a los usuarios cerrar sesión e invalidar los tokens asociados.

### RF-04 Gestión de Usuarios

El sistema deberá permitir la creación, consulta, actualización y desactivación de usuarios.

### RF-05 Gestión de Roles

El sistema deberá asignar roles a los usuarios para controlar el acceso a las funcionalidades del sistema.

### RF-06 Gestión de Panaderías

El sistema deberá almacenar la información general de cada panadería registrada en la plataforma.

### RF-07 Gestión de Productos

El sistema deberá permitir registrar, consultar, actualizar y desactivar productos.

### RF-08 Consulta de Inventario

El sistema deberá mostrar el stock disponible de cada producto registrado.

### RF-09 Actualización de Inventario

El sistema deberá permitir registrar entradas y salidas de inventario.

### RF-10 Registro de Movimientos de Inventario

El sistema deberá almacenar un historial de movimientos realizados sobre el inventario.

### RF-11 Gestión de Clientes

El sistema deberá permitir registrar, consultar y actualizar información de clientes.

### RF-12 Registro de Pedidos

El sistema deberá permitir registrar pedidos realizados por los clientes.

### RF-13 Gestión de Estados de Pedido

El sistema deberá permitir actualizar el estado de un pedido durante su ciclo de vida.

### RF-14 Registro de Ventas

El sistema deberá permitir registrar ventas realizadas dentro de la panadería.

### RF-15 Detalle de Ventas

El sistema deberá almacenar los productos asociados a cada venta.

### RF-16 Actualización Automática de Inventario

El sistema deberá descontar automáticamente el stock de los productos vendidos.

### RF-17 Consulta de Ventas

El sistema deberá permitir consultar el historial de ventas realizadas.

### RF-18 Generación de Reportes

El sistema deberá generar reportes de ventas, inventario y pedidos.

### RF-19 Dashboard Administrativo

El sistema deberá mostrar indicadores generales relacionados con ventas, inventario y pedidos.

### RF-20 Control de Acceso

El sistema deberá restringir el acceso a funcionalidades según el rol asignado al usuario.

## Requerimientos No Funcionales

### RNF-01 Disponibilidad

El sistema deberá estar disponible al menos el 99% del tiempo durante su operación.

### RNF-02 Rendimiento

El tiempo de respuesta promedio de las operaciones principales no deberá exceder los 3 segundos bajo condiciones normales de uso.

### RNF-03 Escalabilidad

La arquitectura deberá permitir la incorporación de nuevos módulos sin afectar significativamente los componentes existentes.

### RNF-04 Seguridad de Contraseñas

Las contraseñas deberán almacenarse utilizando algoritmos de hash seguros como bcrypt.

### RNF-05 Seguridad de Comunicación

Toda comunicación entre cliente y servidor deberá realizarse mediante HTTPS.

### RNF-06 Autenticación Segura

La autenticación deberá implementarse mediante JWT y Refresh Token Rotation.

### RNF-07 Gestión de Sesiones

Los Refresh Tokens deberán almacenarse y gestionarse mediante Redis.

### RNF-08 Integridad de Datos

La base de datos deberá garantizar la integridad referencial mediante restricciones y relaciones definidas en PostgreSQL.

### RNF-09 Mantenibilidad

El código deberá seguir una arquitectura monolítica modular para facilitar su mantenimiento y evolución.

### RNF-10 Reutilización

Los componentes de software deberán diseñarse para favorecer la reutilización de código.

### RNF-11 Compatibilidad

La aplicación deberá ser accesible desde los navegadores modernos compatibles con HTML5.

### RNF-12 Usabilidad

La interfaz deberá ser intuitiva y permitir que los usuarios realicen sus tareas con una curva de aprendizaje mínima.

### RNF-13 Auditoría

El sistema deberá registrar eventos relevantes relacionados con autenticación y operaciones críticas.

### RNF-14 Respaldo de Información

La base de datos deberá contar con mecanismos de respaldo proporcionados por Supabase.

### RNF-15 Despliegue Continuo

El sistema deberá soportar despliegues automatizados mediante integración con GitHub.

### RNF-16 Calidad del Código

El proyecto deberá utilizar TypeScript para mejorar la mantenibilidad y reducir errores en tiempo de desarrollo.

### RNF-17 Portabilidad

El sistema deberá poder desplegarse en diferentes entornos sin modificaciones significativas.

### RNF-18 Observabilidad

El sistema deberá permitir el monitoreo y registro de errores para facilitar tareas de soporte y mantenimiento.

### RNF-19 Consistencia de API

Todas las respuestas de la API deberán seguir una estructura uniforme para facilitar la integración con el frontend.

### RNF-20 Extensibilidad

La arquitectura deberá permitir la futura integración de módulos de inteligencia artificial para análisis y predicciones.
