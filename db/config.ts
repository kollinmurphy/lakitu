import { column, defineDb, defineTable } from "astro:db";

// https://astro.build/db/config

const Installation = defineTable({
  columns: {
    installationId: column.number(),
  },
});

const Runner = defineTable({
  columns: {
    runnerId: column.number(),
    name: column.text(),
    labels: column.json(),
  },
});

const WorkflowJob = defineTable({
  columns: {
    id: column.number({
      primaryKey: true,
    }),
    status: column.text({
      enum: ["queued", "in_progress", "completed", "waiting"],
    }),
    name: column.text(),
    workflowName: column.text({
      optional: true,
    }),
    runAttempt: column.number(),
    runUrl: column.text(),
    headBranch: column.text({
      optional: true,
    }),
    runnerId: column.number({ optional: true }),
    createdAt: column.date(),
    completedAt: column.date({ optional: true }),
  },
});

export default defineDb({
  tables: {
    Installation,
    Runner,
    WorkflowJob,
  },
});
