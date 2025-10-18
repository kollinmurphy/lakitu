import { App, createNodeMiddleware } from "octokit";
import dotenv from "dotenv";
import { readFileSync } from "node:fs";

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

dotenv.config({ quiet: true });

const appId = getEnvVar("GITHUB_APP_ID");
const privateKeyPath = getEnvVar("GITHUB_PRIVATE_KEY_PATH");
const secret = getEnvVar("GITHUB_WEBHOOK_SECRET");

const privateKey = readFileSync(privateKeyPath, "utf8");

const app = new App({
  appId,
  privateKey,
  webhooks: { secret },
  oauth: {
    clientId: appId,
    clientSecret: getEnvVar("GITHUB_CLIENT_SECRET"),
  },
});

app.webhooks.on("issues.opened", ({ octokit, payload }) => {
  return octokit.rest.issues.createComment({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    issue_number: payload.issue.number,
    body: "Hello, World!",
  });
});

app.webhooks.on("ping", async ({ octokit, payload }) => {
  console.log("Received ping event:", payload);
});

export const webhook = createNodeMiddleware(app);
