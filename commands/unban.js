// commands/unban.js

import { reply } from '../lib/reply.js'

import fs from 'fs'

export const name = 'unban'

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
`╭━━〔 CRIMSON BOT UNBAN 〕━━⬣
┃ ⚠️ Mentionne un membre
┃ Exemple:
┃ .unban @user
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    const db = loadDB()

    if (!db.banned)
      db.banned = []

    db.banned =
      db.banned.filter(v => v !== user)

    saveDB(db)

    await sock.sendMessage(
      m.key.remoteJid,
      {
        image: {
          url: './media/thumb.jpg'
        },

        caption:
`╭━━〔 CRIMSON BOT UNBAN 〕━━⬣

┃ ✅ Utilisateur débanni
┃ 👤 @${user.split('@')[0]}

┃ ⚡ Powered By CRIMSON

╰━━━━━━━━━━━━⬣`,

        mentions: [user]
      },
      { quoted: m }
    )

  } catch (e) {

    console.log(e)
  }
}
