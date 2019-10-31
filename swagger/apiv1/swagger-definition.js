const swaggerJSDoc = require('swagger-jsdoc')

// Swagger definition
// You can set every attribute except paths and swagger
// https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md
const swaggerDefinition = {
  info: { // API informations (required)
    title: 'Server API', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'API description', // Description (optional)
  },
  host: 'temp', // Host (optional)
  basePath: '/v1', // Base path (optional)
}

// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // Path to the API docs
  apis: ['./swagger/apiv1/*.yaml'],
}

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
module.exports = swaggerJSDoc(options)