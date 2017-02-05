# Backend for PickAndGol - Final project for Master Mobile III

## Api de gestión de eventos deportivos en bares

* [Descripción](#descripcion)
* [Uso](#uso)
* [Documentación de la API REST](#documentacion-de-la-api-rest)
  * [Api de usuarios](#api-de-usuarios)
    - [GET /users/:user_id](#detalle-de-usuario)
    - [POST /users/](#alta-de-usuario)
    - [PUT /users/:user_id](#actualizacion-de-usuario)
    - [DELETE /users/:user_id](#baja-de-usuario)
    - [POST /recover](#recuperacion-de-contrasena-de-usuario)
    - [POST /login](#login-de-usuario)
    - [GET /users/:user_id/favorites](#bares-favoritos-de-usuario)
  * [Api de bares](#api-de-bares)
    - [GET /pubs/:pub_id](#detalle-de-bar)
    - [POST /pubs/](#nuevo-bar)
    - [GET /pubs/](#listado-de-bares)
  * [Api de eventos](#api-de-eventos)
    - [GET /events/:event_id](#detalle-de-evento)
    - [POST /events/](#nuevo-evento)
    - [PUT /events/:event_id](#modificar-evento)
    - [DELETE /events/:event_id](#eliminar-evento)
    - [GET /events/](#lista-de-eventos)

## Descripción

Software que se ejecutará en el servidor dando servicio a una app (API) de
gestión de eventos deportivos que se puedan ver en determinados bares. 
Con esta API se comunicará tanto la aplicación web, la versión iOS y 
la versión Android.

## Uso

## Documentación de la API V1

### Api de usuarios

  - [GET /users/:user_id](#detalle-de-usuario)
  - [POST /users/](#alta-de-usuario)
  - [PUT /users/:user_id](#actualizacion-de-usuario)
  - [DELETE /users/:user_id](#baja-de-usuario)
  - [POST /recover](#recuperacion-de-contrasena-de-usuario)
  - [POST /login](#login-de-usuario)
  - [GET /users/:user_id/favorites](#bares-favoritos-de-usuario)

#### Detalle de usuario

Devuelve los datos de un usuario.

* **URL**

  /users/:user_id

* **Método:**

  `GET`
  
*  **Parámetros en URL**

   * **Obligatorios:**
 
      `id=[integer]`

* **Parámetros en datos**

  Ninguno

* **Códigos de respuesta:**

* **Ejemplo de respuesta con éxito:**

  * **Code:** 200
  * **Content:**

    ```json
    {
      "result": "OK",
      "data": {
        "name": "Pepito Pérez",
        "photo_url": "https://images.pickandgol.s3.amazonaws.com/007e4567e89b",
        "email": "pepe1234@hotmail.com",
        "bars": [ 19, 276 ]
      }
    }
    ```
 
* **Ejemplos de respuesta fallida:**

  * **Code:** 400
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": { "code": 400, "description": "Bad request." }
      }
    ```

  O

  * **Code:** 403
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": { "code": 403, "description": "Forbidden request." }
      }
    ```
    O

  * **Code:** 404
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": { "code": 404, "description": "Not found." }
      }
    ```

#### Alta de usuario

#### Actualización de usuario

#### Baja de usuario

#### Recuperacion de contraseña de usuario

#### Login de usuario

#### Bares favoritos de usuario

### Api de bares

  - [GET /pubs/:pub_id](#detalle-de-bar)
  - [POST /pubs/](#nuevo-bar)
  - [GET /pubs/](#listado-de-bares)

#### Detalle de bar

#### Nuevo bar

#### Listado de bares


### Api de eventos

  - [GET /events/:event_id](#detalle-de-evento)
  - [POST /events/](#nuevo-evento)
  - [PUT /events/:event_id](#modificar-evento)
  - [DELETE /events/:event_id](#eliminar-evento)
  - [GET /events/](#lista-de-eventos)

#### Detalle de evento

#### Nuevo evento

#### Modificar evento

#### Eliminar evento

#### Lista de eventos

