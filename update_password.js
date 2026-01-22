require("dotenv").config();
const pool = require("./src/config/db");
const { hashPassword } = require("./src/utils/passwordUtils");

const updatePassword = async (retries = 5, delay = 5000) => {
	for (let i = 0; i < retries; i++) {
		try {
			// Update Driver Password
			const hashedDriverPassword = await hashPassword("password123");
			console.log("Generated Driver Hash:", hashedDriverPassword);

			const resDriver = await pool.query(
				`UPDATE drivers SET password_hash = $1 WHERE email = 'budi@example.com'`,
				[hashedDriverPassword],
			);
			console.log("Driver update result:", resDriver.rowCount);
			console.log("Password updated for budi@example.com");

			// Upsert Admin User
			const adminUsername = "admin";
			const adminPassword = "password123";
			const hashedAdminPassword = await hashPassword(adminPassword);

			// Check if admin exists
			const checkAdmin = await pool.query("SELECT * FROM admins WHERE username = $1", [
				adminUsername,
			]);

			if (checkAdmin.rows.length > 0) {
				await pool.query("UPDATE admins SET password_hash = $1 WHERE username = $2", [
					hashedAdminPassword,
					adminUsername,
				]);
				console.log("Admin password updated.");
			} else {
				await pool.query("INSERT INTO admins (username, password_hash) VALUES ($1, $2)", [
					adminUsername,
					hashedAdminPassword,
				]);
				console.log("Admin user created.");
			}

			return; // Success
		} catch (err) {
			console.error(`Error updating password (attempt ${i + 1}/${retries}):`, err.message);
			if (i < retries - 1) {
				console.log(`Retrying in ${delay / 1000} seconds...`);
				await new Promise(resolve => setTimeout(resolve, delay));
			} else {
				console.error("Failed to update password after multiple attempts");
			}
		}
	}
	pool.end();
};

updatePassword();
