"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { GetRunnersResponse } from "../types/runners";
import { useMemo, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

function RunnerStatus({ runner }: { runner: GetRunnersResponse[number] }) {
  if (runner.status === "offline") {
    return (
      <>
        <div className="inline-grid *:[grid-area:1/1]">
          <div className="status status-error animate-ping"></div>
          <div className="status status-error"></div>
        </div>{" "}
        Active
      </>
    );
  }
  if (runner.busy) {
    return (
      <>
        <div className="inline-grid *:[grid-area:1/1]">
          <div className="status status-neutral animate-ping"></div>
          <div className="status status-neutral"></div>
        </div>{" "}
        Active
      </>
    );
  }
  return (
    <>
      <div className="inline-grid *:[grid-area:1/1]">
        <div className="status status-success"></div>
        <div className="status status-success"></div>
      </div>{" "}
      Idle
    </>
  );
}

function sortRunner(
  a: GetRunnersResponse[number],
  b: GetRunnersResponse[number]
) {
  // Busy runners first
  if (a.busy !== b.busy) {
    return a.busy ? -1 : 1;
  }

  const regex = /^([^\d]+)(\d+)?$/; // capture letters as prefix, optional number as suffix

  const [, prefixA, numA] = a.name.match(regex) || [null, a.name, null];
  const [, prefixB, numB] = b.name.match(regex) || [null, b.name, null];

  // Compare prefixes alphabetically
  const prefixCompare = prefixA.localeCompare(prefixB);
  if (prefixCompare !== 0) return prefixCompare;

  // If prefixes are identical, compare numbers numerically
  if (numA && numB) {
    return parseInt(numA, 10) - parseInt(numB, 10);
  }

  return 0;
}

function matchesFilter(
  runner: GetRunnersResponse[number],
  query: string
): boolean {
  const isLabel = query.startsWith("label:");
  if (isLabel) {
    const label = query.split("label:")[1].toLocaleLowerCase();
    return runner.labels.map((l) => l.name.toLowerCase()).includes(label);
  }
  return runner.name.toLocaleLowerCase().includes(query);
}

export const RunnerTable = (props: {
  githubDomain: string;
  githubEnterprise: string;
  runners: GetRunnersResponse;
}) => {
  const [query, setQuery] = useState("");

  const runners = useMemo(
    () => props.runners.filter((r) => matchesFilter(r, query)).sort(sortRunner),
    [query]
  );

  return (
    <div className="overflow-x-auto flex flex-col gap-4">
      <div className="self-end mx-4 mt-1">
        <label className="input">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            className="grow"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <table className="table table-xs table-zebra">
        {/* head */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {runners.map((r) => (
            <tr key={r.id}>
              <th>
                <div className="tooltip tooltip-right">
                  <div className="tooltip-content text-xs">
                    {r.labels
                      .filter((l) => l.type === "custom")
                      .map((l) => l.name)
                      .join(", ")}
                  </div>
                  <a
                    className="btn btn-ghost btn-sm"
                    href={`https://${props.githubDomain}/enterprises/${props.githubEnterprise}/settings/actions/runners/${r.id}`}
                  >
                    {r.name}
                  </a>
                </div>
              </th>
              <td>
                <RunnerStatus runner={r} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
