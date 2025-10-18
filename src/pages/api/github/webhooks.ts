import type { APIContext } from "astro";
import { App } from "octokit";
import dotenv from "dotenv";
import { readFileSync } from "node:fs";
import { verify } from "@octokit/webhooks-methods";
import { onInstallationCreated } from "../../../handlers/installation-created";
import { onInstallationDeleted } from "../../../handlers/installation-deleted";
import { onWorkflowJob } from "../../../handlers/workflow-job";

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

onInstallationCreated(app);
onInstallationDeleted(app);
onWorkflowJob(app);

app.webhooks.on("ping", async ({ octokit, payload }) => {
  console.log("Received ping event:", payload);
});

export async function POST({ request }: APIContext) {
  const signature = request.headers.get("x-hub-signature-256") || "";
  const payload = await request.text();
  const isValid = await verify(secret, payload, signature);
  if (!isValid) {
    return new Response("Invalid signature", { status: 401 });
  }
  await app.webhooks.receive({
    id: request.headers.get("x-github-delivery") || "",
    name: request.headers.get("x-github-event") || ("" as any),
    payload: JSON.parse(payload),
  });
  return new Response("Webhook received", { status: 200 });
}
