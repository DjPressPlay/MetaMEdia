export default async (req, context) => {
  const RIOT_API_KEY = process.env.RIOT_API_KEY;
  
  if (!RIOT_API_KEY) {
    return new Response(
      JSON.stringify({ error: "RIOT_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const url = new URL(req.url);
  const endpoint = url.searchParams.get('endpoint');
  const region = url.searchParams.get('region') || 'na1';

  if (!endpoint) {
    return new Response(
      JSON.stringify({ error: "Missing endpoint parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const apiUrl = `https://${region}.api.riotgames.com${endpoint}`;
    const response = await fetch(apiUrl, {
      headers: {
        'X-Riot-Token': RIOT_API_KEY
      }
    });

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      { 
        status: response.status,
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300"
        } 
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch from Riot API", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
