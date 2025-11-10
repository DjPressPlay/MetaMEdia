const https = require('https');

exports.handler = async (event) => {
  const championName = event.queryStringParameters?.champion;
  
  if (!championName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Champion name is required' })
    };
  }

  try {
    const wikiUrl = `https://leagueoflegends.fandom.com/wiki/${encodeURIComponent(championName)}/LoL`;
    
    const htmlContent = await fetchPage(wikiUrl);
    
    const loreData = extractLoreData(htmlContent, championName);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400'
      },
      body: JSON.stringify(loreData)
    };
  } catch (error) {
    console.error('Lore scraping error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch lore',
        champion: championName,
        fallback: true,
        loreSnippet: `${championName} is a champion in League of Legends.`,
        imageUrl: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName}_0.jpg`
      })
    };
  }
};

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

function extractLoreData(html, championName) {
  const loreSnippets = [];
  const imageUrls = [];
  
  const biographyMatch = html.match(/<div[^>]*class="[^"]*mw-parser-output[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  if (biographyMatch) {
    const content = biographyMatch[1];
    
    const paragraphs = content.match(/<p[^>]*>(.*?)<\/p>/gi) || [];
    
    for (let para of paragraphs.slice(0, 10)) {
      const cleanText = para
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
      
      if (cleanText.length > 50 && !cleanText.startsWith('For the expanded patch notes')) {
        loreSnippets.push(cleanText);
      }
    }
  }
  
  const imgMatches = html.match(/<img[^>]+src="([^"]+)"[^>]*>/gi) || [];
  for (let imgTag of imgMatches.slice(0, 5)) {
    const srcMatch = imgTag.match(/src="([^"]+)"/i);
    if (srcMatch && srcMatch[1]) {
      let imgUrl = srcMatch[1];
      if (imgUrl.includes('static.wikia.nocookie.net') || imgUrl.includes('vignette.wikia.nocookie.net')) {
        if (imgUrl.startsWith('//')) {
          imgUrl = 'https:' + imgUrl;
        }
        if (!imgUrl.includes('/thumb/') && (imgUrl.includes(championName) || imgUrl.includes('Champion'))) {
          imageUrls.push(imgUrl);
        }
      }
    }
  }
  
  const splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName}_0.jpg`;
  imageUrls.unshift(splashUrl);
  
  if (loreSnippets.length === 0) {
    loreSnippets.push(`${championName} is a legendary champion with a rich history in the world of Runeterra.`);
  }
  
  return {
    champion: championName,
    loreSnippets: loreSnippets,
    imageUrl: imageUrls[0] || splashUrl,
    allImages: imageUrls,
    success: true
  };
}
