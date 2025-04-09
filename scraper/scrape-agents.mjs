import fs from "fs";
import axios from "axios";
import { JSDOM } from "jsdom";

const baseUrl = "https://www.remaxmtnview.ca/agents.php?page=";
const baseProfileUrl = "https://www.remaxmtnview.ca";
const outputFile = "agents.json";

async function fetchAgentsFromPage(pageNum) {
  const res = await axios.get(`${baseUrl}${pageNum}`);
  const dom = new JSDOM(res.data);
  const document = dom.window.document;

  const boxes = [...document.querySelectorAll(".listing-box-image")];
  const agents = boxes.map((box) => {
    const img = box.querySelector("img");
    const link = box.querySelector("a");
    return {
      name: link?.getAttribute("aria-label") || "RE/MAX Agent",
      photo: img?.src || "",
      link: link ? new URL(link.getAttribute("href"), baseProfileUrl).href : "#",
    };
  });

  return agents;
}

async function scrapeAllAgents(maxPages = 10) {
  let allAgents = [];
  for (let page = 1; page <= maxPages; page++) {
    const agents = await fetchAgentsFromPage(page);
    if (agents.length === 0) break;
    allAgents = [...allAgents, ...agents];
  }

  fs.writeFileSync(outputFile, JSON.stringify(allAgents, null, 2));
  console.log(`Saved ${allAgents.length} agents to ${outputFile}`);
}

scrapeAllAgents().catch((err) => {
  console.error("Scrape failed:", err);
});