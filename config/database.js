// config/database.js
import { Sequelize } from 'sequelize';

// Replace with your actual Render database connection details
const sequelize = new Sequelize('newspapers_db', 'newspapers_db_user', 'L9iunDPwM3D9EUElE9YQ64bXb1dJbKt2', {
  host: 'singapore-postgres.render.com',
  dialect: 'postgres',
  port: 5432, 
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Change to true if you have a valid certificate
    }
  }
});

export { sequelize };
