// commands/play.js

export const name = 'play'

export async function execute({ sock, m, args }) {

  try {

    const query = args.join(' ')

    if (!query) {

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 TESSIA PLAY 〕━━⬣
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
`╭━━〔 TESSIA PLAY 〕━━⬣

┃ 🎵 Recherche:
┃ ${query}

┃ ⏳ Téléchargement...
┃ ⚡ Powered By TESSIA

╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )

  } catch (e) {
    console.log(e)
  }
}