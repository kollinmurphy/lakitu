import { Octokit } from "@octokit/rest";
import { getEnvVar } from "./get-env-var";
import { enterpriseServer315Admin } from "@octokit/plugin-enterprise-server";

const EnterpriseOctokit = Octokit.plugin(enterpriseServer315Admin);

export const getEnterpriseOctokit = () => {
  const runnerAccess = getEnvVar("RUNNER_ACCESS");
  return new EnterpriseOctokit({
    auth: runnerAccess,
    baseUrl: getEnvVar("GITHUB_BASE_URL"),
  });
};
