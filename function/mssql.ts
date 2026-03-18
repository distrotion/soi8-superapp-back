import * as sql from 'mssql';

function getConfig(): sql.config {
  return {
    user: process.env.MSSQL_USER || '',
    password: process.env.MSSQL_PASSWORD || '',
    database: '',
    server: process.env.MSSQL_SERVER || '',
    pool: {
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: false,
      trustServerCertificate: true,
    }
  };
}

export async function mssqlquery(query: string, params?: Record<string, any>): Promise<any> {
  const pool = await sql.connect(getConfig());
  try {
    const request = pool.request();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        request.input(key, value);
      }
    }
    const result = await request.query(query);
    return result;
  } finally {
    await pool.close();
  }
}
