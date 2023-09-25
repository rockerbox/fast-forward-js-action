import { GitHubClient } from './github_client_interface'
import { PrCommentMessages } from './comment_messages_interface';


export class FastForwardAction{

  constructor(public client: GitHubClient){
    this.client = client;
  };

  async async_merge_fast_forward(client: GitHubClient): Promise<boolean>{  
    const pr_number = client.get_current_pull_request_number();

    try {
      // attempt fast-forward merge
      await client.fast_forward_target_to_source_async(pr_number);
      return true;
    } catch(error){
      // report failure if ff merge fails
      console.log(error);
      return false;
    }
  }

  async async_comment_on_pr(client: GitHubClient, comment_message: PrCommentMessages, ff_success: boolean){
    const pr_number = client.get_current_pull_request_number();

    const {
      success_message,
      failure_message_same_stage_and_prod,
      failure_message_diff_stage_and_prod
    } = comment_message;

    if (ff_success) {
      await client.comment_on_pull_request_async(pr_number, success_message);
      return;
    } 
      
    try {
      const stageEqualsProd = await client.compare_branch_head(prod_branch, stage_branch);
      const message = stageEqualsProd ? 
        failure_message_same_stage_and_prod : 
        failure_message_diff_stage_and_prod;

      await client.comment_on_pull_request_async(pr_number, message);
    } catch(error){
      console.log(error);
    }
    
  }

};