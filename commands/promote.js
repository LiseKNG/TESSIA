// commands/promote.js

export const name = 'promote'

export async function execute({ sock, m }) {

  try {

    // ✅ GROUP ONLY
    if (!m.key.remoteJid.endsWith('@g.us')) {

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 TESSIA ADMIN 〕━━⬣
┃ ❌ Groupe uniquement
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    // ✅ GET USER
    const user =
      m.message?.extendedTextMessage
      ?.contextInfo
      ?.mentionedJid?.[0]

    if (!user) {

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 TESSIA PROMOTE 〕━━⬣
┃ ⚠️ Mentionne un membre
┃ Exemple:
┃ .promote @user
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    // ✅ PROMOTE
    await sock.groupParticipantsUpdate(
      m.key.remoteJid,
      [user],
      'promote'
    )

    // ✅ SEND THUMB
    await sock.sendMessage(
      m.key.remoteJid,
      {
        image: {
          url: './media/thumb.jpg'
        },

        caption:
`╭━━〔 TESSIA PROMOTE 〕━━⬣

┃ 👑 Nouveau Administrateur
┃ 👤 @${user.split('@')[0]}

┃ ✅ Promotion effectuée
┃ ⚡ Powered By TESSIA

╰━━━━━━━━━━━━⬣`,

        mentions: [user]
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
┃ ❌ Erreur promote
╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )
  }
}