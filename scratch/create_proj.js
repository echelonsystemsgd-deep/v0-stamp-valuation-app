const https = require('https');

const postData = JSON.stringify({
  name: 'Sell Your Stamps UK',
  organization_id: 'jkhmasvvmlmkntubvggw',
  region: 'eu-west-2',
  db_pass: 'StampsValuationBuy2026#Sec', // Secure password for your DB
  plan: 'free'
});

const options = {
  hostname: 'api.supabase.com',
  path: '/v1/projects',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sbp_86b998f7725e2c680b7f556dbbc2f7587c576f63',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log("Status Code:", res.statusCode);
    try {
      console.log(JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
      console.log("Raw Response:", data);
    }
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(postData);
req.end();
