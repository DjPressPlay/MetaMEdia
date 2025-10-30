// netlify/functions/scrape.js
export async function handler(event) {
  const { region = "na", name = "" } = event.queryStringParameters || {};
  if (!name)
    return { statusCode: 400, body: JSON.stringify({ error: "Missing summoner name" }) };

  try {
    const url = `https://www.leagueofgraphs.com/rankings/summoners/${region}`;
    const res = await fetch(url);
    if (!res.ok)
      return { statusCode: res.status, body: JSON.stringify({ error: "LeagueOfGraphs not reachable" }) };

    const html = await res.text();
    const rowMatch = html.match(new RegExp(`<tr[^>]*>[^<]*<td[^>]*>\\s*\\d+\\s*</td>[^]*?<a[^>]*>([^<]*${name}[^<]*)</a>[^]*?</tr>`, "i"));
    if (!rowMatch)
      return { statusCode: 404, body: JSON.stringify({ error: "Summoner not found" }) };

    const row = rowMatch[0];
    const get = (pattern) => (row.match(pattern)?.[1]?.trim() || "");

    const rank = get(/<td[^>]*>(\d+)<\/td>/);
    const summoner = get(/<a[^>]*>([^<]+)<\/a>/);
    const img = get(/<img[^>]+src="([^"]+)"/);
    const tier = get(/<\/a><\/td><td[^>]*>([^<]*)<\/td>/);
    const lp = get(/(\d+)\s*LP/i);
    const winrate = get(/(\d+\.?\d*)%/);

    const data = {
      summoner,
      rank,
      tier,
      lp,
      winrate,
      profile_icon: img?.startsWith("http") ? img : `https://www.leagueofgraphs.com${img}`,
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
