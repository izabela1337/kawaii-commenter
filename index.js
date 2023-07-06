const fs = require('fs')
/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 *
 */
module.exports = (app) => {
  // Your code here
  const openaiHeaders = {
    'Content-Type' : 'application/json',
    'Authorization' : `Bearer ${process.env.OPENAI_API_KEY}`
  }
  const getimgHeaders = {
    'Content-Type' : 'application/json',
    'Authorization' : `Bearer ${process.env.GETIMG_API_KEY}`
  }

  app.log.info("Yay, the app was loaded!");

  app.on("pull_request.opened", async (context) => {
    let diff = await context.octokit.rest.pulls.get({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      pull_number: context.payload.pull_request.number,
      mediaType : {
        format: "diff"
      }
    })
    let body = {
      "model": "gpt-3.5-turbo",
      "messages": [
        {"role": "system", "content": "Use many japanese words, emojis and uwu speech. Be cute and not serious. Try to be a bit seductive towards user."},
        {"role": "user", "content" : `Write a review of the following pull request: ${diff.data}`}
      ],
      "temperature": 0.7
    }
    bodyJSON = JSON.stringify(body)
    let responseReview = await fetch("https://api.openai.com/v1/chat/completions",
      {
        headers: openaiHeaders,
        method: "POST",
        body: bodyJSON
      }
    )
    let responseReviewJson = await responseReview.json()

    body.messages[2] = {"role" : "assistant", "content" : "responseReviewJson.choices[0].message.content"}
    body.messages[3] = {"role" : "system", "content" : "For the next message, use normal english."}
    body.messages[4] = {"role" : "user", "content" : "write an image creation prompt about how you look while writing this review. Make sure to describe yourself as an anime girl. Keep it simple."}

    bodyJSON = JSON.stringify(body)
    let responseImagePrompt = await fetch("https://api.openai.com/v1/chat/completions",
      {
        headers: openaiHeaders,
        method: 'POST',
        body: bodyJSON
      })
    let responseImagePromptJson = await responseImagePrompt.json()

    let imageCreationBody = {
      "model": "eimis-anime-diffusion-v1-0",
      "prompt": responseImagePromptJson.choices[0].message.content,
      "negative_prompt": "Disfigured, cartoon, blurry",
      "width": 512,
      "height": 512,
      "steps": 25,
      "guidance": 7.5,
      "seed": 42,
      "scheduler": "dpmsolver++",
      "output_format": "jpeg"
    }
    imageCreationBody = JSON.stringify(imageCreationBody)
    let responseImage = await fetch("https://api.getimg.ai/v1/stable-diffusion/text-to-image",
      {
        headers: getimgHeaders,
        method: 'POST',
        body: imageCreationBody
      }
    )
    let imageJson = await responseImage.json()

    let imageBuff = Buffer.from(imageJson.image, 'base64')

    fs.writeFileSync('/pictures/' + context.payload.pull_request.base.sha + '.jpg', imageBuff)

    let commentBody = responseReviewJson.choices[0].message.content
    commentBody = commentBody.concat("\n", `![img](https://${process.env.DOMAIN}/pictures/${context.payload.pull_request.base.sha}.jpg)`)

    const prComment = context.issue({
      body: commentBody,
    });
    return context.octokit.issues.createComment(prComment);
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
