CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    juice_type VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'MENUNGGU', -- MENUNGGU, DITERIMA, DALAM_PERJALANAN, SELESAI
    assigned_driver_id INTEGER REFERENCES drivers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Mock Data
INSERT INTO drivers (name, phone, email, password_hash) 
VALUES 
('Budi Driver', '081234567890', 'budi@example.com', '$2b$10$YourHashedPasswordHere'), -- Password needs to be hashed properly later
('Siti Driver', '081987654321', 'siti@example.com', '$2b$10$YourHashedPasswordHere');

INSERT INTO orders (customer_name, customer_address, juice_type, quantity, status)
VALUES
('Ali Customer', 'Jl. Merdeka No. 1', 'Orange Juice', 2, 'MENUNGGU'),
('Ani Customer', 'Jl. Sudirman No. 45', 'Apple Juice', 1, 'MENUNGGU');
