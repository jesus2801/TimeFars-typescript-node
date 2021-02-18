export default {
  database: {
    host: process.env.DB_HOST!,
    user: process.env.DBUSER!,
    database: process.env.DB_NAME!,
    password: process.env.DB_PASS!,
  },
  versionFiles: '2',
  secretKey: process.env.SECRET_KEY!,
  host: 'localhost:4002',
  hostProtocol: 'http://',
};
