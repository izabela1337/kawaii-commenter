const utils = require('./utils')

const openapi_url = "https://api.openai.com/v1/chat/completions"
const openaiHeaders = {
  'Content-Type' : 'application/json',
  'Authorization' : `Bearer ${process.env.OPENAI_API_KEY}`
}
const personality = "Use many japanese words, emojis and uwu speech. Be cute and not serious. Try to be a bit seductive towards user."

class Openai {
  async createReview(diff) {
    let body = {
      "model": "gpt-3.5-turbo",
      "messages": [
        {"role": "system", "content": personality},
        {"role": "user", "content" : `Write a review of the following pull request: ${diff.data}. Try to find bugs in code and offer suggestions how it can be improved.`}
      ],
      "temperature": 0.7
    }
    return await utils.fetchJson(openapi_url, openaiHeaders, body)
  }

  async createImagePrompt(messageHistory) {
    let body = {
      "model": "gpt-3.5-turbo",
      "messages": [
        {"role": "system", "content": personality}
      ],
      "temperature": 0.7
    }
    messageHistory.forEach(entry => {
      body.messages.push({"role": entry.message.role, content: entry.message.content})
    })
    body.messages.push(
        {"role" : "system", "content" : "For the next message, use normal english."},
        {"role" : "user", "content" : "Write an image creation prompt about how you look while writing this review. Make sure to describe yourself as an anime girl. Keep it simple."}
    )
    return await utils.fetchJson(openapi_url, openaiHeaders, body)
  }
}

const openaiInstance = new Openai();

module.exports = {
  createReview: openaiInstance.createReview,
  createImagePrompt: openaiInstance.createImagePrompt
};
