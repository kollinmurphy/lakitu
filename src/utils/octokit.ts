import { Octokit } from "octokit";
import { getGithubDomain, getRunnerAccess } from "./get-env-var";
import { enterpriseServer315Admin } from "@octokit/plugin-enterprise-server";

const EnterpriseOctokit = Octokit.plugin(enterpriseServer315Admin);

export const getEnterpriseOctokit = () => {
  return new EnterpriseOctokit({
    auth: getRunnerAccess(),
    baseUrl: `https://api.${getGithubDomain()}/api/v3`,
  });
};
