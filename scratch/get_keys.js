const https = require('https');

const options = {
  hostname: 'api.supabase.com',
  path: '/v1/projects/falicdjkhkbsbogiwbub/api-keys',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer sbp_86b998f7725e2c680b7f556dbbc2f7587c576f63',
    'Content-Type': 'application/json'
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

req.end();
