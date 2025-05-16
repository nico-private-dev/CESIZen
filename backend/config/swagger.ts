import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CESIZen API Documentation',
      version: '1.0.0',
      description: 'Documentation de l\'API pour l\'application CESIZen',
      contact: {
        name: 'Équipe CESIZen'
      }
    },
    servers: [
      {
        url: 'http://localhost:5001/api',
        description: 'Serveur de développement'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken'
        }
      }
    }
  },
  apis: [
    './routes/*.ts',
    './controllers/*.ts',
    './models/*.ts'
  ]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
