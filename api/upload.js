import multer from 'multer';
import PdfFile from '../models/PdfFile..js'; // Adjust the import path as needed

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const uploadFile = async (req, res) => {
  try {
    // Save the file path in the database
    const pdfFile = await PdfFile.create({
      newspaper_id: req.body.newspaper_id,
      date: req.body.date,
      path: `/uploads/${req.file.filename}`,
    });
    res.send({ message: 'File uploaded successfully', pdfFile });
  } catch (err) {
    res.status(500).send({ error: 'Error uploading file' });
  }
};

export { upload, uploadFile };
