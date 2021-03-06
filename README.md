# Backend for PickAndGol - Final project for Master Mobile III

## Api de gestión de eventos deportivos en bares

* [Descripción](#descripcion)
* [Uso](#uso)
* [Documentación de la API REST](#documentacion-de-la-api-rest)
  * [Api de usuarios](#api-de-usuarios)
    - [GET /users/:user_id](#detalle-de-usuario)
    - [POST /users/register](#alta-de-usuario)
    - [PUT /users/:user_id](#actualizacion-de-usuario)
    - [DELETE /users/:user_id](#baja-de-usuario)
    - [POST /users/recover](#recuperacion-de-contrasena-de-usuario)
    - [POST /users/login](#login-de-usuario)
    - [GET /users/:user_id/favorites](#bares-favoritos-de-usuario)
    - [POST /users/:user_id/favorites/:pub_id](#anadir-bar-como-favorito-de-usuario)
  * [Api de bares](#api-de-bares)
    - [GET /pubs/:pub_id](#detalle-de-bar)
    - [POST /pubs/](#nuevo-bar)
    - [GET /pubs/](#listado-de-bares)
  * [Api de eventos](#api-de-eventos)
    - [GET /events/:event_id](#detalle-de-evento)
    - [POST /events/](#nuevo-evento)
    - [GET /events/](#lista-de-eventos)
    - [PUT /events/:event_id/pubs/:pub_id](#asociar-evento-a-un-bar)
    - [DELETE /events/:event_id/pubs/:pub_id](#asociar-evento-de-un-bar)
  * [Api de categorías](#api-de-categorías)
    - [GET /categories/](#listado-de-categorías)

## Descripción

Software que se ejecutará en el servidor dando servicio a una app (API) de
gestión de eventos deportivos que se puedan ver en determinados bares.
Con esta API se comunicará tanto la aplicación web, la versión iOS y
la versión Android.

## Uso

### Iniciar MongoDB

Ejecute /scripts/startDB.sh

### Arranque en producción

Lanzar desde la raíz del proyecto:

    npm start

### Arranque con nodemon

Lanzar desde la raíz del proyecto:

    npm run debug

## Documentación de la API V1

### Api de usuarios

  - [GET /users/:user_id](#detalle-de-usuario)
  - [POST /users/register](#alta-de-usuario)
  - [PUT /users/:user_id](#actualizacion-de-usuario)
  - [DELETE /users/:user_id](#baja-de-usuario)
  - [POST /users/recover](#recuperacion-de-contrasena-de-usuario)
  - [POST /users/login](#login-de-usuario)
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
        "pubs": [
          "572934f2b56205e4135132a2", "572934f2b56205e4135132a1"
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

#### Alta de usuario

Crea una nueva cuenta de usuario en el sistema

* **Condiciones**

  * Sólo los usuarios sin autenticar podrán crear un usuario.
  * El email del usuario debe ser único en el sistema.
  * El nombre para mostrar debe ser único en el sistema.

* **URL**

  `/users/register`

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
        "_id": "58af6bc80eb95134d4f784df",
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
  * El email del usuario (si se actualiza) debe ser único en el sistema.
  * El nombre para mostrar (si se actualiza) debe ser único en el sistema.


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
        "_id": 37,
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

O

  * **Code:** 405
  * **Content:**

    ```json
      {
        "result": "ERROR",
        "data": {
          "code": 405,
          "description": "Password is not correct."
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

  `/users/recover/`

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

  `/users/login/`

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
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4YWY2YmM4MGViOTUxMzRkNGY3ODRkZiIsImlhdCI6MTQ5MTQxMjgzOSwiZXhwIjoxNDkxNTg1NjM5fQ.xD2eaWcBreDMVPM3IUl9Uy402Ky8wB7qyqHUfCYHzC0",
        "id": "58af6bc80eb95134d4f784df",
        "email": "pepe1234@hotmail.com",
        "name": "Nombre Usuario",
        "favorite_pubs": [
          "58a8ae3443ef221e58bb5b53",
          "58dfce92ad60342884d9dc8a"
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
  * Se devuelven todos los pubs favoritos del usuario (sin paginación ni límite)

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
        "total": 2,
        "items": [
          {
            "_id": 12,
            "name": "Bar Casa Paco",
            "latitude": "40.41665",
            "longitude": "-3.70381",
            "url": "http://www.barcasapaco.com",
            "phone": "912345678",
            "owner": 24
          },
          {
            "_id": 43,
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
        "_id": "58af6bc80eb95134d4f784df",
        "enabled": true,
        "password": "64daa44ad493ff28a96effab6e77f1732a3d97d83241581b37dbd70a7a4900fe",
        "email": "nombre@usuario.com",
        "name": "Nombre Usuario",
        "__v": 0,
        "favorite_pubs": [
          "58a8ae3443ef221e58bb5b53",
          "589f967df5131c3ef090e554",
          "58dfce92ad60342884d9dc8a",
          "58e5741c0de2ad10581252ac"
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

Mostrar los datos de un bar

* **URL**

  `/pubs/:pub_id`

* **Método:**

  `GET`

  *  **Parámetros en URL**

   * **Obligatorios:**

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
        "_id": 59,
        "name": "Bar Casa Paco",
        "latitude": 40.41665,
        "longitude": -3.70381,
        "url": "http://www.barcasapaco.com",
        "phone": "912345678",
        "owner": 16
        "events": [ 14, 417 ],
        "photos": [
            "https://images.pickandgol.s3.amazonaws.com/123e4567-e89b",
            "https://images.pickandgol.s3.amazonaws.com/987a6543-f21c"
        ]
      }
    }
    ```

* **Ejemplos de respuesta fallida:**

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

#### Nuevo bar

Crea un nuevo bar.

* **URL**

  `/pubs/`

* **Método:**

  `POST`

* **Parámetros en URL**

    Ninguno

* **Parámetros en datos**

  * **Obligatorios:**

      * `name=[string]`
      * `latitude=[float]`
      * `longitude=[float]`
      * `token=[string]`

* **Opcionales:**

      * `url=[string]`
      * `phone=[string]`
      * `photo_url=[string]` si son varias imágenes, las url separadas por comas (photo_url=url1,url2,url3)

* **Ejemplo de datos en la petición:**
  ```json
    {
      "name": "Bar Casa Paco",
      "latitude": 40.41665,
      "longitude": -3.70381,
      "url": "http://www.barcasapaco.com",
      "phone": "9183746520",
      "photo_url": "https://images.pickandgol.s3.amazonaws.com/123e4567-e89b"
    }
  ```

* **Ejemplo de respuesta con éxito:**

  * **Code:** 200
  * **Content:**

    ```json
    {
      "result": "OK",
      "data": {
        "_id": 59,
        "name": "Bar Casa Paco",
        "latitude": 40.41665,
        "longitude": -3.70381,
        "url": "http://www.barcasapaco.com",
        "phone": "912345678",
        "owner": 16,
        "photos": [
              "https://images.pickandgol.s3.amazonaws.com/123e4567-e89b",
              "https://images.pickandgol.s3.amazonaws.com/987a6543-f21c"
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


#### Listado de bares

Lista de bares. Permite filtrar los resultados

* **URL**

  `/pubs/`

* **Método:**

  `GET`

*  **Parámetros en URL**

   * **Opcionales:**

      * `offset=[integer]` (si no se indica, por defecto será 0)
      * `limit=[integer]` (si no se indica, por defecto será 20)
      * `text=[string]`
      * `category=[string]`
      * `latitude=[float]`
      * `longitude=[float]`
      * `radius=[integer]`

* **Parámetros en datos**

  Ninguno

* **Ejemplo de respuesta con éxito:**

  * **Code:** 200
  * **Content:**

    ```json
    {
      "result": "OK",
      "data": {
        "total": 2,
        "items": [
          {
            "_id": 59,
            "name": "Bar Casa Paco",
            "latitude": 40.41665,
            "longitude": -3.70381,
            "url": "http://www.barcasapaco.com",
            "phone": "912345678",
            "owner": 16,
            "photos": [
                "https://images.pickandgol.s3.amazonaws.com/123e4567-e89b",
                "https://images.pickandgol.s3.amazonaws.com/987a6543-f21c"
          ]
          },
          {
            "_id": 43,
            "name": "Asador Madrid",
            "latitude": "41.25765",
            "longitude": "-3.64123",
            "url": "http://www.asador-madrid.es",
            "phone": "600123456",
            "owner": 714,
            "photos": []
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

### Api de eventos

  - [GET /events/:event_id](#detalle-de-evento)
  - [POST /events/](#nuevo-evento)
  - [PUT /events/:event_id](#modificar-evento)
  - [DELETE /events/:event_id](#eliminar-evento)
  - [GET /events/](#lista-de-eventos)

#### Detalle de evento

Devuelve los detalles de un evento.

* **URL**

  `/events/:event_id`

* **Método:**

  `GET`

*  **Parámetros en URL**

   * **Obligatorios:**

      * `event_id=[string]`

* **Parámetros en datos**

  Ninguno

* **Ejemplo de respuesta con éxito:**

  * **Code:** 200
  * **Content:**

    ```json
    {
      "result": "OK",
      "data": {
        "_id": 14,
        "name": "Liga 2016/17: Real Madrid - Barcelona",
        "date": "2017-04-22T20:30:00.000Z",
        "description": "Partido correspondiente a la J.33 de liga",
        "photo_url": "https://images.pickandgol.s3.amazonaws.com/123e4567-e89b",
        "category": ["56a8ae8943ef221e58bb5b53"],
        "pubs": [ "572934f2b56205e4135132a0" ]
      }
    }
    ```

* **Ejemplos de respuesta fallida:**

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

#### Nuevo evento

Crea un nuevo evento, siempre asociado a un bar existente

* **Condiciones**

  * Solo los usuarios autenticados podrán crear un evento.
  * El nuevo evento debe de estar asociado una categoría y bar existente.

* **URL**

  `/events/`

* **Método:**

  `POST`

* **Parámetros en URL**

    Ninguno

* **Parámetros en datos**

  * **Obligatorios:**

      * `name=[string]`
      * `date=[string]`
      * `pub=[string]`
      * `category=[string]`

  * **Opcionales:**

      * `description=[string]`
      * `photo_url=[string]`

* **Ejemplo de datos en la petición:**
  ```json
    {
      "name": "Liga 2016/17: Real Madrid - Barcelona",
      "date": "2017-04-22T20:30:00.000Z",
      "pub": "572934f2b56205e4135132a1",
      "category": "563151f32ece56ea35",
      "description": "Partido correspondiente a la J.33 de Liga",
      "photo_url" : "https://images.pickandgol.s3.amazonaws.com/123e4567-e89b",
    }
  ```

* **Ejemplo de respuesta con éxito:**

  * **Code:** 200
  * **Content:**

    ```json
    {
      "result": "OK",
      "data": {
        "_id": 14,
        "name": "Liga 2016/17: Real Madrid - Barcelona",
        "date": "2017-04-22T20:30:00.000Z",
        "description": "Partido correspondiente a la J.33 de liga",
        "photo_url": "https://images.pickandgol.s3.amazonaws.com/123e4567-e89b",
        "category": [ "58a8ae3443ef221e68bb5b53" ],
        "pubs": [ "572934f2b56205e4135132a1" ]
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

#### Lista de eventos

Devuelve una lista de eventos futuros. Permite filtrar los resultados.

* **URL**

  `/events/`

* **Método:**

  `GET`

*  **Parámetros en URL**

   * **Opcionales:**

      * `offset=[integer]` (si no se indica, por defecto será 0)
      * `limit=[integer]` (si no se indica, por defecto será 20)
      * `pub=[string]`
      * `text=[string]` (se realizará una búsqueda por palabras)
      * `category=[string]`
      * `populate_pub_data=[true|1]` (si se indica con estos valores, se devolverán los pubs, en vez de un array de ids, un array con todos los datos de cada bar)
      * `populate_creator=[true|1]` (si se indica con estos valores, se devolverán los datos del creador del evento)

* **Parámetros en datos**

  Ninguno

  * **Ejemplo de respuesta con éxito:**

  * **Code:** 200
  * **Content:**

    ```json
    {
      "result": "OK",
      "data": {
        "total": 2,
        "items": [
          {
            "_id": 14,
            "name": "Liga 2016/17: Real Madrid - Barcelona",
            "date": "2017-04-22T20:30:00.000Z",
            "description": "Partido correspondiente a la J.33 de Liga",
            "photo_url": "https://images.pickandgol.s3.amazonaws.com/123e4567b",
            "category": "56a8ae8543ef221e58bb5b53",
            "pubs": [ "572934f2b56205e4135132a4", "572934f2b56205e4135132a3", "572d1ccddb794a84154a16d9" ]
          },
          {
            "_id": 417,
            "name": "G.P. Mónaco",
            "date": "2017-05-28T14:00:00.000Z",
            "description": "6ª prueba del mundial de F1",
            "photo_url": "https://images.pickandgol.s3.amazonaws.com/987s6543h",
            "category": "58a8ae3443ef221e58bb5b53",
            "pubs": []
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

#### Asociar evento a un bar

Modifica un evento en el sistema para asociarlo con un bar existente.

* **Condiciones**
  * Sólo los usuarios autenticados podrán realizar la asociación.
  * Cuando se asocie un evento con un bar, se deberá enviar una notificación push a todos aquellos usuarios que tengan al bar asociado en sus favoritos.


* **URL**

  `/events/:event_id/pubs/:pub_id`

* **Método:**

  `PUT`

* **Parámetros en URL**

    Ninguno

* **Parámetros en datos**

    Ninguno

* **Ejemplo de respuesta con éxito:**

  * **Code:** 200
  * **Content:**

    ```json
    {
      "result": "OK",
      "data": {
        "pub": {
          "_id": "58a8ae3443ef221e58bb5b53",
          "name": "Bar Latas",
          "url": "http://www.ellatas.com",
          "owner_id": "589f65a31c2e9251d4b47724",
          "__v": 0,
          "photos": [],
          "events": [
            "58a8b6183ded4d2ac0559e98"
          ],
          "location": {
            "type": "Point",
            "coordinates": [
              40.41665,
              -3.70381
            ]
          }
        },
        "event": {
          "_id": "58a8b6183ded4d2ac0559e98",
          "name": "Liga 2016/17: Real Madrid - Barcelona",
          "date": "2017-04-22T20:30:00.000Z",
          "description": "Partido correspondiente a la J.33 de Liga",
          "photo_url": "https://images.pickandgol.s3.amazonaws.com/123e4567-e89b",
          "__v": 0,
          "pubs": [
            "58a8ae3443ef221e58bb5b53"
          ],
          "category": [
            "569f65a31c8e9251d4b47748"
          ]
        }
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


#### Desasociar evento a un bar

Desasocia un bar de un evento existente.
Si el evento sólo estaba asociado a este bar, se eliminará dicho evento del sistema

* **Condiciones**
  * Sólo los usuarios autenticados podrán realizar la desasociación.


* **URL**

  `/events/:event_id/pubs/:pub_id`

* **Método:**

  `DELETE`

* **Parámetros en URL**

    Ninguno

* **Parámetros en datos**

    Ninguno

* **Ejemplo de respuesta con éxito:**

  * **Code:** 200
  * **Content:**

    ```json
    {
      "result": "OK",
      "data": {
        "pub": {
          "_id": "58a8ae3443ef221e58bb5b53",
          "name": "Bar Latas",
          "url": "http://www.ellatas.com",
          "owner_id": "589f65a31c2e9251d4b47724",
          "__v": 0,
          "photos": [],
          "events": [],
          "location": {
            "type": "Point",
            "coordinates": [
              40.41665,
              -3.70381
            ]
          }
        },
        "event": {
          "_id": "58a8b6183ded4d2ac0559e98",
          "name": "Liga 2016/17: Real Madrid - Barcelona",
          "date": "2017-04-22T20:30:00.000Z",
          "description": "Partido correspondiente a la J.33 de Liga",
          "photo_url": "https://images.pickandgol.s3.amazonaws.com/123e4567-e89b",
          "__v": 0,
          "pubs": [],
          "category": [
            "569f65a31c8e9251d4b47748"
          ]
        }
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

## Api de categorías

### Listado de categorías

Devuelve un listado de las categorías de eventos disponibles.

* **URL**

  `/categories/`

* **Método:**

  `GET`

*  **Parámetros en URL**

    Ninguno

* **Parámetros en datos**

    Ninguno

* **Ejemplo de respuesta con éxito:**

  * **Code:** 200
  * **Content:**

    ```json
    {
      "result": "OK",
      "data": {
        "total": 6,
        "items": [
          {
            "_id": "58d2a1f0d8f095c81d439f66",
            "name": "Fútbol"
          },
          {
            "_id": "58d2a1f9d8f095c81d439f67",
            "name": "Fórmula 1"
          },
          {
            "_id": "58d2a204d8f095c81d439f68",
            "name": "Motociclismo"
          },
          {
            "_id": "58d2a20ed8f095c81d439f69",
            "name": "Ciclismo"
          },
          {
            "_id": "58d2a215d8f095c81d439f6a",
            "name": "Tenis"
          },
          {
            "_id": "58d2a21cd8f095c81d439f6b",
            "name": "Baloncesto"
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