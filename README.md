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
    - [POST /users/:user_id/favorites/:pub_id](#anadir-bar-como-favorito-de-usuario)
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
  - [POST /users/:user_id/favorites/:pub_id](#anadir-bar-como-favorito-de-usuario)

#### Detalle de usuario

Devuelve los datos de un usuario.

* **Condiciones**

  * Sólo los usuarios autenticados podrán acceder a la información de perfil de un usuario.
  * Los datos sensibles (email) de un usuario sólo pueden ser consultados por el propio usuario.


* **URL**

  `/users/:user_id`

* **Método:**

  `GET`
  
*  **Parámetros en URL**

   * **Obligatorios:**
 
      * `user_id=[string]`

* **Parámetros en datos**

  Ninguno

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
        "data": {
          "code": 400,
          "description": "Bad request."
        }
      }
    ```

O

  * **Code:** 403
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 403,
          "description": "Forbidden request."
        }
      }
    ```
O

  * **Code:** 404
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 404,
          "description": "Not found."
        }
      }
    ```

#### Alta de usuario

Crea una nueva cuenta de usuario

* **Condiciones**

  * Sólo los usuarios sin autenticar podrán crear un usuario.

* **URL**

  `/users/`

* **Método:**

  `POST`
  
* **Parámetros en URL**

    Ninguno

* **Parámetros en datos**

  * **Obligatorios:**
 
      * `email=[string]`
      * `name=[string]`
      * `password=[string]`

* **Ejemplo de datos en la petición:**
  ```json
    {
      "email": "pepe1234@gmail.com",
      "name": "Pepito 1234",
      "password": "f4d497bb0d021827c3feb27c77f22a7d"
    }
  ```

* **Ejemplo de respuesta con éxito:**

  * **Code:** 200
  * **Content:**

    ```json
    {
      "result": "OK",
      "data": {
        "id": 37,
        "email": "pepe1234@gmail.com",
        "name": "Pepito 1234"
      }
    }
    ```
 
* **Ejemplos de respuesta fallida:**

  * **Code:** 400
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 400,
          "description": "Bad request."
        }
      }
    ```

O

  * **Code:** 409
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 409,
          "description": "Conflict (email already exists)."
        }
      }
    ```
O

  * **Code:** 409
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 409,
          "description": "Conflict (username already exists)."
        }
      }
    ```

#### Actualización de usuario

Permite a un usuario modificar sus datos de perfil y su contraseña.

* **Condiciones**
  * Sólo los usuarios autenticados podrán realizar la petición de actualización.
  * Un usuario autenticado sólo puede actualizar su propio perfil.

* **URL**
  
  `/users/:user_id`

* **Método:**

  `PUT`

* **Parámetros en URL**

    Ninguno

* **Parámetros en datos**

  * **Opcionales:**
 
      * `email=[string]`
      * `name=[string]`
      * `old_password=[string]`
      * `new_password=[string]`
      * `photo_url=[string]`

* **Ejemplo de datos en la petición:**
  ```json
    {
      "email": "pepe12345@gmail.com",
      "name": "Pepito Pérez",
      "old_password": "f4d497bb0d034267c3feb27c77f22a7d",
      "new_password": "a3fd6d74296bde7c7b90a34c26930f9a",
      "photo_url": "https://images.pickandgol.s3.amazonaws.com/007e4567e89b"
    }
  ```

* **Ejemplo de respuesta con éxito:**

  * **Code:** 200
  * **Content:**

    ```json
    {
      "result": "OK",
      "data": {
        "id": 37,
        "email": "pepe12345@hotmail.com",
        "name": "Pepito Pérez",
        "photo_url": "https://images.pickandgol.s3.amazonaws.com/007e4567e89b"

      }
    }
    ```

* **Ejemplos de respuesta fallida:**

  * **Code:** 400
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 400,
          "description": "Bad request."
        }
      }
    ```

O

    * **Code:** 403
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 403,
          "description": "Forbidden request."
        }
      }
    ```
O

  * **Code:** 404
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 404,
          "description": "Not found."
        }
      }
    ```

#### Baja de usuario

Permite a un usuario darse de baja, eliminando su cuenta. 
Se eliminará el listado de favoritos del usuario y sus reviews. 
Si era dueño de algún bar, este pasará a ser propiedad del usuario del 
sistema PICKANDGOL.

* **Condiciones**

  * Sólo los usuarios autenticados podrán dar de baja un usuario.
  * Un usuario autenticado sólo puede darse de baja a sí mismo.
  * El usuario ADMIN puede dar de baja a cualquier usuario.

* **URL**

  `/users/:user_id`

* **Método:**

  `DELETE`

*  **Parámetros en URL**

   * **Obligatorios:**
 
      * `user_id=[string]`

* **Parámetros en datos**

  Ninguno

* **Ejemplo de respuesta con éxito:**

  * **Code:** 200
  * **Content:**

    ```json
    {
      "result": "OK"
    }
    ```

* **Ejemplos de respuesta fallida:**

  * **Code:** 403
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 403,
          "description": "Forbidden request."
        }
      }
    ```
