// commands/vv.js

export const name = 'vv'

export async function execute({ sock, m }) {

  try {

    const quoted =
      m.message?.extendedTextMessage
      ?.contextInfo

    if (!quoted?.quotedMessage) {

      return sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 TESSIA VV 〕━━⬣
┃ ⚠️ Répond à une vue unique
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    await sock.sendMessage(
      m.key.remoteJid,
      {
        text:
`╭━━〔 TESSIA VV 〕━━⬣
┃ ✅ View Once détectée
┃ ⚡ Fonction VV active
╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )

  } catch (e) {

    console.log(e)
  }
}