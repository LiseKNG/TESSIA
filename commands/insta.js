// commands/insta.js

export const name = 'insta'

export async function execute({ sock, m, args }) {

  try {

    const url = args[0]

    if (!url) {

      return sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 TESSIA INSTAGRAM 〕━━⬣
┃ ⚠️ Ajoute un lien Instagram
┃ Exemple:
┃ .insta lien
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
`╭━━〔 TESSIA INSTAGRAM 〕━━⬣

┃ 📸 Téléchargement Instagram
┃ 🌐 ${url}

┃ ⚡ Powered By TESSIA

╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )

  } catch (e) {
    console.log(e)
  }
}