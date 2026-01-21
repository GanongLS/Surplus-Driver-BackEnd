const pool = require('../config/db');
const { comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');

const login = async (req, res) => {
  const { identifier, password } = req.body; // identifier can be email or phone

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Please provide identifier (email/phone) and password' });
  }

  try {
    // Check if user exists
    const result = await pool.query(
      'SELECT id, name, email, phone, password_hash, is_active FROM drivers WHERE email = $1 OR phone = $1',
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const driver = result.rows[0];

    // Verify password
    const isMatch = await comparePassword(password, driver.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if active
    if (!driver.is_active) {
       return res.status(403).json({ message: 'Account is inactive' });
    }

    // Generate token
    const token = generateToken({
      id: driver.id,
      name: driver.name,
      email: driver.email,
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: driver.id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  login
};
