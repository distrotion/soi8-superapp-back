import * as sql from 'mssql';

let pool: sql.ConnectionPool | null = null;

async function getPool(): Promise<sql.ConnectionPool> {
  if (pool && pool.connected) return pool;

  pool = await sql.connect({
    user: process.env.MSSQL_USER || '',
    password: process.env.MSSQL_PASSWORD || '',
    database: '',
    server: process.env.MSSQL_SERVER || '',
    pool: {
      max: 10,
      min: 2,
      idleTimeoutMillis: 30000,
    },
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  });

  pool.on('error', (err) => {
    console.error('MSSQL pool error:', err);
    pool = null;
  });

  return pool;
}

export async function mssqlquery(query: string, params?: Record<string, any>): Promise<any> {
  const p = await getPool();
  const request = p.request();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
  }
  return request.query(query);
}
