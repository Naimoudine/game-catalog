// server.js
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/api/games', async (req, res) => {
  try {
    const response = await axios.get(`https://api.rawg.io/api/games?key=${process.env.API_KEY}`, { params: req.query });
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
