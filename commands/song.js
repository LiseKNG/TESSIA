// commands/song.js

export const name = 'song'

export async function execute({ sock, m, args }) {

  try {

    const query = args.join(' ')

    if (!query) {

      return sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 TESSIA SONG 〕━━⬣
┃ ⚠️ Donne un titre
┃ Exemple:
┃ .song imagine dragons
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
`╭━━〔 TESSIA SONG 〕━━⬣

┃ 🎶 Chanson:
┃ ${query}

┃ ⚡ Recherche audio...
┃ ⚡ Powered By TESSIA

╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )

  } catch (e) {
    console.log(e)
  }
}