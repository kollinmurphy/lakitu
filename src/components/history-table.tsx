import { useEffect, useState } from "react";
import type { RunnerHistory } from "../pages/api/history";

export const HistoryTable = () => {
  const [data, setData] = useState<RunnerHistory[]>([]);

  useEffect(() => {
    (async () => {
      setData(await fetch("/api/history").then((res) => res.json()));
    })();
  }, []);

  return (
    <div>
      <h2>Runner History</h2>
      <div className="flex flex-col gap-2 w-full">
        {data.map(({ Runner, WorkflowJobs }) => (
          <div key={Runner.runnerId} className="border p-4 rounded-lg">
            <h3 className="font-bold">Runner ID: {Runner.runnerId}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};
