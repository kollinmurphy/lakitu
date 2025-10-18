import { db, eq, Installation } from "astro:db";
import { App } from "octokit";

export function onInstallationCreated(app: App) {
  app.webhooks.on("installation.created", async ({ octokit, payload }) => {
    const installationId = payload.installation.id;
    const installation = await db
      .select()
      .from(Installation)
      .where(eq(Installation.installationId, installationId))
      .get();

    if (installation) {
      // await db
      //   .update(Installation)
      //   .set({
      //     repositories:
      //       payload.repositories?.map((repo) => repo.full_name) ?? [],
      //   })
      //   .where(eq(Installation.installationId, installationId));
      console.log(`Installation ${installationId} already exists in database`);
    } else {
      await db.insert(Installation).values({
        installationId: installationId,
      });
      console.log(`Installation ${installationId} saved to database`);
    }
  });
}
