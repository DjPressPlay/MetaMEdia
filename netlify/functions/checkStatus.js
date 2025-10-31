export async function handler() {
  const regions = ["na1", "euw1", "eun1", "kr", "br1", "jp1", "la1", "la2", "oc1", "ru", "tr1"];
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
      
      const hasGameAffectingMaintenance = data.maintenances?.some(m => {
        if (m.maintenance_status !== "in_progress") return false;
        const title = m.titles?.find(t => t.locale === "en_US")?.content || "";
        const nonBlockingTerms = ["account transfer", "gift", "prepaid code", "shop"];
        return !nonBlockingTerms.some(term => title.toLowerCase().includes(term));
      }) || false;
      
      const hasGameAffectingIncident = data.incidents?.some(i => {
        if (i.incident_severity !== "critical" && i.incident_severity !== "warning") return false;
        const title = i.titles?.find(t => t.locale === "en_US")?.content || "";
        const nonBlockingTerms = ["gift", "prepaid code", "shop"];
        return !nonBlockingTerms.some(term => title.toLowerCase().includes(term));
      }) || false;
      
      const isOnline = !hasGameAffectingMaintenance && !hasGameAffectingIncident;
      
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
