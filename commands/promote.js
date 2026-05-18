// commands/promote.js

import { reply } from '../lib/reply.js'

export const name = 'promote'

export async function execute({ sock, m }) {

  try {

    // ✅ GROUP ONLY
    if (!m.key.remoteJid.endsWith('@g.us')) {

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 CRIMSON BO ADMIN 〕━━⬣
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
`╭━━〔 CRIMSON BOT PROMOTE 〕━━⬣
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
`╭━━〔 CRIMSON BOT PROMOTE 〕━━⬣

┃ 👑 Nouveau Administrateur
┃ 👤 @${user.split('@')[0]}

┃ ✅ Promotion effectuée
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
┃ ❌ Erreur promote
╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )
  }
}
