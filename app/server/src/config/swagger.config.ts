import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerConfigOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trace ERP - API Docs',
      version: '1.0.0',
      description:
        'Official API documentation for Trace ERP, focused on retail operational flow.',
    },
    tags: [
      { name: 'Auth', description: 'Login and token routes' },
      { name: 'Customers', description: 'Customer management' },
      { name: 'Suppliers', description: 'Supplier management' },
      { name: 'Products', description: 'Product and catalog management' },
      { name: 'Inventory', description: 'Stock movement module' },
      { name: 'Sales', description: 'Sales transactional flow' },
      { name: 'Users', description: 'User management' },
      { name: 'Payments', description: 'Payment methods routes' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter the JWT token generated during login.',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Update this path according to the actual structure of your routes and controllers
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};


