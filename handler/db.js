import fs from 'fs'

const path = './database.json'

export function loadDB() {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({
      antilink: [],
      warns: {}
    }, null, 2))
  }

  return JSON.parse(fs.readFileSync(path))
}
