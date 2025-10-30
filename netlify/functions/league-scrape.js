
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const handler = async (event) => {
  const name = event.queryStringParameters.name || "";
  if (!name) return { statusCode: 400, body: "missing name" };

  const url = `https://www.leagueofgraphs.com/summoner/na/${encodeURIComponent(name)}`;

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const data = await page.evaluate(() => {
    const banner = getComputedStyle(document.querySelector(".bannerImage")).backgroundImage
      .replace(/url\\(["']?(.*?)["']?\\)/, "$1");
    const icon = document.querySelector(".bannerIcon img")?.src || "";
    const name = document.querySelector(".summonerName")?.textContent.trim() || "";
    const level = document.querySelector(".bannerSubtitle")?.textContent.trim() || "";
    const rank = document.querySelector(".leagueTier")?.textContent.trim() || "";
    return { banner, icon, name, level, rank };
  });

  await browser.close();
  return { statusCode: 200, body: JSON.stringify(data) };
};
