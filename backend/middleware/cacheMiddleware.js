const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // Default TTL: 5 minutes

const cacheMiddleware = (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  const key = req.originalUrl || req.url;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    return res.json(cachedResponse);
  }

  // Override res.json to store the response in cache
  const originalJson = res.json;
  res.json = function(data) {
    if (res.statusCode === 200) {
      cache.set(key, data);
    }
    return originalJson.call(this, data);
  };

  next();
};

module.exports = { cacheMiddleware };
