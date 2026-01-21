const API_URL = 'http://localhost:3000/api/v1';

async function verifyAdmin() {
  try {
    console.log('--- 1. Admin Login ---');
    const loginRes = await fetch(`${API_URL}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'adminpassword123' 
      })
    });

    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Admin Token Received.');

    const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    console.log('\n--- 2. Create Driver (Admin) ---');
    const newDriver = {
      name: `Driver Test ${Date.now()}`,
      phone: `08${Date.now()}`, // Unique phone
      email: `driver${Date.now()}@test.com`,
      password: 'driverpass123'
    };
    const createRes = await fetch(`${API_URL}/admin/drivers`, { 
        method: 'POST', 
        headers, 
        body: JSON.stringify(newDriver) 
    });
    const createdDriver = await createRes.json();
    console.log('Created Driver:', createdDriver.name, 'ID:', createdDriver.id);

    console.log('\n--- 3. List Drivers ---');
    const driversRes = await fetch(`${API_URL}/admin/drivers`, { headers });
    const drivers = await driversRes.json();
    console.log('Total Drivers:', drivers.length);
    console.log('Last Driver:', drivers[0].name); // Ordered by created_at DESC

    console.log('\n--- 4. Deactivate Driver ---');
    const updateRes = await fetch(`${API_URL}/admin/drivers/${createdDriver.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ is_active: false })
    });
    const updatedDriver = await updateRes.json();
    console.log(`Driver ${updatedDriver.id} Active Status:`, updatedDriver.is_active);

    console.log('\n--- 5. Create Order (Admin) ---');
    const newOrder = {
      customer_name: 'Admin Created Customer',
      customer_address: 'Admin Address 123',
      juice_type: 'Mixed Berries',
      quantity: 5,
      latitude: -6.2088,
      longitude: 106.8456
    };
    const orderRes = await fetch(`${API_URL}/admin/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newOrder)
    });
    const createdOrder = await orderRes.json();
    console.log('Created Order ID:', createdOrder.id, 'Status:', createdOrder.status);

    console.log('\n--- 6. List Orders ---');
    const ordersRes = await fetch(`${API_URL}/admin/orders`, { headers });
    const orders = await ordersRes.json();
    console.log('Total Orders:', orders.length);

  } catch (error) {
    console.error('Admin Verification Error:', error);
  }
}

verifyAdmin();
