export async function handler() {
  const regions = ["na1", "euw1", "eun1", "kr", "br1", "jp1", "la1", "la2", "oce", "ru", "tr1"];
  const apiKey = process.env.RIOT_API_KEY; // stored in Netlify environment variables
  const results = [];

  try {
    for (const region of regions) {
      const res = await fetch(`https://${region}.api.riotgames.com/lol/status/v4/platform-data`, {
        headers: { "X-Riot-Token": apiKey },
      });
      if (!res.ok) {
        results.push({ region, online: false });
        continue;
      }

      const data = await res.json();
      const isOnline = (!data.maintenances?.length && !data.incidents?.length);
      results.push({ region, online: isOnline });
    }

    const offlineRegions = results.filter(r => !r.online).map(r => r.region.toUpperCase());
    return {
      statusCode: 200,
      body: JSON.stringify({
        allOnline: offlineRegions.length === 0,
        offlineRegions,
      }),
    };
  } catch (err) {
    console.error("Status Check Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to check Riot servers" }),
    };
  }
}
