# Coderhouse Back-End Project: E-commerce

Backend of an e-commerce application to sell products from a chosen industry.
The server is based on a layered design, oriented to MVC, and its code will contain the most robust programming structures from the ECMAScript language.

## Getting started

1. Clone this project.
2. Go to the path of the project.
3. Install all dependencies: `npm install i`
4. Run local environment: `npm run dev`

### Required dependencies:

- @faker-js/faker
- artillery-plugin-metrics-by-endpoint
- bcrypt
- commander
- cookie-parser
- dotenv
- express
- express-compression
- express-session
- jsonwebtoken
- mongoose
- mongoose-paginate-v2
- multer
- nodemailer
- passport
- passport-google-oauth2
- passport-jwt
- passport-local
- socket.io
- swagger-jsdoc
- swagger-ui-express
- winston

##### Dev dependencies:

- artillery
- chai
- mocha
- nodemon
- supertest

## [Frontend Repository](https://github.com/Guada-pdls/DecorateMe-Front) 

## Funcionalities:

### Routes:

| Router | Ruta | Rol/es con acceso | Content-Type | Descripción |
|---|----|----|----|----|
| users | GET /api/users | admin | application/json | Devuelve un arreglo con todos los usuarios. |
| users | GET /api/users/:uid | user, premium, admin | application/json | Devuelve el usuario indicado en uid si este coincide con el de la actual session.  |
| users | PUT /api/users/:uid | user, premium, admin | application/json | Modifica el usuario indicado si este coincide con el de la actual session. |
| users | POST /api/users/:uid/documents | user, admin | application/json | Agrega un documento al usuario indicado si este coincide con el de la actual session. |
| users | PUT /api/users/premium/:uid | user, admin | application/json | Cambia el role del user a premium si este coincide con el de la actual session y tiene los documentos requeridos.  |
| users | DELETE /api/users/:uid | user, premium, admin | application/json | Elimina el usuario indicado si este coincide con el de la actual session.  |
| users | DELETE /api/users | admin | application/json | Elimina a todos los usuarios no activos hace más de 2 días. |
| session | POST /api/session/login | public | application/json | Crea una session. |
| session | POST /api/session/register | public | application/json | Crea un usuario. |
| session | DELETE /api/session/logout | user, premium, admin | application/json | Elimina la session activa. |
| session | POST /api/session/forgot-password | public | application/json | Envía un correo al email del usuario para restablecer la contraseña. |
| session | GET /api/session/reset-password | public | application/json | Obtiene la cookie que permite al usuario cambiar la contraseña. |
| session | POST /api/session/reset-password | public | application/json | Crea una nueva contraseña. |
| session | GET /api/session/current | user, premium, admin | application/json | Devuelve datos de la session actual. |
| session | GET /api/session/google | public | text/html | Autenticación con Google. |
| session | GET /api/session/google/callback | public | application/json (redirecciona) | Callback de autenticación con Google. |
| products | GET /api/products | public | application/json | Devuelve un objeto con la paginaciòn y la propiedad docs, que es el array con todos los productos. |
| products | POST /api/products | premium, admin | application/json | Crea un nuevo producto. |
| products | GET /api/products/:pid | public | application/json | Obtiene el producto indicado en pid. |
| products | PUT /api/products | premium, admin | application/json | Modifica el producto indicado si este está creado por el usuario activo |
| products | DELETE /api/products | premium, admin | application/json | Elimina el producto indicado si este está creado por el usuario activo |
| cart | GET /api/cart/ | admin | application/json | Devuelve todos los carritos en formato array. |
| cart | GET /api/cart/:cid | user, premium, admin | application/json | Devuelve el carrito indicado si este coincide con el de la actual session. |
| cart | PUT /api/cart/:cid/product/:pid/:units | user, premium | application/json | Agrega units de pid a cid si este coincide con el de la actual session. |
| cart | DELETE /api/cart/:cid/product/:pid/:units | user, premium | application/json | Elimina units de pid a cid si este coincide con el de la actual session. |
| cart | DELETE /api/cart/:cid | user, premium | application/json | Elimina todos los productos del carrito. |
| cart | POST /api/cart/:cid/purchase | user, premium | application/json | Crea el ticket de compra del carrito actual si este coincide con el de la actual session. |
| mocking | GET /api/mocking | public | application/json | Devuelve 100 productos de ejemplo. |
| mocking | GET /api/mocking | public | application/json | Devuelve un usuario de ejemplo. |
| docs | GET /docs | public | text/html | Documentación con Swagger de la api. |

 ***

# Authors

### 🐱‍👤 Isra QuirozZ

- Website:
- Github:
- Linkedin:

### 🐱‍👤 Guadalupe Piva

- Website:
- Github:
- Linkedin:
