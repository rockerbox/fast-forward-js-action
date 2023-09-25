import * as core from '@actions/core';
import * as github from '@actions/github';
import { GitHubClientWrapper } from './github_client_wrapper';
import { FastForwardAction } from './fast_forward_action';

async function run(): Promise<void>{
  const github_token = core.getInput('GITHUB_TOKEN');
  
  const success_message = core.getInput('success_message') || "Fast-forward Succeeded!";
  const failure_message = core.getInput('failure_message') || "Fast-forward Failed!";
  const failure_message_same_stage_and_prod = failure_message + " Branches are the same.";
  const failure_message_diff_stage_and_prod = failure_message + " Fast-forward could not be executed.";
  
  const comment_messages = {
    success_message: success_message,
    failure_message_same_stage_and_prod: failure_message_same_stage_and_prod,
    failure_message_diff_stage_and_prod: failure_message_diff_stage_and_prod
  }

  const client = new GitHubClientWrapper(github.context , github_token);
  const fastForward = new FastForwardAction(client);

  const ff_success = await fastForward.async_merge_fast_forward(client);
  await fastForward.async_comment_on_pr(client, comment_messages, ff_success);

}

run();
