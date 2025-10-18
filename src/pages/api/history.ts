import type { APIContext } from "astro";
import { db, eq, Runner, WorkflowJob } from "astro:db";

export type RunnerHistory = {
  Runner: (typeof Runner)["$inferSelect"];
  WorkflowJobs: (typeof WorkflowJob)["$inferSelect"];
};

export async function GET({ request }: APIContext) {
  const runners = await db
    .select()
    .from(Runner)
    .leftJoin(WorkflowJob, eq(Runner.runnerId, WorkflowJob.runnerId))
    .all();
  return new Response(JSON.stringify(runners), { status: 200 });
}
