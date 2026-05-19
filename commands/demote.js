// commands/demote.js

export const name = 'demote'

export async function execute({ sock, m }) {

  try {

    // ✅ GROUP ONLY
    if (!m.key.remoteJid.endsWith('@g.us')) {

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 CRIMSON BOT ADMIN 〕━━⬣
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
`╭━━〔 CRIMSON BOT DEMOTE 〕━━⬣
┃ ⚠️ Mentionne un admin
┃ Exemple:
┃ .demote @user
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    // ✅ DEMOTE
    await sock.groupParticipantsUpdate(
      m.key.remoteJid,
      [user],
      'demote'
    )

    // ✅ SEND THUMB
    await sock.sendMessage(
      m.key.remoteJid,
      {
        image: {
          url: './media/thumb.jpg'
        },

        caption:
`╭━━〔 CRIMSON BOT DEMOTE 〕━━⬣

┃ ❌ Administrateur retiré
┃ 👤 @${user.split('@')[0]}

┃ ⚡ Rétrogradation effectuée
┃ ⚡ Powered By CRIMSON

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
`╭━━〔 CRIMSON BOT ERROR 〕━━⬣
┃ ❌ Erreur demote
╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )
  }
}
