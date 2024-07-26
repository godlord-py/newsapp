import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { Sequelize, DataTypes } from 'sequelize';
import pg from 'pg';

console.log('Server starting...');
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

const PdfFile = sequelize.define('PdfFile', {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  path: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Sync the models with the database
sequelize.sync();

const SECRET_KEY = 'ewgwegegwegegegqwfqwfwhuohp;wfhjipwhfwfwldfuqwfwfwwqfwf';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password';
const { Pool } = pg;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());

const pool = new Pool({
  user: 'newspapers_db_user',
  host: 'singapore-postgres.render.com',
  database: 'newspapers_db',
  password: 'L9iunDPwM3D9EUElE9YQ64bXb1dJbKt2',
  port: 5432,
});



// Middleware to verify JWT token

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://6690f69e767262054b9e01c6--thriving-hotteok-03030a.netlify.app',
  'https://669a1b1b9dd1e0eb57104bf2--thriving-hotteok-03030a.netlify.app'
];

// Setup helmet middleware with CSP and other security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "http://localhost:5173", "http://127.0.0.1:5173", "https://6690f69e767262054b9e01c6--thriving-hotteok-03030a.netlify.app", "https://669a1b1b9dd1e0eb57104bf2--thriving-hotteok-03030a.netlify.app"],
      scriptSrc: ["'self'", "http://localhost:5173", "http://127.0.0.1:5173", "'unsafe-inline'", "https://6690f69e767262054b9e01c6--thriving-hotteok-03030a.netlify.app", "https://669a1b1b9dd1e0eb57104bf2--thriving-hotteok-03030a.netlify.app"],
      styleSrc: ["'self'", "http://localhost:5173", "http://127.0.0.1:5173", "'unsafe-inline'", "https://6690f69e767262054b9e01c6--thriving-hotteok-03030a.netlify.app", "https://669a1b1b9dd1e0eb57104bf2--thriving-hotteok-03030a.netlify.app"],
      fontSrc: ["'self'", 'data:'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'", "http://localhost:5173", "http://127.0.0.1:5173", "https://6690f69e767262054b9e01c6--thriving-hotteok-03030a.netlify.app", "https://669a1b1b9dd1e0eb57104bf2--thriving-hotteok-03030a.netlify.app"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"]
    }
  }
}));
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newspapersFilePath = path.join(__dirname,  'newspapers.json');
const jobsFilePath = path.join(__dirname, 'jobs.json');
const storage = multer.memoryStorage(); // Use memory storage
const upload = multer({ storage: storage });

console.log('Configuring multer...');

app.post('/api/signin', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ id: username }, SECRET_KEY, { expiresIn: 86400 }); // 24 hours
    console.log('Generated token for user:', username);
    console.log('Token:', token);
    res.json({ auth: true, token });
  } else {
    res.status(401).json({ auth: false, message: 'Invalid credentials' });
  }
});

// Middleware function to verify JWT token
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (!bearerHeader) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const [bearer, token] = bearerHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return res.status(403).json({ message: 'Invalid token format' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err);
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      if (err.name === 'JsonWebTokenError') {
        console.error('JWT Error details:', err.message);
      }
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
    console.log('Decoded token:', decoded);
    req.userId = decoded.id;
    next();
  });
};

