// config/database.js
import { Sequelize } from 'sequelize';

// Replace with your actual Render database connection details
const sequelize = new Sequelize('news_db_make', 'news_db_make_user', 'Tb4ZlFY7JbKQOGQ6RCYEcSV19pBehKxo', {
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
