import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const jobsFilePath = path.join(__dirname, '..', 'public', 'jobs.json');

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