// Read jobs from the JSON file
function readJobs() {
  try {
    const data = fs.readFileSync(jobsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading jobs file:', error);
    return [];
  }
}

// Write jobs to the JSON file
function writeJobs(jobs) {
  try {
    fs.writeFileSync(jobsFilePath, JSON.stringify(jobs, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing jobs file:', error);
  }
}

// Endpoint to add a new job
app.post('/api/jobs', (req, res) => {
  const newJob = req.body;
  const jobs = readJobs();

  // Generate a new ID
  const maxId = jobs.reduce((max, job) => Math.max(max, job.id), 0);
  newJob.id = maxId + 1;

  jobs.push(newJob);
  writeJobs(jobs);

  res.status(201).json(newJob);
});

// Endpoint to get all jobs
app.get('/api/jobs', (req, res) => {
  const jobs = readJobs();
  res.json(jobs);
});

app.delete('/api/jobs/:id', (req, res) => {
  const jobId = parseInt(req.params.id);
  const jobs = readJobs();
  const jobIndex = jobs.findIndex(job => job.id === jobId);
  
  if (jobIndex === -1) {
    return res.status(404).json({ message: "Job not found" });
  }

  jobs.splice(jobIndex, 1);
  writeJobs(jobs);

  res.json({ message: "Job deleted successfully" });
});


app.get('/api/newspapers', (req, res) => {
  const filePath = path.join(__dirname, 'newspapers.json');

  // Read the JSON file and send it as response
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    try {
      const newspapers = JSON.parse(data);
      res.json(newspapers);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});
// app.get('/api/newspapers', async (req, res) => {
//   try {
//       const result = await pool.query(`
//           SELECT n.id, n.name, n.type, n.imageUrl, n.language, 
//                  json_agg(json_build_object('date', p.date, 'path', p.path)) AS pdfFiles
//           FROM newspapers n
//           LEFT JOIN pdf_files p ON n.id = p.newspaper_id
//           GROUP BY n.id
//       `);
//       res.json(result.rows);
//   } catch (error) {
//       res.status(500).json({ error: 'Error fetching newspapers from database' });
//   }
// });
app.use('/api/admin', verifyToken);

// app.post('/api/upload', upload.single('file'), async (req, res) => {
//   if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//   }

//   const { name, date } = req.body;
//   const fileBuffer = req.file.buffer; // Buffer of the uploaded file
//   const fileName = req.file.originalname; // Original file name

//   try {
//       // Save file information to PostgreSQL
//       const result = await pool.query(
//           'INSERT INTO PdfFiles (name, date, file_name, file_data) VALUES ($1, $2, $3, $4) RETURNING id',
//           [name, date, fileName, fileBuffer]
//       );

//       res.status(201).json({
//           message: 'File uploaded and saved to database successfully',
//           fileId: result.rows[0].id,
//       });
//       res.status(400).json({ error: 'No file uploaded' });

//   } catch (error) {
//       console.error('Error saving file to database:', error);
//       res.status(500).json({ error: 'Failed to save file to database' });
//   }
// });


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
    const finalDir = path.join(__dirname, 'newspapers.json', date);
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

app.post('/api/add-publication', verifyToken, (req, res) => {
  const newPublicationData = req.body;
  console.log('Received request to add publication:', req.body);
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

app.put('/api/update-publication-pdf', verifyToken, (req, res) => {
  const { name, type, date, newPdfPath } = req.body;

  fs.readFile(newspapersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading newspapers file:', err);
      return res.status(500).json({ message: 'Error reading newspapers file' });
    }

    let publications = JSON.parse(data);
    const targetArray = type === 'newspaper' ? publications.newspapers : publications.magazines;
    const publicationIndex = targetArray.findIndex(pub => pub.name === name);

    if (publicationIndex === -1) {
      return res.status(404).json({ message: 'Publication not found' });
    }

    const pdfFileIndex = targetArray[publicationIndex].pdfFiles.findIndex(file => file.date === date);

    if (pdfFileIndex === -1) {
      return res.status(404).json({ message: 'PDF file not found for the given date' });
    }

    targetArray[publicationIndex].pdfFiles[pdfFileIndex].path = newPdfPath;

    fs.writeFile(newspapersFilePath, JSON.stringify(publications, null, 2), (err) => {
      if (err) {
        console.error('Error writing newspapers file:', err);
        return res.status(500).json({ message: 'Error writing newspapers file' });
      }
      res.status(200).json({ message: 'PDF path updated successfully' });
    });
  });
});

app.delete('/api/delete-publication-date', verifyToken, (req, res) => {
  const { name, type, date } = req.body;

  fs.readFile(newspapersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading newspapers file:', err);
      return res.status(500).json({ message: 'Error reading newspapers file' });
    }

    let publications = JSON.parse(data);
    const targetArray = type === 'newspaper' ? publications.newspapers : publications.magazines;
    const publicationIndex = targetArray.findIndex(pub => pub.name === name);

    if (publicationIndex === -1) {
      return res.status(404).json({ message: 'Publication not found' });
    }

    targetArray[publicationIndex].dates = targetArray[publicationIndex].dates.filter(d => d !== date);
    targetArray[publicationIndex].pdfFiles = targetArray[publicationIndex].pdfFiles.filter(file => file.date !== date);

    fs.writeFile(newspapersFilePath, JSON.stringify(publications, null, 2), (err) => {
      if (err) {
        console.error('Error writing newspapers file:', err);
        return res.status(500).json({ message: 'Error writing newspapers file' });
      }
      res.status(200).json({ message: 'Date deleted successfully' });
    });
  });
});

app.post('/api/add-publication-date', verifyToken, (req, res) => {
  const { name, type, date, pdfPath } = req.body;

  fs.readFile(newspapersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading newspapers file:', err);
      return res.status(500).json({ message: 'Error reading newspapers file' });
    }

    let publications = JSON.parse(data);
    const targetArray = type === 'newspaper' ? publications.newspapers : publications.magazines;
    const publicationIndex = targetArray.findIndex(pub => pub.name === name);

    if (publicationIndex === -1) {
      return res.status(404).json({ message: 'Publication not found' });
    }

    if (targetArray[publicationIndex].dates.includes(date)) {
      return res.status(400).json({ message: 'Date already exists for this publication' });
    }

    targetArray[publicationIndex].dates.push(date);
    targetArray[publicationIndex].dates.sort();
    targetArray[publicationIndex].pdfFiles.push({ date, path: pdfPath });

    fs.writeFile(newspapersFilePath, JSON.stringify(publications, null, 2), (err) => {
      if (err) {
        console.error('Error writing newspapers file:', err);
        return res.status(500).json({ message: 'Error writing newspapers file' });
      }
      res.status(200).json({ message: 'New date added successfully' });
    });
  });
});

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.listen(3006, () => {
  console.log('Server running on http://localhost:3006');
});