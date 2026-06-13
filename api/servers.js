const https = require('https');

function fetchPage(placeId, cursor = '') {
  return new Promise((resolve, reject) => {
    const cursorParam = cursor ? `&cursor=${cursor}` : '';
    const url = `https://games.roblox.com/v1/games/${placeId}/servers/Public?limit=100${cursorParam}`;
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
          resolve(parsedData);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

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

  try {
    let allServers = [];
    let nextCursor = '';
    
    // Tải tối đa 12 trang (1200 servers) để tăng khả năng tìm thấy server vắng người
    for (let i = 0; i < 12; i++) {
      const pageData = await fetchPage(placeId, nextCursor);
      if (pageData && Array.isArray(pageData.data)) {
        allServers = allServers.concat(pageData.data);
        nextCursor = pageData.nextPageCursor;
        if (!nextCursor) break;
      } else {
        break;
      }
    }

    res.status(200).json({ data: allServers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from Roblox API', details: error.message });
  }
};
