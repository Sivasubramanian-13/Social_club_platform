const express = require('express');
const mysql = require('mysql2'); // Use mysql2 instead of mysql
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const port = 3000;

// Create a MySQL connection using mysql2
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password', 
  database: 'event_management', 
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database using mysql2');
});

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home Page: Simple navigation
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Applicant Page: Register for Social Club
app.get('/applicant', (req, res) => {
  res.sendFile(__dirname + '/public/applicant.html');
});

app.post('/register', (req, res) => {
  const { name, age, phone, city } = req.body;
  const query = 'INSERT INTO social_club (name, age, phone, city) VALUES (?, ?, ?, ?)';

  db.query(query, [name, age, phone, city], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Error inserting data');
    }
    console.log('Data inserted successfully:', result);
    res.redirect('/applicant'); // Redirect after successful registration
  });
});

// Host Page: View participants and delete or update
app.get('/host', (req, res) => {
  res.sendFile(__dirname + '/public/host.html');
});

// Fetch participants from the backend
app.get('/participants', (req, res) => {
  const query = 'SELECT * FROM social_club';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching participants:', err);
      return res.status(500).send('Error fetching participants');
    }
    res.json(results); // Send the data to the frontend as JSON
  });
});

// Delete participant
app.post('/delete/:id', (req, res) => {
  const query = 'DELETE FROM social_club WHERE id = ?';
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error deleting participant:', err);
      return res.status(500).send('Error deleting participant');
    }
    res.redirect('/host'); // Redirect after deletion
  });
});

// Update participant
app.post('/update/:id', (req, res) => {
  const { name, age, phone, city } = req.body;
  const query = 'UPDATE social_club SET name = ?, age = ?, phone = ?, city = ? WHERE id = ?';

  db.query(query, [name, age, phone, city, req.params.id], (err, result) => {
    if (err) {
      console.error('Error updating participant:', err);
      return res.status(500).send('Error updating participant');
    }
    res.redirect('/host'); // Redirect after update
  });
});

// Catch-all route for handling 404 errors
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
