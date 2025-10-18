import { column, defineDb, defineTable } from "astro:db";

// https://astro.build/db/config

const Runner = defineTable({
  columns: {
    name: column.text(),
    labels: column.json(),
  },
});

const Job = defineTable({
  columns: {
    runnerId: column.number(),
    status: column.text(),
    startedAt: column.date(),
    finishedAt: column.date({ optional: true }),
  },
});

export default defineDb({
  tables: {
    Runner,
    Job,
  },
});
