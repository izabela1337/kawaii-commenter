const openai = require('./openai')
const getimg = require('./getimg')
const utils = require('./utils');
/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 *
 */
module.exports = (app) => {

  app.log.info("Yay, the app was loaded!");

  app.on("pull_request.opened", async (context) => {
    try {
      let diff = await context.octokit.rest.pulls.get({
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        pull_number: context.payload.pull_request.number,
        mediaType : {
          format: "diff"
        }
      })
      let responseReview = await openai.createReview(diff)
      let responseImagePrompt = await openai.createImagePrompt(responseReview.choices)
      let responseImage = await getimg.createImage(responseImagePrompt.choices[0].message.content)
      utils.saveImage(responseImage, context.payload.pull_request.base.sha)

      let commentBody = responseReview.choices[0].message.content
      commentBody = commentBody.concat("\n", `![img](https://${process.env.DOMAIN}/pictures/${context.payload.pull_request.base.sha}.jpg)`)
      commentBody = utils.addFooter(commentBody)
      const prComment = context.issue({
        body: commentBody,
      });
      return context.octokit.issues.createComment(prComment);
    } catch (err) {
      utils.returnErrorComment(context, err)
    }
  });

  app.on("issue_comment.created", async (context) => {
    let commentBody = context.payload.comment.body;
    let commentAuthor = context.payload.comment.user.login;
    if (commentBody.includes("@kawaii-commenter") && commentAuthor != "kawaii-commenter[bot]") {
      try {
        let response = await openai.createResponse(context)

        let responseComment = context.issue({
          body: utils.addFooter(response.choices[0].message.content)
        })
        return context.octokit.issues.createComment(responseComment)
      } catch (err) {
        console.log(err)
      }
    }
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
