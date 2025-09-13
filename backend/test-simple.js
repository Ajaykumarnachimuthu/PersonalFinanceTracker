const http = require('http');

function testEndpoint(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: parsed
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data && (method === 'POST' || method === 'PUT')) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testBackend() {
  console.log('Testing backend endpoints...\n');
  
  try {
    // Test 1: Health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await testEndpoint('/health');
    console.log('✅ Health endpoint:', healthResponse.status, healthResponse.data);
    
    // Test 2: Check if auth endpoint exists
    console.log('\n2. Testing auth endpoint existence...');
    try {
      const authResponse = await testEndpoint('/auth/register', 'OPTIONS');
      console.log('✅ Auth endpoint exists');
    } catch (error) {
      console.log('❌ Auth endpoint test failed:', error.message);
    }
    
    // Test 3: Try actual registration
    console.log('\n3. Testing registration...');
    try {
      const testEmail = `test${Date.now()}@example.com`;
      const registerResponse = await testEndpoint('/auth/register', 'POST', {
        name: 'Test User',
        email: testEmail,
        password: 'password123'
      });
      console.log('✅ Registration response:', registerResponse.status, registerResponse.data);
    } catch (error) {
      console.log('❌ Registration failed:', error.message);
    }
    
  } catch (error) {
    console.log('❌ Backend test failed:', error.message);
    console.log('\n💡 Make sure your backend server is running on port 5000!');
    console.log('   Run: npm run dev');
  }
}

// Check if server is running first
testBackend();
