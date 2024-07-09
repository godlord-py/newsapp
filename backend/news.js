import express from 'express';
import axios from 'axios';
import cors from 'cors'

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

const apiKey = '7e0a17d7eee94dd0b1f5a6ccf37834cc';
const worldNewsUrl = `https://api.worldnewsapi.com/top-news?source-country=in&language=en,hi&api-key=${apiKey}`;

// Route for fetching world news
app.get('/api/world-news', async (req, res) => {
  try {
    const response = await axios.get(worldNewsUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching world news:', error);
    res.status(500).json({ error: 'Failed to fetch world news' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
