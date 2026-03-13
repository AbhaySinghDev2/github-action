const fs = require("fs");
const { execSync } = require("child_process");

const clients = JSON.parse(fs.readFileSync("./client.json"));
const client = process.env.CLIENT?.toString()?.trim();

if (!client) {
  console.error("CLIENT variable missing");
  process.exit(1);
}

const config = clients[client];

if (!config) {
  console.error(`Client ${client} not found`);
  process.exit(1);
}

console.log(`Building for ${client}`);
console.log(config)

let command;

if (process.platform === "win32") {
  const setParts = Object.entries(config).map(([key, value]) => `set "${key}=${value}"`);
  command = setParts.join(" & ") + " & react-scripts build";
} else {
  const envParts = Object.entries(config).map(([key, value]) => `${key}=${JSON.stringify(value)}`);
  command = envParts.join(" ") + " react-scripts build";
}

console.log("Executing:", command);

execSync(command, { stdio: "inherit" });
