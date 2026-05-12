export const swaggerConfigOptions = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Trace ERP',
      version: '1.0.0',
      description: 'Documentation for all the APIs that are used in trace ERP',
    },
  },

  apis: ['src/routes/*.ts'],
};
