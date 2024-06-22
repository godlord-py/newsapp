  import express from 'express';
  import fs from 'fs';
  import path from 'path';
  import { fileURLToPath } from 'url';
  import bodyParser from 'body-parser';
  import helmet from 'helmet';
  import cors from 'cors';

  const app = express();
  app.use(bodyParser.json());

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

  app.use(
    helmet({
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
    })
  );

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const newspapersFilePath = path.join(__dirname, '../public', 'newspapers.json');


  app.post('/api/add-publication', (req, res) => {
    const newPublicationData = req.body;
  
    fs.readFile(newspapersFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading newspapers file:', err);
        return res.status(500).send('Error reading newspapers file');
      }
  
      let publications;
      try {
        publications = JSON.parse(data);
      } catch (err) {
        console.error('Error parsing newspapers file:', err);
        return res.status(500).send('Error parsing newspapers file');
      }
  
      const { type, name, imageUrl, language, dates } = newPublicationData;
      const targetArray = type === 'newspaper' ? publications.newspapers : publications.magazines;
  
      const pdfFiles = dates.map(date => ({ date, path: '' }));
  
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
          return res.status(500).send('Error writing newspapers file');
        }
        res.status(200).send('Publication added successfully');
      });
    });
  });

  app.get('/', (req, res) => {
    res.send('Backend is working!');
  });

  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
