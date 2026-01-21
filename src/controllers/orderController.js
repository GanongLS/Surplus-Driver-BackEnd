const pool = require('../config/db');

// Get available orders (MENUNGGU) or orders assigned to the current driver (DITERIMA, DALAM_PERJALANAN)
// This endpoint is primarily for the "Active Orders" tab
const getOrders = async (req, res) => {
  const driverId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT * FROM orders 
       WHERE status = 'MENUNGGU' 
       OR (assigned_driver_id = $1 AND status IN ('DITERIMA', 'DALAM_PERJALANAN'))
       ORDER BY created_at ASC`,
      [driverId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get order history (SELESAI) for current driver
const getOrderHistory = async (req, res) => {
  const driverId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT * FROM orders 
       WHERE assigned_driver_id = $1 AND status = 'SELESAI'
       ORDER BY updated_at DESC`,
      [driverId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get History Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Accept an order
const acceptOrder = async (req, res) => {
  const { id } = req.params;
  const driverId = req.user.id;

  try {
    // Check if order is available
    const orderCheck = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderCheck.rows[0];
    if (order.status !== 'MENUNGGU') {
      return res.status(400).json({ message: 'Order is not available' });
    }

    // Assign to driver
    const updateResult = await pool.query(
      `UPDATE orders 
       SET status = 'DITERIMA', assigned_driver_id = $1, updated_at = NOW() 
       WHERE id = $2 AND status = 'MENUNGGU' 
       RETURNING *`,
      [driverId, id]
    );

    if (updateResult.rows.length === 0) {
       return res.status(409).json({ message: 'Order already taken by another driver' });
    }

    res.json({ message: 'Order accepted', order: updateResult.rows[0] });

  } catch (error) {
    console.error('Accept Order Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Expected: DALAM_PERJALANAN, SELESAI
  const driverId = req.user.id;

  const validStatuses = ['DALAM_PERJALANAN', 'SELESAI'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    // Check ownership
    const orderCheck = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const order = orderCheck.rows[0];

    if (order.assigned_driver_id !== driverId) {
      return res.status(403).json({ message: 'You are not assigned to this order' });
    }
    
    // Simple state transition check
    // DITERIMA -> DALAM_PERJALANAN -> SELESAI
    if (order.status === 'SELESAI') {
         return res.status(400).json({ message: 'Order is already finished' });
    }
    
    // More strict validation can be added here if needed

    const updateResult = await pool.query(
      `UPDATE orders 
       SET status = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [status, id]
    );

    res.json({ message: 'Status updated', order: updateResult.rows[0] });

  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getOrders,
  getOrderHistory,
  acceptOrder,
  updateOrderStatus
};
