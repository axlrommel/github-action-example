import { Context } from '@actions/github/lib/context';
import { Octokit } from '@octokit/core';

export const getContextObj = (context: Context) => {
  return {
    pullRequestTitle: context.payload?.pull_request?.title,
    pullRequestDescription: context.payload?.pull_request?.body,
    pullRequestCreatedAt: context.payload?.pull_request?.created_at,
    pullRequestUpdatedAt: context.payload?.pull_request?.updated_at,
    pullRequestHtmlUrl: context.payload?.pull_request?.html_url,
    pullRequestApiUrl: context.payload?.pull_request?.url,
    pullRequestLineAdditions: context.payload?.pull_request?.additions,
    pullRequestLineDeletions: context.payload?.pull_request?.deletions,
    pullRequestChangedFiles: context.payload?.pull_request?.changed_files,
    pullRequestCommits: context.payload?.pull_request?.commits,
    repositoryName: context.payload?.repository?.full_name,
    repositoryHtmlUrl: context.payload?.repository?.html_url,
    repositoryApiUrl: context.payload?.repository?.url,
    job: context.job,
    sha: context.sha,
    ref: context.ref,
    owner: context.payload?.repository?.full_name.split('/')[0],
    workflow: context.workflow,
    action: context.action,
    actor: context.actor,
    runNumber: context.runNumber,
    eventName: context.eventName,
    runUrl: `https://github.com/${context.payload.repository?.full_name}/actions/runs/${context.runId}`,
    time: new Date(),
  };
};

export const getJobs = async (
  githubToken: string,
  repo = '',
  owner = '',
  runId: number
) => {
  if (repo === '' || owner === '') {
    return {};
  }
  const octokit = new Octokit({
    auth: githubToken,
  });

  const jobResponse = await octokit.request(
    'GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs?filter=all',
    {
      owner,
      repo,
      run_id: runId,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  );

  const jobIds = jobResponse.data.jobs.map(job => job.id).sort((a, b) => a > b ? -1 : 1);
  return jobResponse.data.jobs.find((job) => {
    if (job.id === jobIds[0])
      return {
        id: job.id,
        html_url: job.html_url,
        check_run_url: job.check_run_url,
        name: job.name,
        status: job.status,
        steps: job.steps,
        conclusion: job.conclusion,
        started_at: job.started_at,
        completed_at: job.completed_at,
      }
  });
};
