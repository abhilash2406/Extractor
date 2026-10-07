import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Extractor API',
      version: '1.0.0',
      description: 'API documentation for Extractor AI Talent & Document Extraction system',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/**/*.js',
    './src/modules/**/*.js',
    path.join(__dirname, '../routes/**/*.js').replace(/\\/g, '/'),
    path.join(__dirname, '../modules/**/*.js').replace(/\\/g, '/'),
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
export default swaggerSpec;
