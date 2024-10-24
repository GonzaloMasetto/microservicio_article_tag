# profile_microservicio

## 1. Casos de uso del microservicio Profile

### Casos de uso principales:

1. **Agregar/Editar preferencias del usuario**:
   - Precondición: el usuario debe estar autenticado.
   - Camino Normal:
        - El usuario accede a su perfil, donde puede seleccionar una o más tags de productos que le interesen.
        - Estas preferencias (tags) se almacenan en su perfil en la base de datos.
        - El sistema utilizará los tags del perfil para sugerir productos basados en coincidencias de tags con los artículos.
 
2. **Agregar/Editar datos personales del usuario**:
   - Precondición: el usuario debe estar autenticado.
   - Camino Normal:
        - El usuario accede a su perfil, donde puede cargar o actualizar sus datos personales, como nombre, apellido, dirección de correo electrónico y teléfono.
        - Estos datos se almacenan en la base de datos.
   - Caminos alternativos:
        - Si el formato de algún dato es incorrecto (por ejemplo, email inválido), devolver un error con el mensaje: "Formato inválido".

3. **Agregar/Actualizar imagen de perfil**:
   - Precondición: El usuario debe estar autenticado. La imagen ya fue cargada en el servicio de Image, y el sistema ya ha validado el tipo de archivo.
   - Camino Normal:
        - El front-end sube la imagen al servicio de Image, que devuelve un imageId.
        - El microservicio de perfil recibe el imageId y lo asocia al perfil del usuario.
   - Caminos alternativos:
        - Si el imageId no es válido, devolver un error con el mensaje: "ID de imagen no válido".

4. **Eliminar imagen de perfil**:
   - Precondición: el usuario debe estar autenticado.
   - Camino Normal:
        - El usuario accede a su perfil y selecciona eliminar la imagen.
        - El sistema elimina la asociación de la imagen del perfil del usuario y comunica al servicio de Image para su eliminación física.
        - El sistema devuelve un 204 sin contenido.
   - Caminos alternativos:
        - Si el usuario no tiene imagen asignada, devolver un error: "No hay imagen asociada al perfil".

5. **Consulta de perfil del usuario**:
   - Precondición: el usuario debe estar autenticado.
   - Camino Normal:
        - El usuario consulta su perfil, y el sistema devuelve su información personal, preferencias y la imagen de perfil (si existe).
        - Si el perfil no está completo (por ejemplo, sin preferencias o imagen), devolver el perfil con los campos vacíos.
   - Caminos alternativos:
        - Si el perfil no existe, devolver un error: "Perfil no encontrado"

6. **Editar categorías de artículo (permite agregarle o sacarle tags al array para un articleId)**:
   - Descripción: Este caso de uso se implementa en un microservicio independiente, que administra las tags de los articulos del catálogo.
   - Precondición: El artículo debe existir en el catálogo.
   - Camino Normal:
        - El administrador selecciona un articulo para agregar las tags, y ingresa un conjunto de tags (array de strings) que desea agregar al articulo
        - El sistema actualiza la lista de tags asociados (si existian tags los remplaza por los nuevos ingresados, esto es para simplificar un poco el proyecto)
   - Caminos alternativos:
        - Si el articleId no existe, devolver un error: "Artículo no encontrado"

7. **Buscar sugerencias de artículos**:
   - Precondición: el usuario debe estar autenticado y tener tags asociados en su perfil.
   - Camino Normal:
        - El usuario accede a la seccion "Buscar articulos sugeridos"
        - El sistema busca artículos que tengan coincidencias de tags con el perfil del usuario y devuelve una lista de sugerencias.
   - Caminos alternativos:
        - Si el usuario no tiene tags en su perfil, devolver una lista vacía.


## 2. Esquema de la base de datos

### Colección: `profiles` Para Microserivicio Profile

| Campo          | Tipo        | Descripción                                          |
|----------------|-------------|------------------------------------------------------|
| `id`           | `ObjectId`  | Identificador único del perfil                       |
| `userId`       | `Integer`   | relación con el usuario autenticado.                 |
| `name`         | `String`    | Nombre del usuario.                                  |
| `lastName`     | `String`    | Apellido del usuario.                                |
| `email`        | `String`    | Email del usuario (debe ser único).                  |
| `Phone`        | `Integer`   | Telefono del usuario.                                |
| `tags`         | `Array`     | Listado de tags del Perfil                           |
| `imageId`      | `Integer`   | Relación con el microservicio de imágenes.           |
| `createdAt`    | `Date`      | Fecha y hora de creación del perfil.                 |
| `updatedAt`    | `Date`      | Fecha y hora de la última actualización del perfil.  |


### Colección: `tags Para Microserivicio de Tags

| Campo          | Tipo        | Descripción                                          |
|----------------|-------------|------------------------------------------------------|
| `articleId `   | `ObjectId`  | Identificador único del perfil                       |
| `tags`         | `Array`     | listado de tags del articulo.                        |



## 3. Interfaz REST


**Agregar/Editar preferencias del usuario**
`POST/PUT /v1/profile/preferences`

*Headers*
Authorization: Bearer token

*Body*
```json
{
  "tags": ["tag1", "tag2", "tag3"]
}

```
*Response*
`200 OK` si se agregan o editan las preferencias correctamentes
`400 Bad Request` si alguno de los tags no es válido (tag no permitido).

**Agregar/Editar datos personales**
`POST/PUT /v1/profile`

*Headers*
Authorization: Bearer token

*Body*
```json
{
  "name": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890"
}


```
*Response*
`200 OK` si se agregan o editan las datos personales correctamentes
`400 Bad Request` si alguno de los datos no es válido.

**Agregar/Actualizar imagen**
`POST/PUT /v1/profile/image`

*Headers*
Authorization: Bearer token

*Body*
```json
{
  "imageId": 512311 
}

```
*Response*
`200 OK` si se agrega o actualiza la imagen correctamente. 
`400 Bad Request` si el id no es valido.

**Eliminar imagen de perfil**
`DELETE /v1/profile/imagen`

*Headers*
Authorization: Bearer token

*Response*
`204 OK` si se elimina correctamente. 
`404 OK` si no hay imagen asociada al perfil.

**Consulta de perfil del usuario**
`GET /v1/profile`

*Headers*
Authorization: Bearer token

*Response*
`200 OK` si el perfil se recupera correctamente

```json
{
  "id": "1234",
  "userId": "123132",
  "name": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "tags": ["tag1", "tag2"],
  "imageId": "54321",
  "createdAt": "2024-10-14 19:23:01.584-03",
  "updateAt": null,
}

```

`404 NOT FOUND` si no existe el perfil con el token ingresado

**Editar categorías de artículo**
`POST/PUT /v1/articles/{articleId}/tags`

*Headers*
Authorization: Bearer token

*Body*
```json
{
  "tags": ["tag1", "tag2", "tag3"]
}

```

*Response*
`200 OK` si las tags se actualizan correctamente
`404 NOT FOUND` si no existe el articleId 
`400 BAD ReQUESTt` si alguno de los tags es inválido

**Buscar sugerencias de artículos**
`GET /v1/profile/suggestions`

*Headers*
Authorization: Bearer token

*Response*
`200 OK` si devuelve sugerencias

```json
{
  "suggestions": [
    {
      "articleId": "9876",
      "name": "Producto A",
      "tags": ["tag1", "tag2"]
    },
    {
      "articleId": "9877",
      "name": "Producto B",
      "tags": ["tag3"]
    }
  ]
}

```
(También puede devolver vacio si no hay sugerencia que coincidan)

`404 NOT FOUND` si no tiene tags asociados en su perfil el usuario

