import { db, eq, Installation, WorkflowJob } from "astro:db";
import { App } from "octokit";

async function upsertWorkflowJob(payload: {
  id: number;
  status: "queued" | "in_progress" | "completed" | "waiting";
  name: string;
  workflowName: string | null;
  runAttempt: number;
  runUrl: string;
  headBranch: string | null;
  runnerId?: number;
  createdAt: string;
  completedAt?: string;
}) {
  const job = await db
    .select()
    .from(WorkflowJob)
    .where(eq(WorkflowJob.id, payload.id))
    .get();

  if (job) {
    await db
      .update(WorkflowJob)
      .set({
        status: payload.status,
        name: payload.name,
        workflowName: payload.workflowName,
        runAttempt: payload.runAttempt,
        runUrl: payload.runUrl,
        headBranch: payload.headBranch,
        runnerId: payload.runnerId,
        createdAt: new Date(payload.createdAt),
        completedAt: payload.completedAt ? new Date(payload.completedAt) : null,
      })
      .where(eq(WorkflowJob.id, payload.id));
    console.log(`Workflow job ${payload.id} updated in database`);
  } else {
    await db.insert(WorkflowJob).values({
      id: payload.id,
      status: payload.status,
      name: payload.name,
      workflowName: payload.workflowName,
      runAttempt: payload.runAttempt,
      runUrl: payload.runUrl,
      headBranch: payload.headBranch,
      runnerId: payload.runnerId,
      createdAt: new Date(payload.createdAt),
      completedAt: payload.completedAt ? new Date(payload.completedAt) : null,
    });
    console.log(`Workflow job ${payload.id} inserted into database`);
  }
}

export function onWorkflowJob(app: App) {
  app.webhooks.on("workflow_job", async ({ octokit, payload }) =>
    upsertWorkflowJob({
      id: payload.workflow_job.id,
      status: payload.workflow_job.status,
      name: payload.workflow_job.name,
      workflowName: payload.workflow_job.workflow_name,
      runAttempt: payload.workflow_job.run_attempt,
      runUrl: payload.workflow_job.run_url,
      headBranch: payload.workflow_job.head_branch,
      runnerId: payload.workflow_job.runner_id ?? undefined,
      createdAt: payload.workflow_job.created_at,
      completedAt: payload.workflow_job.completed_at ?? undefined,
    })
  );
}
