// commands/unmute.js

export const name = 'unmute'

export async function execute({ sock, m }) {

  try {

    // ✅ CHECK GROUP
    if (!m.key.remoteJid.endsWith('@g.us')) {

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 TESSIA GROUP 〕━━⬣
┃ ❌ Groupe uniquement
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    // ✅ OPEN GROUP
    await sock.groupSettingUpdate(
      m.key.remoteJid,
      'not_announcement'
    )

    // ✅ SEND THUMB IMAGE
    await sock.sendMessage(
      m.key.remoteJid,
      {
        image: {
          url: './media/thumb.jpg'
        },

        caption:
`╭━━〔 TESSIA UNMUTE 〕━━⬣

┃ 🔊 GROUPE OUVERT
┃ ✅ Tous les membres
┃ peuvent maintenant écrire.

┃ ⚡ Powered By TESSIA
╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )

  } catch (e) {

    console.log(e)

    await sock.sendMessage(
      m.key.remoteJid,
      {
        text:
`╭━━〔 TESSIA ERROR 〕━━⬣
┃ ❌ Erreur unmute
╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )
  }
}