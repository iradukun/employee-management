import { createConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file from root
dotenv.config({ path: path.join(__dirname, '../.env') });

async function bootstrap() {
  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT) || 3306;
  const user = process.env.DB_USERNAME || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'employee_management';

  console.log(`Connecting to MySQL at ${host}:${port} as ${user}...`);

  try {
    const connection = await createConnection({
      host,
      port,
      user,
      password,
    });

    console.log(`Creating database '${database}' if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    console.log(`Database '${database}' is ready.`);
    
    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error.message);
    process.exit(1);
  }
}

bootstrap();
