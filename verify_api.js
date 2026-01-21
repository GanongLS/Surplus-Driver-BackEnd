const API_URL = 'http://localhost:3000/api/v1';

async function verify() {
  try {
    console.log('--- 1. Login ---');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: '081234567890', // Budi Driver
        password: 'password123' 
      })
    });

    if (!loginRes.ok) {
        throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
    }

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login successful, Token:', token ? 'Received' : 'Missing');

    const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    console.log('\n--- 2. Get Available Orders ---');
    const ordersRes = await fetch(`${API_URL}/orders`, { headers });
    const orders = await ordersRes.json();
    console.log('Orders found:', orders.length);

    if (orders.length === 0) {
        console.log("No orders to accept. Exiting.");
        return;
    }
    
    // Find a 'MENUNGGU' order
    const targetOrder = orders.find(o => o.status === 'MENUNGGU');
    
    if (!targetOrder) {
        console.log("No waiting orders found.");
    } else {
        console.log(`Attempting to accept Order ID: ${targetOrder.id}`);
        
        console.log('\n--- 3. Accept Order ---');
        const acceptRes = await fetch(`${API_URL}/orders/${targetOrder.id}/accept`, { 
            method: 'POST',
            headers 
        });
        const acceptData = await acceptRes.json();
        console.log('Order Accepted status:', acceptData.order ? acceptData.order.status : acceptData);

        console.log('\n--- 4. Update Status to DALAM_PERJALANAN ---');
        await fetch(`${API_URL}/orders/${targetOrder.id}/status`, { 
            method: 'POST',
            headers,
            body: JSON.stringify({ status: 'DALAM_PERJALANAN' })
        });
        console.log('Status updated to DALAM_PERJALANAN');

        console.log('\n--- 5. Update Status to SELESAI ---');
        await fetch(`${API_URL}/orders/${targetOrder.id}/status`, { 
            method: 'POST',
            headers,
            body: JSON.stringify({ status: 'SELESAI' })
        });
        console.log('Status updated to SELESAI');
    }

    console.log('\n--- 6. Get History ---');
    const historyRes = await fetch(`${API_URL}/orders/history`, { headers });
    const history = await historyRes.json();
    console.log('History items:', history.length);

  } catch (error) {
    console.error('Verification Error:', error);
  }
}

verify();
