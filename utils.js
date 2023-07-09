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
    return await response.json();
  }
  async fetchImage(url, headers, body) {
    const response = await this.fetchJson(url, headers, body)
    return Buffer.from(response.image, 'base64');
  }
  saveImage(buffer, name) {
    fs.writeFileSync('/pictures/' + name + '.jpg', buffer)
  }
}

const utilsInstance = new Utils();

module.exports = {
  fetchJson: utilsInstance.fetchJson,
  fetchImage: utilsInstance.fetchImage,
  saveImage: utilsInstance.saveImage
}
