const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authenticateAdmin = require("../middlewares/adminAuthMiddleware");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /admin/auth/login:
 *   post:
 *     summary: Admin Login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 */
router.post("/auth/login", adminController.login);

// ALL ROUTES BELOW REQUIRE ADMIN TOKEN
router.use(authenticateAdmin);

/**
 * @swagger
 * /admin/drivers:
 *   get:
 *     summary: Get all drivers
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of drivers
 */
router.get("/drivers", adminController.getAllDrivers);

/**
 * @swagger
 * /admin/drivers:
 *   post:
 *     summary: Create new driver
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone, email, password]
 *             properties:
 *               name: { type: string }
 *               phone: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: Driver created
 */
router.post("/drivers", adminController.createDriver);

/**
 * @swagger
 * /admin/drivers/{id}:
 *   put:
 *     summary: Update driver status (activate/deactivate)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_active: { type: boolean }
 *     responses:
 *       200:
 *         description: Driver updated
 */
router.put("/drivers/:id", adminController.updateDriverStatus);

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: active
 *         schema: { type: boolean }
 *         description: If true, excludes 'SELESAI' orders
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [MENUNGGU, DITERIMA, DALAM_PERJALANAN, SELESAI] }
 *         description: Filter by specific status
 *     responses:
 *       200:
 *         description: List of all orders
 */
router.get("/orders", adminController.getAllOrders);

/**
 * @swagger
 * /admin/orders:
 *   post:
 *     summary: Create new order
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created
 */
router.post("/orders", adminController.createOrder);

/**
 * @swagger
 * /admin/orders/{id}:
 *   put:
 *     summary: Update order details or status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_name: { type: string }
 *               customer_address: { type: string }
 *               juice_type: { type: string }
 *               quantity: { type: integer }
 *               status: { type: string }
 *     responses:
 *       200:
 *         description: Order updated
 */
router.put("/orders/:id", adminController.updateOrder);

/**
 * @swagger
 * /admin/products:
 *   get:
 *     summary: Get all products (optionally filter by availability)
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: available
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/products", adminController.getProducts);

/**
 * @swagger
 * /admin/products:
 *   post:
 *     summary: Create new product
 *     tags: [Admin]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *     responses:
 *       201: { description: Product created }
 */
router.post("/products", adminController.createProduct);

/**
 * @swagger
 * /admin/products/{id}:
 *   put:
 *     summary: Toggle product availability
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_available: { type: boolean }
 *     responses:
 *       200: { description: Product updated }
 */
router.put("/products/:id", adminController.toggleProductStatus);

module.exports = router;
