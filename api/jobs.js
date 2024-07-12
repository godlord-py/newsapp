import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const jobsFilePath = path.join(__dirname, 'jobs.json');


const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://6690170c24005d1b39dfcf30--thriving-hotteok-03030a.netlify.app'
];

// Setup helmet middleware with CSP and other security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "http://localhost:5173", "http://127.0.0.1:5173", "https://6690170c24005d1b39dfcf30--thriving-hotteok-03030a.netlify.app"],
      scriptSrc: ["'self'", "http://localhost:5173", "http://127.0.0.1:5173", "'unsafe-inline'", "https://6690170c24005d1b39dfcf30--thriving-hotteok-03030a.netlify.app"],
      styleSrc: ["'self'", "http://localhost:5173", "http://127.0.0.1:5173", "'unsafe-inline'", "https://6690170c24005d1b39dfcf30--thriving-hotteok-03030a.netlify.app"],
      fontSrc: ["'self'", 'data:'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'", "http://localhost:5173", "http://127.0.0.1:5173", "https://6690170c24005d1b39dfcf30--thriving-hotteok-03030a.netlify.app"],
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

app.get('/', (req,res) => {
    res.send("Backend is working for Job")
})


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

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});