require("dotenv").config();
const pool = require("./src/config/db");
const { hashPassword } = require("./src/utils/passwordUtils");

const updatePassword = async (retries = 5, delay = 5000) => {
	for (let i = 0; i < retries; i++) {
		try {
			const hashedPassword = await hashPassword("password123");
			console.log("Generated Hash:", hashedPassword);

			const res = await pool.query(
				`UPDATE drivers SET password_hash = $1 WHERE email = 'budi@example.com'`,
				[hashedPassword],
			);

			console.log("Update result:", res.rowCount);
			console.log("Password updated for budi@example.com");
			return; // Success
		} catch (err) {
			console.error(`Error updating password (attempt ${i + 1}/${retries}):`, err.message);
			if (i < retries - 1) {
				console.log(`Retrying in ${delay / 1000} seconds...`);
				await new Promise(resolve => setTimeout(resolve, delay));
			} else {
				console.error("Failed to update password after multiple attempts");
				// We do not exit process with error to allow server to try starting,
				// effectively making this "non-mandatory" crash but "mandatory" to try.
				// But user said "not mandatory run... so application that run in server not doing update_password" - wait.
				// ERROR: User said "the seeding proses with update_password.js is not mandatory run in the application. so the application that run in the server not doing update_password."
				// Initial request: "hello, there is some bug in yesterday deployement. the seeding proses with update_password.js is not mandatory run in the application. so the application that run in the server not doing update_password."
				// Meaning: currently it IS NOT running, but it SHOULD run?
				// OR: currently it IS NOT MANDATORY, so it is SKIPPED?
				// "so the application that run in the server not doing update_password" -> Describes the BUG.
				// "the seeding proses ... is not mandatory run in the application" -> Maybe meaning it is currently configured as not mandatory?
				// Interpreting "is not mandatory run" as "is not currently running automatically".
				// The user wants it to RUN.
				// "so the application ... not doing update_password" -> This is the unexpected behavior.
				// So I need to make it run.
			}
		}
	}
	pool.end();
};

updatePassword();
