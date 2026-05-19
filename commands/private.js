// commands/private.js

import fs from 'fs'

export const name = 'private'

const path = './database.json'

function loadDB() {

  if (!fs.existsSync(path)) {

    fs.writeFileSync(
      path,
      JSON.stringify({}, null, 2)
    )
  }

  return JSON.parse(
    fs.readFileSync(path)
  )
}

function saveDB(data) {

  fs.writeFileSync(
    path,
    JSON.stringify(data, null, 2)
  )
}

export async function execute({
  sock,
  m,
  thumb
}) {

  try {

    const db = loadDB()

    db.mode = 'private'

    saveDB(db)

    await sock.sendMessage(
      m.key.remoteJid,
      {
        image: thumb,

        caption:
`╭━━〔 CRIMSON PRIVATE 〕━━⬣

┃ 🔒 Le bot est maintenant
┃ en mode PRIVATE

┃ 👑 Seul le owner peut
┃ utiliser les commandes

┃ 🚫 Anti spam DM activé

╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )

  } catch (e) {

    console.log(e)
  }
}
