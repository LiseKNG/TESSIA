// commands/setprefix.js

import fs from 'fs'

export const name = 'setprefix'

const path = './config.js'

export async function execute({
  sock,
  m,
  args
}) {

  try {

    const prefix =
      args[0]

    if (!prefix) {

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 CRIMSON BOT PREFIX 〕━━⬣
┃ ⚠️ Exemple:
┃ .setprefix !
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    let config =
      fs.readFileSync(
        path,
        'utf8'
      )

    config =
      config.replace(
        /prefix:\s*['"`](.*?)['"`]/,
        `prefix: '${prefix}'`
      )

    fs.writeFileSync(
      path,
      config
    )

    await sock.sendMessage(
      m.key.remoteJid,
      {
        text:
`╭━━〔 CRIMSON BOT PREFIX 〕━━⬣

┃ ✅ Nouveau prefix :
┃ ${prefix}

┃ 🔄 Redémarre le bot

╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )

  } catch (e) {

    console.log(e)
  }
}
