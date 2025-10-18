import { App, Octokit } from "octokit";
import { readFileSync } from "node:fs";
import { db, Installation } from "astro:db";
import { getEnvVar } from "./get-env-var";

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

export const webhookApp = app;
export const octokit = app.octokit;
export const webhookSecret = secret;

export async function getInstallationOctokit(): Promise<Octokit> {
  const installation = await db.select().from(Installation).limit(1).get();
  if (!installation) {
    throw new Error("No installation found in the database");
  }
  return app.getInstallationOctokit(installation.installationId);
}
