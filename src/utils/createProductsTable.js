const pool = require("../config/db");

const seedProducts = async () => {
	const products = [
		"Alpukat",
		"Anggur",
		"Apel",
		"Belimbing",
		"Bengkuang",
		"Blackberry",
		"Blewah",
		"Blueberry",
		"Ceri",
		"Delima",
		"Duku",
		"Durian",
		"Jambu Air",
		"Jambu Biji",
		"Jeruk",
		"Kedondong",
		"Kelapa",
		"Kesemek",
		"Kiwi",
		"Kurma",
		"Leci",
		"Lemon",
		"Lengkeng",
		"Mangga",
		"Manggis",
		"Markisa",
		"Melon",
		"Mixed Fruit",
		"Naga",
		"Nanas",
		"Nangka",
		"Pepaya",
		"Persik (Peach)",
		"Pir",
		"Pisang",
		"Plum",
		"Rambutan",
		"Raspberry",
		"Salak",
		"Sawo",
		"Semangka",
		"Sirsak",
		"Srikaya",
		"Stroberi",
		"Tin (Gbr)",
		"Zaitun",
	];

	try {
		// Create Table
		await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        is_available BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
		console.log("✅ Products table created or already exists.");

		// Seed Data
		for (const name of products) {
			await pool.query(
				`
        INSERT INTO products (name) 
        VALUES ($1) 
        ON CONFLICT (name) DO NOTHING
      `,
				[name],
			);
		}
		console.log(`✅ Seeded ${products.length} products.`);
		process.exit(0);
	} catch (error) {
		console.error("❌ Error seeding products:", error);
		process.exit(1);
	}
};

seedProducts();
