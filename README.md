# PROYECTO_DD_API de Publicaciones y Comentarios (Blog Personal)

Esta es una API REST construida con Node.js y Express para crear publicaciones tipo blog y comentar en ellas. Permite operaciones CRUD (Crear, Leer, Actualizar, Eliminar) y navegar entre paginas.

Requisitos
-------------
- Node.js v18 o superior
- npm (gestor de paquetes)
- docker

Instalación
--------------
1. Clona este repositorio:

   git clone https://github.com/AJAguilar-23/ProyectoDD.git

2. Instala las dependencias:
```sh
   npm install
```

3. Ejecuta el comando:
```sh
   docker compose up -d
```
en el directorio donde se encuentre el docker-compose.yml

4. Ejecutar la API
------------------
En modo desarrollo (con recarga automática si usás --watch):
```sh
   npm run dev
```

La API estará disponible en:
http://localhost:3000

Rutas disponibles (Endpoints)
--------------------
Auth
--------------------

| Método | Ruta                     | Protección | Descripción                                       |
| -----: | ------------------------ | ---------: | ------------------------------------------------- |
|   POST | `/api/auth/register`     |    Pública | Registro de usuario                               |
|   POST | `/api/auth/login`        |    Pública | Iniciar sesión                                    |

---

Publicaciones
--------------------

| Método | Ruta                     | Protección        | Descripción                                                       |
| -----: | ------------------------ | ----------------: | ----------------------------------------------------------------- |
|    GET | `/api/publicaciones`     |           Pública | Listar con paginación (`?pag=`), orden **DESC** por fecha         |
|    GET | `/api/publicaciones/:id` |           Pública | Ver una publicación                                               |
|   POST | `/api/publicaciones`     |             Login | Crear publicación (Requiere autorizacion)                         |
|    PUT | `/api/publicaciones/:id` | Propiedad y login | Editar (solo autor)                                               |
| DELETE | `/api/publicaciones/:id` | Propiedad y login | Eliminar (solo autor)                                             |

---

Comentarios
--------------------
| Método | Ruta                                 | Protección | Descripción                              |
| -----: | ------------------------------------ | ---------: | ---------------------------------------- |
|    GET | `/api/publicaciones/:id/comentarios` |    Pública | Listar comentarios de una publicación    |
|   POST | `/api/publicaciones/:id/comentarios` |      Login | Crear comentario (sanitización anti-XSS) |