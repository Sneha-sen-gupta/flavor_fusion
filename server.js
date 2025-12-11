const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');


dotenv.config();


connectDB();

const app = express();


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/recipes', require('./src/routes/recipeRoutes'));
app.use('/api/ai', require('./src/routes/aiRoutes'));

const PORT = process.env.PORT || 5000;


if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;


