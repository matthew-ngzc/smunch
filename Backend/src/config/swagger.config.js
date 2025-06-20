import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SMUNCH API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000/api' }],
  },
  apis: [path.join(__dirname, '../controllers/*.js')],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };
