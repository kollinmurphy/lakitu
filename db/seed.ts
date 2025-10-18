import { db, Installation } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Installation).values({
    installationId: 90518025,
  });
}
