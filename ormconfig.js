const dotenv = require('dotenv');

const dotFile = process.env.NODE_ENV === 'test' ? './env/.test.env' : './env/.env';

dotenv.config({ path: dotFile });

const isSSL = process.env.DATABASE_SSL === 'true';

module.exports = {
  name: 'default',
  type: 'postgres',
  synchronize: false,
  migrations: ['src/migrations/*{.js,.ts}'],
  entities: ['src/entities/*{.js,.ts}'],
  subscribers: ['src/subscribers/*{.js,.ts}'],
  url: process.env.DATABASE_URL,
  password: process.env.DATABASE_PASSWORD,
  cli: {
    migrationsDir: 'src/migrations',
  },
  maxQueryExecutionTime: 1000,
  logging: process.env.DATABASE_LOG_LEVEL,
  autoLoadEntities: true,
  ssl: isSSL,
};
