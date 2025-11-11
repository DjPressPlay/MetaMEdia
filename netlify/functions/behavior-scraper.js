const https = require('https');

exports.handler = async (event) => {
  const gameName = event.queryStringParameters?.gameName;
  const tagLine = event.queryStringParameters?.tagLine;
  const region = event.queryStringParameters?.region || 'na';
  
  if (!gameName || !tagLine) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'gameName and tagLine are required' })
    };
  }

  try {
    const riotId = `${gameName}-${tagLine}`;
    const behaviorUrl = `https://www.leagueofgraphs.com/summoner/behavior/${region}/${riotId}`;
    
    const htmlContent = await fetchPage(behaviorUrl);
    
    const behaviorData = extractBehaviorData(htmlContent, gameName, tagLine);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      },
      body: JSON.stringify(behaviorData)
    };
  } catch (error) {
    console.error('Behavior scraping error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch behavior data',
        message: error.message,
        fallback: true
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 15000
    };
    
    const req = https.request(options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          fetchPage(redirectUrl).then(resolve).catch(reject);
          return;
        }
      }
      
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

function extractBehaviorData(html, gameName, tagLine) {
  const behaviorData = {
    gameName,
    tagLine,
    winrate: null,
    totalMatches: null,
    matchesPerSession: null,
    totalTimePlayed: null,
    killParticipation: null,
    goldPerMinute: null,
    visionPerMinute: null,
    primaryRole: null,
    topChampions: [],
    playerLevel: null,
    success: true
  };

  const winrateMatch = html.match(/(?:Overall\s+)?Winrate[:\s]*(\d+\.?\d*)%/i);
  if (winrateMatch) {
    behaviorData.winrate = `${winrateMatch[1]}%`;
  }

  const matchesMatch = html.match(/Total\s+Matches[:\s]*([0-9,]+)/i);
  if (matchesMatch) {
    behaviorData.totalMatches = matchesMatch[1].replace(/,/g, '');
  }

  const sessionsMatch = html.match(/Matches\s+per\s+Session[:\s]*(\d+\.?\d*)/i);
  if (sessionsMatch) {
    behaviorData.matchesPerSession = sessionsMatch[1];
  }

  const timePlayedMatch = html.match(/Total\s+Time\s+Played[:\s]*(\d+\s+days?,\s+\d+\s+hours?,\s+\d+\s+minutes?)/i);
  if (timePlayedMatch) {
    behaviorData.totalTimePlayed = timePlayedMatch[1];
  }

  const kpMatch = html.match(/Kill\s+Participation[:\s]*(\d+\.?\d*)%/i);
  if (kpMatch) {
    behaviorData.killParticipation = `${kpMatch[1]}%`;
  }

  const goldMatch = html.match(/Gold\s+per\s+Minute[:\s]*(\d+\.?\d*)/i);
  if (goldMatch) {
    behaviorData.goldPerMinute = goldMatch[1];
  }

  const visionMatch = html.match(/Vision\s+per\s+Minute[:\s]*(\d+\.?\d*)/i);
  if (visionMatch) {
    behaviorData.visionPerMinute = visionMatch[1];
  }

  const roleMatch = html.match(/Primary\s+Role[:\s]*(\w+)/i);
  if (roleMatch) {
    behaviorData.primaryRole = roleMatch[1];
  }

  const levelMatch = html.match(/Player\s+Level[:\s]*(\d+)/i) || html.match(/Level[:\s]*(\d+)/i);
  if (levelMatch) {
    behaviorData.playerLevel = levelMatch[1];
  }

  const championMatches = html.match(/#(\d+)\s+(\w+)/g);
  if (championMatches && championMatches.length > 0) {
    behaviorData.topChampions = championMatches.slice(0, 3).map(match => {
      const parts = match.match(/#(\d+)\s+(\w+)/);
      return parts ? { rank: parts[1], name: parts[2] } : null;
    }).filter(Boolean);
  }

  const percentageMatches = html.match(/(\d+\.?\d*)%/g);
  if (percentageMatches && percentageMatches.length > 0) {
    if (!behaviorData.winrate && percentageMatches[0]) {
      behaviorData.winrate = percentageMatches[0];
    }
    if (!behaviorData.killParticipation && percentageMatches.length > 1) {
      behaviorData.killParticipation = percentageMatches[1];
    }
  }

  const numberMatches = html.match(/(\d+\.?\d+)/g);
  if (numberMatches && numberMatches.length > 0) {
    if (!behaviorData.matchesPerSession && numberMatches.length > 0) {
      const potentialSession = parseFloat(numberMatches.find(n => parseFloat(n) > 1 && parseFloat(n) < 20));
      if (potentialSession) {
        behaviorData.matchesPerSession = potentialSession.toString();
      }
    }
    if (!behaviorData.goldPerMinute && numberMatches.length > 1) {
      const potentialGold = parseFloat(numberMatches.find(n => parseFloat(n) > 200 && parseFloat(n) < 600));
      if (potentialGold) {
        behaviorData.goldPerMinute = potentialGold.toString();
      }
    }
    if (!behaviorData.visionPerMinute && numberMatches.length > 2) {
      const potentialVision = parseFloat(numberMatches.find(n => parseFloat(n) > 0 && parseFloat(n) < 10));
      if (potentialVision) {
        behaviorData.visionPerMinute = potentialVision.toString();
      }
    }
  }

  return behaviorData;
}
