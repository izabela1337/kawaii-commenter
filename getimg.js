const utils = require('./utils')

const getimg_url = "https://api.getimg.ai/v1/stable-diffusion/text-to-image"
const getimgHeaders = {
  'Content-Type' : 'application/json',
  'Authorization' : `Bearer ${process.env.GETIMG_API_KEY}`
}

class Getimg {
  async createImage(prompt) {
    let body = {
      "model": "eimis-anime-diffusion-v1-0",
      "prompt": prompt,
      "negative_prompt": "Disfigured, cartoon, blurry",
      "width": 256,
      "height": 256,
      "steps": 25,
      "guidance": 7.5,
      "seed": 42,
      "scheduler": "dpmsolver++",
      "output_format": "jpeg"
    }
    return await utils.fetchImage(getimg_url, getimgHeaders, body)
  }
}

const getimgInstance = new Getimg();

module.exports = {
  createImage: getimgInstance.createImage,
}
