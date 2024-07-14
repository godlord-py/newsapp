import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const PdfFile = sequelize.define('PdfFile', {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  path: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default PdfFile;
