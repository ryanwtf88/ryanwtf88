
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

// Import from local src
import { fetchStats } from "./src/fetchers/stats.js";
import { renderStatsCard } from "./src/cards/stats.js";
import { fetchRepo } from "./src/fetchers/repo.js";
import { renderRepoCard } from "./src/cards/repo.js";
import { fetchTopLanguages } from "./src/fetchers/top-languages.js";
import { renderTopLanguages } from "./src/cards/top-languages.js";
import { Card } from "./src/common/Card.js";
import { flexLayout } from "./src/common/render.js";
import { I18n } from "./src/common/I18n.js";
import axios from "axios";

import { fetchStreak } from "./src/fetchers/streak.js";
import { renderStreakCard } from "./src/cards/streak.js";

// Load environment variables
config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, "../../assets/stats");

// Ensure assets directory exists
await fs.mkdir(ASSETS_DIR, { recursive: true });

const USERNAME = "ryanwtf88";

// Projects to generate cards for
const PROJECTS = [
  "ryanwtf88/ARINO",
  "ryanwtf88/hianime-api",
  "ryanwtf88/yt-cipher",
  "trexzactyl/trexzactyl",
  "ryanwtf88/gaana-api",
  "ryanwtf88/spotokn",
];

async function generateStats() {
  console.log("Generating GitHub Stats...");
  try {
    const stats = await fetchStats(USERNAME);
    const svg = renderStatsCard(stats, {
      show_icons: true,
      count_private: true,
      theme: "dark", // Using dark theme or default
    });
    await fs.writeFile(path.join(ASSETS_DIR, "github-stats.svg"), svg);
    console.log("Stats generated.");
  } catch (error) {
    console.error("Error generating stats:", error);
  }
}

async function generateTopLanguages() {
  console.log("Generating Top Languages...");
  try {
    const langs = await fetchTopLanguages(USERNAME);
    const svg = renderTopLanguages(langs, {
      layout: "compact",
      theme: "dark",
    });
    await fs.writeFile(path.join(ASSETS_DIR, "top-languages.svg"), svg);
    console.log("Top languages generated.");
  } catch (error) {
    console.error("Error generating top languages:", error);
  }
}

async function generateRepoCards() {
  console.log("Generating Repo Cards...");
  for (const repoName of PROJECTS) {
    try {
      const [username, repo] = repoName.split("/");
      const data = await fetchRepo(username, repo);
      const svg = renderRepoCard(data, {
        show_owner: true,
        theme: "dark",
      });
      // Sanitize filename
      const filename = `project-${username}-${repo}.svg`;
      await fs.writeFile(path.join(ASSETS_DIR, filename), svg);
      console.log(`Repo card for ${repoName} generated.`);
    } catch (error) {
      console.error(`Error generating repo card for ${repoName}:`, error);
    }
  }
}

// Streak implementation
async function generateStreak() {
  console.log("Generating Streak...");
  try {
    const streak = await fetchStreak(USERNAME);
    const svg = renderStreakCard(streak, {
        theme: "dark",
    });
    
    await fs.writeFile(path.join(ASSETS_DIR, "github-streak.svg"), svg);
    console.log("Streak generated.");

  } catch (error) {
    console.error("Error generating streak:", error);
  }
}

async function main() {
  await generateStats();
  await generateTopLanguages();
  await generateRepoCards();
  await generateStreak();
}

main();
