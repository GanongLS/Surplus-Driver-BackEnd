const { Pool } = require("pg");
const bcrypt = require("bcrypt");
require("dotenv").config();

const pool = new Pool({
	user: process.env.DB_USER || "postgres",
	host: process.env.DB_HOST || "db",
	database: process.env.DB_NAME || "surplus_db",
	password: process.env.DB_PASS || "postgres",
	port: process.env.DB_PORT || 5432,
});

const seedAdmin = async () => {
	try {
		const username = "admin";
		const password = "password123";
		console.log(`Hashing password for user: ${username}...`);
		const hashedPassword = await bcrypt.hash(password, 10);

		const checkQuery = "SELECT * FROM admins WHERE username = $1";
		const checkRes = await pool.query(checkQuery, [username]);

		if (checkRes.rows.length > 0) {
			console.log("Admin user already exists. Updating password...");
			const updateQuery = "UPDATE admins SET password_hash = $1 WHERE username = $2";
			await pool.query(updateQuery, [hashedPassword, username]);
			console.log("Admin password updated to: password123");
		} else {
			const insertQuery = `
        INSERT INTO admins (username, password_hash)
        VALUES ($1, $2)
        RETURNING id, username;
      `;
			const res = await pool.query(insertQuery, [username, hashedPassword]);
			console.log("Admin user created successfully:", res.rows[0]);
		}
		console.log("================================");
		console.log("LOGIN CREDENTIALS:");
		console.log("Username: admin");
		console.log("Password: password123");
		console.log("================================");
	} catch (err) {
		console.error("Error seeding admin:", err);
	} finally {
		await pool.end();
	}
};

seedAdmin();
