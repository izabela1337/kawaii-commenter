const fs = require('fs');

class Utils {
  async fetchJson(url, headers, body) {
    body = JSON.stringify(body)
    const response = await fetch(
      url,
      {
        headers: headers,
        method: "POST",
        body: body
      }
    )
    if (!response.ok){
      console.log(await response.json())
      throw new Error(`There was a problem contacting ${url}.`)
    }
    return await response.json();
  }
  async fetchImage(url, headers, body) {
    const response = await this.fetchJson(url, headers, body)
    return Buffer.from(response.image, 'base64');
  }
  saveImage(buffer, name) {
    fs.writeFileSync('/pictures/' + name + '.jpg', buffer)
  }
  returnErrorComment(context, error) {
    console.log(error)
    let message = "Sowwy, something went oopsy doopsy and I could not complete a reqwwest for you 😭😭😭. If this occurs frequently, please contact app owner @izabela1337."
    message = message.concat("\n", "The error was:", "\n", "```", error, "```")
    let body = context.issue({
      body : message
    })
    context.octokit.issues.createComment(body)
  }
}

const utilsInstance = new Utils();

module.exports = {
  fetchJson: utilsInstance.fetchJson,
  fetchImage: utilsInstance.fetchImage,
  saveImage: utilsInstance.saveImage,
  returnErrorComment: utilsInstance.returnErrorComment
}
