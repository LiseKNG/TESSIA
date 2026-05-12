// commands/welcome.js

import fs from 'fs'

export const name = 'welcome'

const path = './database.json'

function loadDB() {
  return JSON.parse(fs.readFileSync(path))
}

function saveDB(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2))
}

export async function execute({ sock, m, args }) {

  try {

    if (!m.key.remoteJid.endsWith('@g.us')) {

      return sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 TESSIA WELCOME 〕━━⬣
┃ ❌ Groupe uniquement
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    const db = loadDB()

    if (!db.welcome)
      db.welcome = []

    const group =
      m.key.remoteJid

    if (args[0] === 'on') {

      if (!db.welcome.includes(group))
        db.welcome.push(group)

      saveDB(db)

      return sock.sendMessage(
        group,
        {
          image: {
            url: './media/thumb.jpg'
          },

          caption:
`╭━━〔 TESSIA WELCOME 〕━━⬣

┃ ✅ Welcome activé
┃ 👋 Les nouveaux membres
┃ recevront un message.

┃ ⚡ Powered By TESSIA

╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    if (args[0] === 'off') {

      db.welcome =
        db.welcome.filter(
          v => v !== group
        )

      saveDB(db)

      return sock.sendMessage(
        group,
        {
          image: {
            url: './media/thumb.jpg'
          },

          caption:
`╭━━〔 TESSIA WELCOME 〕━━⬣

┃ ❌ Welcome désactivé

┃ ⚡ Powered By TESSIA

╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

  } catch (e) {

    console.log(e)
  }
}