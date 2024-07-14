import express from 'express';
import { Newspaper, NewspaperDate, PdfFile } from '../models/index.js'; // Adjust the import path as needed

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const newspapers = await Newspaper.findAll({
      include: [NewspaperDate, PdfFile],
    });
    res.json(newspapers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
