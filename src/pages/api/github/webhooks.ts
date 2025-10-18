import type { APIContext } from "astro";
import { verify } from "@octokit/webhooks-methods";
import { onInstallationCreated } from "../../../webhook/handlers/installation-created";
import { onInstallationDeleted } from "../../../webhook/handlers/installation-deleted";
import { onWorkflowJob } from "../../../webhook/handlers/workflow-job";
import { webhookApp, webhookSecret } from "../../../webhook/webhook";

const app = webhookApp;

onInstallationCreated(app);
onInstallationDeleted(app);
onWorkflowJob(app);

app.webhooks.on("ping", async ({ octokit, payload }) => {
  console.log("Received ping event:", payload);
});

export async function POST({ request }: APIContext) {
  const signature = request.headers.get("x-hub-signature-256") || "";
  const payload = await request.text();
  const isValid = await verify(webhookSecret, payload, signature);
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
