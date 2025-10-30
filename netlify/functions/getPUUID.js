// Netlify Function — server-side so your API key stays hidden
export async function handler(event) {
  const { name } = event.queryStringParameters;
  if (!name) {
    return { statusCode: 400, body: "Missing summoner name" };
  }

  try {
    const apiKey = process.env.RIOT_API_KEY; // stored in Netlify env vars
    const response = await fetch(
      `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(name)}?api_key=${apiKey}`
    );

    if (!response.ok) {
      const msg = await response.text();
      return { statusCode: response.status, body: msg };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ puuid: data.puuid, name: data.name, level: data.summonerLevel }),
    };
  } catch (err) {
    return { statusCode: 500, body: "Server error: " + err.message };
  }
}
