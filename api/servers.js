const https = require('https');

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { placeId } = req.query;
  if (!placeId) {
    res.status(400).json({ error: 'placeId is required' });
    return;
  }

  const url = `https://games.roblox.com/v1/games/${placeId}/servers/Public?limit=100`;
  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  };

  https.get(url, options, (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
        res.status(200).json(parsedData);
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse Roblox response', details: e.message });
      }
    });
  }).on('error', (err) => {
    res.status(500).json({ error: 'Failed to fetch from Roblox API', details: err.message });
  });
};
