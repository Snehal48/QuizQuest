const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 3000; // Use a port other than 5000 

// Middleware setup 
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory 

// MySQL connection setup 
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // INPUT_REQUIRED {replace with your MySQL username} 
  password: 'root', // INPUT_REQUIRED {replace with your MySQL password} 
  database: 'quizquest' // INPUT_REQUIRED {replace with your database name} 
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Basic route 
app.get('/', (req, res) => {
  res.send('QuizQuest API is running');
});

// Endpoint to fetch a quiz question 
app.get('/api/question', (req, res) => {
  console.log('Received request for a new quiz question.');
  const query = 'SELECT text, option1, option2, option3, option4, correctIndex FROM questions ORDER BY RAND() LIMIT 1';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching question:', err);
      res.status(500).json({ error: 'Failed to fetch question' });
    } else if (result.length === 0) {
      console.warn('No questions found in the database.');
      res.status(404).json({ error: 'No questions available' });
    } else {
      const question = result[0];
      if (!question || !question.text) {
        console.warn('Fetched question is undefined or missing text.');
        res.status(500).json({ error: 'Invalid question data' });
      } else {
        console.log('Question fetched from database:', question);
        res.json({
          question: question.text,
          options: [question.option1, question.option2, question.option3, question.option4],
          correctIndex: parseInt(question.correctIndex, 10) // Ensure correctIndex is an integer 
        });
      }
    }
  });
});

// Start the server 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});