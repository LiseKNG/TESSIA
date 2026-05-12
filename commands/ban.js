// commands/ban.js

import fs from 'fs'

export const name = 'ban'

const path = './database.json'

function loadDB() {
  return JSON.parse(fs.readFileSync(path))
}

function saveDB(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2))
}

export async function execute({ sock, m }) {

  try {

    const user =
      m.message?.extendedTextMessage
      ?.contextInfo
      ?.mentionedJid?.[0]

    if (!user) {

      return sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 TESSIA BAN 〕━━⬣
┃ ⚠️ Mentionne un membre
┃ Exemple:
┃ .ban @user
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    const db = loadDB()

    if (!db.banned)
      db.banned = []

    if (!db.banned.includes(user))
      db.banned.push(user)

    saveDB(db)

    await sock.sendMessage(
      m.key.remoteJid,
      {
        image: {
          url: './media/thumb.jpg'
        },

        caption:
`╭━━〔 TESSIA BAN 〕━━⬣

┃ 🚫 Utilisateur banni
┃ 👤 @${user.split('@')[0]}

┃ ⚡ Powered By TESSIA

╰━━━━━━━━━━━━⬣`,

        mentions: [user]
      },
      { quoted: m }
    )

  } catch (e) {

    console.log(e)
  }
}