export default ({ env }) => ({
  'color-picker': {
    enabled: true,
  },
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
    },
  },
  documentation: {
    enabled: true,
    config: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Badeheyaat API',
        description: 'API documentation for Badeheyaat project',
      },
      'x-strapi-config': {
        path: '/documentation',
        showGeneratedFiles: true,
        generateDefaultResponse: true,
      },
    },
  },
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 1000000,
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