O

  * **Code:** 404
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 404,
          "description": "Not found."
        }
      }
    ```

#### Recuperacion de contraseña de usuario

Permite a un usuario recuperar su contraseña generando una nueva y 
enviándola por email al usuario (si es que el email indicado existe).

* **Condiciones**

  * Cualquier usuario puede hacer la petición (esté autenticado o no).
  * Por seguridad, se devolverá una respuesta de éxito aunque el email indicado no exista.

* **URL**

  `/recover/`

* **Método:**

  `POST`

* **Parámetros en URL**

    Ninguno

* **Parámetros en datos**

  * **Obligatorios:**
 
      * `email=[string]`

* **Ejemplo de datos en la petición:**
  ```json
    {
      "email": "pepe1234@gmail.com"
    }
  ```

* **Ejemplo de respuesta con éxito:**

  * **Code:** 200
  * **Content:**

    ```json
    {
      "result": "OK"
    }
    ```

* **Ejemplos de respuesta fallida:**

  * **Code:** 400
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 400,
          "description": "Bad request."
        }
      }
    ```

#### Login de usuario

Permite a un usuario autenticarse en el sistema indicando su nombre de 
usuario y contraseña.

* **Condiciones**

  * Un usuario debe tener activada su cuenta para poder iniciar sesión.

* **URL**

  `/login/`

* **Método:**

  `POST`

* **Parámetros en URL**

    Ninguno

* **Parámetros en datos**

  * **Obligatorios:**
 
      * `email=[string]`
      * `password=[string]`

* **Ejemplo de datos en la petición:**
  ```json
    {
      "email": "pepe1234@gmail.com",
      "password": "pass"
    }
  ```

* **Ejemplo de respuesta con éxito:**

  * **Code:** 200
  * **Content:**

    ```json
    {
      "result": "OK",
      "data": {
        "token": "eyJhbGci.OiJIUzI1NiI.sInR5cCI6"
      }
    }
    ```

* **Ejemplos de respuesta fallida:**

  * **Code:** 400
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 400,
          "description": "Bad request."
        }
      }
    ```

O

  * **Code:** 401
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 401,
          "description": "Bad credentials."
        }
      }
    ```
O

  * **Code:** 403
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 403,
          "description": "User account disabled."
        }
      }
	```

#### Bares favoritos de usuario

Devuelve una lista de los bares favoritos de un usuario.

* **Condiciones**

  * Sólo los usuarios autenticados podrán hacer esta petición.

* **URL**

  `/users/:user_id/favorites`

* **Método:**

  `GET`
  
*  **Parámetros en URL**

   * **Obligatorios:**
 
      * `user_id=[string]`

* **Parámetros en datos**

  Ninguno

* **Ejemplo de respuesta con éxito:**

  * **Code:** 200
  * **Content:**

    ```json
    {
      "result": "OK",
      "data": {
        "favorites": [
          {
            "id": 12,
            "name": "Bar Casa Paco",
            "latitude": "40.41665",
            "longitude": "-3.70381",
            "url": "http://www.barcasapaco.com",
            "phone": "912345678",
            "owner": 24
          },
          {
            "id": 43,
            "name": "Asador Madrid",
            "latitude": "41.25765",
            "longitude": "-3.64123",
            "url": "http://www.asador-madrid.es",
            "phone": "600123456",
            "owner": 714
          }
        ]
      }
    }
    ```

* **Ejemplos de respuesta fallida:**

  * **Code:** 400
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 400,
          "description": "Bad request."
        }
      }
    ```

O

  * **Code:** 403
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 403,
          "description": "Forbidden request."
        }
      }
    ```
O

  * **Code:** 404
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 404,
          "description": "Not found."
        }
      }
    ```

#### Añadir bar como favorito de usuario

Añade un bar como favorito de un usuario

* **Condiciones**

  * Sólo los usuarios autenticados podrán añadir un bar como su favorito.

* **URL**

  `/users/:user_id/favorites/:pub_id`

* **Método:**

  `POST`

* **Parámetros en URL**

  * **Obligatorios:**
 
      * `user_id=[string]`
      * `pub_id=[string]`

* **Parámetros en datos**

  Ninguno

* **Ejemplo de respuesta con éxito:**

  * **Code:** 200
  * **Content:**

    ```json
    {
      "result": "OK",
      "data": {
        "favorites": [
          {
            "id": 12,
            "name": "Bar Casa Paco",
            "latitude": "40.41665",
            "longitude": "-3.70381",
            "url": "http://www.barcasapaco.com",
            "phone": "912345678",
            "owner": 24
          },
          {
            "id": 43,
            "name": "Asador Madrid",
            "latitude": "41.25765",
            "longitude": "-3.64123",
            "url": "http://www.asador-madrid.es",
            "phone": "600123456",
            "owner": 714
          }
        ]
      }
    }
    ```

* **Ejemplos de respuesta fallida:**

  * **Code:** 400
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 400,
          "description": "Bad request."
        }
      }
    ```
O

* **Code:** 400
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 400,
          "description": "Bad request (Pub id not found)."
        }
      }
    ```

O

  * **Code:** 403
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 403,
          "description": "Forbidden request."
        }
      }
    ```
O

  * **Code:** 404
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 404,
          "description": "Not found."
        }
      }
    ```

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

