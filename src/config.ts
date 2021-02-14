export const database = {
  host: process.env.DB_HOST,
  user: process.env.DBUSER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
};

export const versionFiles = '2';
export const secretKey = process.env.SECRET_KEY!;
