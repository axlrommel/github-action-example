import * as core from '@actions/core';
import { to } from 'await-to-js';
import { context } from '@actions/github';
import { getContextObj, getJobs } from './utils';

async function run() {
  try {
    const metricsArgs = getContextObj(context);
    const token = core.getInput('github-token');
    const branchName = core.getInput('branch-name');
    const metricsApi = core.getInput('metrics-api');
    const status = core.getInput('status');
    const prType = core.getInput('pr-type');
    const merged = core.getInput('merged') ? true : false;
    const repositoryName = context.payload.repository?.full_name?.substring(
      `${metricsArgs.owner}/`.length
    );
    const runId = context.runId;
    const jobName = context.job;
    const jobs = await getJobs(token, repositoryName, metricsArgs.owner, runId);
    const metricsObj = {
      jobDetails: jobs,
      status,
      branchName,
      prType,
      merged,
      currentJob: jobName,
      ...metricsArgs,
    };
    if (metricsApi) {
      const [err] = await to(
        fetch(metricsApi, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metricsObj),
        })
      );
      if (err) {
        return core.setFailed('Failed to update CI/CD data');
      }
    }
    core.exportVariable('METRICS_OUTPUT', JSON.stringify(metricsObj, null, 2));
    return core.info('Update CI/CD Data');
  } catch (e) {}
}

run();
