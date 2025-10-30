// netlify/functions/scrape.js
const fetch = require("node-fetch");
const cheerio = require("cheerio");

exports.handler = async (event) => {
  const { region = "na", name = "" } = event.queryStringParameters;
  if (!name)
    return { statusCode: 400, body: JSON.stringify({ error: "Missing summoner name" }) };

  try {
    const url = `https://www.leagueofgraphs.com/rankings/summoners/${region}`;
    const response = await fetch(url);
    if (!response.ok)
      return { statusCode: response.status, body: JSON.stringify({ error: "Failed to load leaderboard" }) };

    const html = await response.text();
    const $ = cheerio.load(html);

    let result = null;
    $("table tr").each((i, el) => {
      const row = $(el).text().toLowerCase();
      if (row.includes(name.toLowerCase())) {
        const cells = $(el).find("td");
        const rank = cells.eq(0).text().trim();
        const summoner = cells.eq(1).find("a").text().trim();
        const img = cells.eq(1).find("img").attr("src");
        const tier = cells.eq(2).text().trim();
        const lp = cells.eq(3).text().trim();
        const winrate = cells.eq(4).text().trim();

        result = { summoner, rank, tier, lp, winrate, profile_icon: img };
      }
    });

    if (!result)
      return { statusCode: 404, body: JSON.stringify({ error: "Summoner not found in leaderboard" }) };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result)
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
