export type GetRunnersResponse = {
  id: number;
  name: string;
  os: "Linux" | "Windows";
  status: "online" | "offline";
  busy: boolean;
  labels: {
    id: number;
    name: string;
    type: "read-only" | "custom";
  }[];
}[];
