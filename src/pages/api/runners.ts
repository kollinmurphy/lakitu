import { getEnterpriseOctokit } from "../../webhook/octokit";
import { getEnvVar } from "../../webhook/get-env-var";

export async function GET() {
  const octokit = getEnterpriseOctokit();
  const runners = await octokit.request(
    "GET /enterprises/{enterprise}/actions/runners",
    {
      enterprise: getEnvVar("GITHUB_ENTERPRISE"),
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  return new Response(JSON.stringify(runners.data), { status: 200 });
}
