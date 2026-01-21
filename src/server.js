require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

const connectWithRetry = () => {
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error connecting to the database, retrying in 5 seconds...', err.message);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Database connected successfully at:', res.rows[0].now);
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  });
};

connectWithRetry();
