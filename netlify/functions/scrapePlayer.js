export async function handler(event) {
  const { region = "na", name = "" } = event.queryStringParameters || {};
  if (!name)
    return { statusCode: 400, body: JSON.stringify({ error: "Missing summoner name" }) };

  try {
    const url = `https://www.leagueofgraphs.com/rankings/summoners/${region}`;
    const res = await fetch(url);
    const html = await res.text();

    // Find the row with the summoner name
    const lowerName = name.toLowerCase();
    const rowRegex = new RegExp(
      `<tr[^>]*>[^<]*<td[^>]*>(.*?)</td>[^]*?<a[^>]*>([^<]*${lowerName}[^<]*)</a>[^]*?</tr>`,
      "i"
    );
    const match = html.match(rowRegex);

    if (!match)
      return { statusCode: 404, body: JSON.stringify({ error: "Not found in leaderboard" }) };

    const rowHtml = match[0];

    // Extract fields with simple regexes
    const get = (pattern) => {
      const m = rowHtml.match(pattern);
      return m ? m[1].trim() : "";
    };

    const rank = get(/<td[^>]*>(\d+)<\/td>/);
    const summoner = get(/<a[^>]*>([^<]+)<\/a>/);
    const img = get(/<img[^>]+src="([^"]+)"/);
    const tier = get(/<\/a><\/td><td[^>]*>([^<]*)<\/td>/);
    const lp = get(/<td[^>]*>(\d+)\s*LP<\/td>/i);
    const winrate = get(/(\d+\.?\d*)%/);

    const result = {
      summoner,
      rank,
      tier,
      lp: lp || "",
      winrate: winrate || "",
      profile_icon: img
        ? img.startsWith("http")
          ? img
          : `https://www.leagueofgraphs.com${img}`
        : ""
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
