require('dotenv').config();
const pool = require('./src/config/db');
const { hashPassword } = require('./src/utils/passwordUtils');

const updatePassword = async () => {
  try {
    const hashedPassword = await hashPassword('password123');
    console.log('Generated Hash:', hashedPassword);

    const res = await pool.query(
      `UPDATE drivers SET password_hash = $1 WHERE email = 'budi@example.com'`,
      [hashedPassword]
    );

    console.log('Update result:', res.rowCount);
    console.log('Password updated for budi@example.com');
  } catch (err) {
    console.error('Error updating password:', err);
  } finally {
    pool.end();
  }
};

updatePassword();
