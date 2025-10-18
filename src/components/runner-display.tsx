import { useEffect } from "react";

export const RunnerDisplay = () => {
  useEffect(() => {
    fetch("/api/runners")
      .then((res) => res.json())
      .then((data) => {
        console.log("Runners:", data);
      });
  });

  return <div>Runner Display Component</div>;
};
