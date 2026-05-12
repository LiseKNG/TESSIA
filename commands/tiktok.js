// commands/tiktok.js

export const name = 'tiktok'

export async function execute({ sock, m, args }) {

  try {

    const url = args[0]

    if (!url) {

      return sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 TESSIA TIKTOK 〕━━⬣
┃ ⚠️ Ajoute un lien TikTok
┃ Exemple:
┃ .tiktok lien
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
`╭━━〔 TESSIA TIKTOK 〕━━⬣

┃ 🎬 Téléchargement TikTok
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