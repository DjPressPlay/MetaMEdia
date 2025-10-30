// netlify/functions/scrape.js
import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function handler(event) {
  const { region = "na", name = "" } = event.queryStringParameters;
  if (!name) return { statusCode: 400, body: JSON.stringify({ error: "missing name" }) };

  try {
    const url = `https://www.leagueofgraphs.com/rankings/summoners/${region}`;
    const page = await fetch(url);
    const html = await page.text();
    const $ = cheerio.load(html);

    let result = null;
    $("table tr").each((i, el) => {
      const text = $(el).text().toLowerCase();
      if (text.includes(name.toLowerCase())) {
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

    if (!result) {
      return { statusCode: 404, body: JSON.stringify({ error: "not found" }) };
    }

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
