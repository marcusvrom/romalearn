import * as dotenv from 'dotenv';
import * as path from 'node:path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { configuration } from '../config/configuration';
import { ENTITIES } from './entities';
import { MIGRATIONS } from './migrations';

// A CLI do TypeORM roda fora do Nest, então o .env é carregado manualmente.
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const config = configuration();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
  entities: ENTITIES,
  migrations: MIGRATIONS,
  // Migrations versionadas são a única forma de alterar o schema.
  synchronize: false,
  migrationsRun: false,
  logging: config.nodeEnv === 'development' ? ['error', 'warn', 'migration'] : ['error'],
};

export const AppDataSource = new DataSource(dataSourceOptions);
