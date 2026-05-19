// commands/goodbye.js

import fs from 'fs'

export const name = 'goodbye'

const path = './database.json'

// ✅ LOAD DATABASE
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

// ✅ SAVE DATABASE
function saveDB(data) {

  fs.writeFileSync(
    path,
    JSON.stringify(data, null, 2)
  )
}

export async function execute({
  sock,
  m,
  args
}) {

  try {

    // ✅ GROUP ONLY
    if (
      !m.key.remoteJid.endsWith('@g.us')
    ) {

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 CRIMSON BOT GOODBYE 〕━━⬣
┃ ❌ Groupe uniquement
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    // ✅ DATABASE
    const db = loadDB()

    // ✅ CREATE ARRAY
    if (!db.goodbye)
      db.goodbye = []

    const group =
      m.key.remoteJid

    // ✅ ON
    if (args[0] === 'on') {

      if (
        !db.goodbye.includes(group)
      ) {

        db.goodbye.push(group)
      }

      saveDB(db)

      return await sock.sendMessage(
        group,
        {
          image: {
            url: './media/thumb.jpg'
          },

          caption:
`╭━━〔 CRIMSON BOT GOODBYE 〕━━⬣

┃ ✅ Goodbye activé
┃ 👋 Les départs seront
┃ maintenant annoncés

┃ ⚡ Powered By CRIMSON

╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    // ✅ OFF
    if (args[0] === 'off') {

      db.goodbye =
        db.goodbye.filter(
          v => v !== group
        )

      saveDB(db)

      return await sock.sendMessage(
        group,
        {
          image: {
            url: './media/thumb.jpg'
          },

          caption:
`╭━━〔 CRIMSON BOT GOODBYE 〕━━⬣

┃ ❌ Goodbye désactivé

┃ ⚡ Powered By CRIMSON

╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    // ✅ HELP
    return await sock.sendMessage(
      group,
      {
        text:
`╭━━〔 CRIMDON BOT GOODBYE 〕━━⬣

┃ ⚠️ Utilisation :
┃ .goodbye on
┃ .goodbye off

╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )

  } catch (e) {

    console.log(
      'GOODBYE ERROR:',
      e
    )

    await sock.sendMessage(
      m.key.remoteJid,
      {
        text:
`╭━━〔 CRIMSON BOT ERROR 〕━━⬣
┃ ❌ Erreur goodbye
╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )
  }
}
