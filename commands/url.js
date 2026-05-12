// commands/url.js

export const name = 'url'

export async function execute({ sock, m, args }) {

  try {

    const link = args[0]

    if (!link) {

      return sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 TESSIA URL 〕━━⬣
┃ ⚠️ Ajoute un lien
┃ Exemple:
┃ .url https://google.com
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    await sock.sendMessage(
      m.key.remoteJid,
      {
        text:
`╭━━〔 TESSIA URL 〕━━⬣

┃ 🌐 Lien détecté:
┃ ${link}

┃ ⚡ Powered By TESSIA

╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )

  } catch (e) {

    console.log(e)
  }
}