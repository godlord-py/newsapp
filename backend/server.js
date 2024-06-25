import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import multer from 'multer';

console.log('Server starting...');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "http://localhost:5173", "http://127.0.0.1:5173"],
      scriptSrc: ["'self'", "http://localhost:5173", "http://127.0.0.1:5173", "'unsafe-inline'"],
      styleSrc: ["'self'", "http://localhost:5173", "http://127.0.0.1:5173", "'unsafe-inline'"],
      fontSrc: ["'self'", 'data:'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'", "http://localhost:5173", "http://127.0.0.1:5173"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"]
    }
  }
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const newspapersFilePath = path.join(__dirname, '../public', 'newspapers.json');

console.log('Configuring multer...');

app.post('/api/upload', (req, res) => {
  console.log('Upload route hit');

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log('Multer destination function called');
      console.log('req.body:', req.body);
      // Use a temporary path first
      const uploadDir = path.join(__dirname, '../public/newspapers/temp');
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      console.log('Multer filename function called');
      cb(null, file.originalname);
    }
  });

  const upload = multer({ storage: storage });

  upload.single('file')(req, res, function (err) {
    console.log('Multer middleware completed');
    console.log('Received upload request');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('File:', req.file);

    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!req.body.date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    if (!req.body.name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const { date, name } = req.body;
    
    // Move the file to the correct directory
    const finalDir = path.join(__dirname, '../public/newspapers', date);
    fs.mkdirSync(finalDir, { recursive: true });
    const finalPath = path.join(finalDir, req.file.filename);
    fs.renameSync(req.file.path, finalPath);

    res.status(200).json({ 
      message: 'File uploaded successfully', 
      path: `/newspapers/${date}/${req.file.filename}`,
      receivedData: { date, name, fileName: req.file.filename }
    });
  });
});

app.post('/api/add-publication', (req, res) => {
  const newPublicationData = req.body;

  fs.readFile(newspapersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading newspapers file:', err);
      return res.status(500).json({ message: 'Error reading newspapers file' });
    }

    let publications;
    try {
      publications = JSON.parse(data);
    } catch (err) {
      console.error('Error parsing newspapers file:', err);
      return res.status(500).json({ message: 'Error parsing newspapers file' });
    }

    const { type, name, imageUrl, language, dates, pdfFiles } = newPublicationData;
    
    if (!type || !name || !imageUrl || !language || !dates || !pdfFiles) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const targetArray = type === 'newspaper' ? publications.newspapers : publications.magazines;

    const newPublication = {
      id: targetArray.length ? targetArray[targetArray.length - 1].id + 1 : 1,
      name,
      type,
      imageUrl,
      dates,
      pdfFiles,
      language,
    };

    targetArray.push(newPublication);

    fs.writeFile(newspapersFilePath, JSON.stringify(publications, null, 2), (err) => {
      if (err) {
        console.error('Error writing newspapers file:', err);
        return res.status(500).json({ message: 'Error writing newspapers file' });
      }
      res.status(200).json({ message: 'Publication added successfully' });
    });
  });
});

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});