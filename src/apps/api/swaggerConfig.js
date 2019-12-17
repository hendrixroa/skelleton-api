const { readFileSync } = require('fs');
const { join } = require('path');

const securityDefinitions = {
  api_key: {
    type: 'apiKey',
    name: 'x-api-key',
    in: 'header',
  },
  bearer: {
    type: 'apiKey',
    name: 'authorization',
    in: 'header',
  },
};

module.exports = {
  swagger: {
    outputDirectory: './src/apps/api/.swagger',
    entryFile: './src/apps/api/api.ts',
    securityDefinitions,
    spec: {
      info: {
        description: readFileSync(join(__dirname, 'API_README.md')).toString(),
      },
      security: [{
        api_key: [],
        bearer: [],
      }],
    },
  },
};
