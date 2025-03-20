const express = require('express');
const cors = require('cors'); // Import the cors middleware
const pingApi = require('./ping.api'); // Import the API module
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3001;

mongoose.connect('mongodb+srv://shinesheray:O68HrlRwPgpuygYU@cluster1.twzt4sn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Use the cors middleware to handle CORS
app.use(cors());

app.use('/', pingApi); // Mount the API routes at the root path ('/')

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
