import { db, eq, Installation } from "astro:db";
import { App } from "octokit";

export function onInstallationDeleted(app: App) {
  app.webhooks.on("installation.deleted", async ({ octokit, payload }) => {
    const installationId = payload.installation.id;
    const installation = await db
      .select()
      .from(Installation)
      .where(eq(Installation.installationId, installationId))
      .get();

    if (installation) {
      await db
        .delete(Installation)
        .where(eq(Installation.installationId, installationId));
      console.log(`Installation ${installationId} removed from database`);
    } else {
      console.log(
        `Installation ${installationId} not found in database for removal`
      );
    }
  });
}
