import { registerAs } from '@nestjs/config';

export default registerAs('db', () => {
  return {
    db_type: process.env.DB_TYPE,
    db_port: process.env.DB_PORT,
    db_username: process.env.DB_USERNAME,
    db_host: process.env.DB_HOST,
    db_password: process.env.PASSWORD,
    db_name: process.env.DB_NAME,
  };
});
