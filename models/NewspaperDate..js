import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const NewspaperDate = sequelize.define('NewspaperDate', {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default NewspaperDate;
