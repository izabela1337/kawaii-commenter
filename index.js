/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 *
 */
module.exports = (app) => {
  // Your code here
  const headers = {
    'Content-Type' : 'application/json',
    'Authorization' : `Bearer ${process.env.OPENAI_API_KEY}`
  }
  app.log.info("Yay, the app was loaded!");

  app.on("pull_request.opened", async (context) => {
    let diff = await context.octokit.rest.pulls.get({
      owner: context.payload.repository.user.login,
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
    body = JSON.stringify(body)
    let response = await fetch("https://api.openai.com/v1/chat/completions",
      {
        headers: headers,
        method: "POST",
        body: body
      }
    )
    let responseJson = await response.json()

    const prComment = context.issue({
      body: responseJson.choices[0].message.content,
    });
    return context.octokit.issues.createComment(prComment);
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
