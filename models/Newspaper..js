import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Newspaper = sequelize.define('Newspaper', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Newspaper;
