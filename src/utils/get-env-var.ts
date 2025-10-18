import dotenv from "dotenv";

dotenv.config({ quiet: true });

export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

export function getGithubEnterprise(): string {
  return getEnvVar("GITHUB_ENTERPRISE");
}

export function getRunnerAccess(): string {
  return getEnvVar("RUNNER_ACCESS");
}

export function getGithubDomain(): string {
  return getEnvVar("GITHUB_DOMAIN");
}
