import fs from "fs";

const DATA_FILE = "data.json";
const DATA_SOURCE_URL = process.env.DATA_SOURCE_URL;

async function main() {
  const current = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

  if (!DATA_SOURCE_URL) {
    current.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(current, null, 2));
    console.log("No DATA_SOURCE_URL found. Refreshed timestamp only.");
    return;
  }

  const response = await fetch(DATA_SOURCE_URL);

  if (!response.ok) {
    throw new Error(`Error fetching source: ${response.status}`);
  }

  const nextData = await response.json();

  const output = {
    ...nextData,
    lastUpdated: new Date().toISOString()
  };

  fs.writeFileSync(DATA_FILE, JSON.stringify(output, null, 2));
  console.log("data.json updated successfully.");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});