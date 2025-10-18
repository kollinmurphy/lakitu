"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { GetRunnersResponse } from "../types/runners";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const RunnerDisplay = (props: { runners: GetRunnersResponse }) => {
  const busy = props.runners.filter(
    (r) => r.status === "online" && r.busy
  ).length;
  const idle = props.runners.filter(
    (r) => r.status === "online" && !r.busy
  ).length;
  const offline = props.runners.length - idle - busy;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { boxWidth: 12 },
      },
    },
  };

  const onlineData = {
    labels: ["Busy", "Idle", "Offline"],
    datasets: [
      {
        label: "Runners",
        data: [busy, idle, offline],
        backgroundColor: [
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(255, 99, 132, 0.5)",
        ],
        borderColor: [
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full max-h-[400px]">
      <h3 className="text-xl font-bold mb-4 p-4">Runners</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative w-full h-[200px]">
          <Doughnut data={onlineData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};
