const pool = require('../config/db');
const { comparePassword, hashPassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');

// Admin Login
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const admin = result.rows[0];
    const isMatch = await comparePassword(password, admin.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken({ id: admin.id, username: admin.username, role: 'admin' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Driver Management
const getAllDrivers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, phone, email, is_active, created_at FROM drivers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createDriver = async (req, res) => {
  const { name, phone, email, password } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const result = await pool.query(
      'INSERT INTO drivers (name, phone, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone',
      [name, phone, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ message: 'Email or Phone already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const updateDriverStatus = async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body; // Expect boolean

  try {
    const result = await pool.query(
      'UPDATE drivers SET is_active = $1 WHERE id = $2 RETURNING id, name, is_active',
      [is_active, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Driver not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Order Management
const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createOrder = async (req, res) => {
  const { customer_name, customer_address, juice_type, quantity, latitude, longitude } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO orders (customer_name, customer_address, juice_type, quantity, latitude, longitude) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [customer_name, customer_address, juice_type, quantity, latitude, longitude]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  login,
  getAllDrivers,
  createDriver,
  updateDriverStatus,
  getAllOrders,
  createOrder
};
