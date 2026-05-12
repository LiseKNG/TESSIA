// commands/kick.js

export const name = 'kick'

export async function execute({ sock, m }) {

  try {

    // ✅ GROUP ONLY
    if (!m.key.remoteJid.endsWith('@g.us')) {

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 TESSIA KICK 〕━━⬣
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
`╭━━〔 TESSIA KICK 〕━━⬣
┃ ⚠️ Mentionne un membre
┃ Exemple:
┃ .kick @user
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    // ✅ REMOVE USER
    await sock.groupParticipantsUpdate(
      m.key.remoteJid,
      [user],
      'remove'
    )

    // ✅ SEND IMAGE
    await sock.sendMessage(
      m.key.remoteJid,
      {
        image: {
          url: './media/thumb.jpg'
        },

        caption:
`╭━━〔 TESSIA KICK 〕━━⬣

┃ 👢 Membre expulsé
┃ 👤 @${user.split('@')[0]}

┃ ⚡ Action effectuée
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
┃ ❌ Erreur kick
╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )
  }
}