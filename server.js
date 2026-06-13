const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Decode URL in case of special Vietnamese characters or spaces
  const decodedUrl = decodeURIComponent(req.url);
  const parsedUrl = url.parse(decodedUrl, true);
  const pathname = parsedUrl.pathname;

  // Route API requests locally
  if (pathname === '/api/servers') {
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      res.writeHead(res.statusCode || 200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data), 'utf-8');
      return res;
    };
    req.query = parsedUrl.query;

    const apiHandler = require('./api/servers.js');
    apiHandler(req, res).catch(err => {
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    });
    return;
  }

  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  
  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` HopHub Server đang chạy tại: http://localhost:${PORT}`);
  console.log(` Nhấn Ctrl + C để dừng Server.`);
  console.log(`=================================================`);
});
