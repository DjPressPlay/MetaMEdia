const https = require('https');

exports.handler = async (event) => {
  const championName = event.queryStringParameters?.champion;
  
  if (!championName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Champion name is required' })
    };
  }

  const splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName}_0.jpg`;
  
  const exists = await checkImageExists(splashUrl);
  
  if (exists) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400'
      },
      body: JSON.stringify({ 
        champion: championName,
        backgroundUrl: splashUrl
      })
    };
  }
  
  const loadingUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championName}_0.jpg`;
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400'
    },
    body: JSON.stringify({ 
      champion: championName,
      backgroundUrl: loadingUrl
    })
  };
};

function checkImageExists(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'HEAD',
      timeout: 3000
    };
    
    const req = https.request(options, (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}
