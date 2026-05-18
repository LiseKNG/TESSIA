// commands/play.js

import { reply } from '../lib/reply.js'

export const name = 'play'

export async function execute({ sock, m, args }) {

  try {

    const query = args.join(' ')

    if (!query) {

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 CRIMSON BOT PLAY 〕━━⬣
┃ ⚠️ Donne un son
┃ Exemple:
┃ .play alan walker
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    await sock.sendMessage(
      m.key.remoteJid,
      {
        image: {
          url: './media/thumb.jpg'
        },

        caption:
`╭━━〔 CRIMSON BOT PLAY 〕━━⬣

┃ 🎵 Recherche:
┃ ${query}

┃ ⏳ Téléchargement...
┃ ⚡ Powered By CRIMSON

╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )

  } catch (e) {
    console.log(e)
  }
}
