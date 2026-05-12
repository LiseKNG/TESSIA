// commands/pinterest.js

export const name = 'pinterest'

export async function execute({ sock, m, args }) {

  try {

    const query = args.join(' ')

    if (!query) {

      return sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 TESSIA PINTEREST 〕━━⬣
┃ ⚠️ Donne une recherche
┃ Exemple:
┃ .pinterest anime
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
`╭━━〔 TESSIA PINTEREST 〕━━⬣

┃ 🖼️ Recherche:
┃ ${query}

┃ ⚡ Powered By TESSIA

╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )

  } catch (e) {
    console.log(e)
  }
}