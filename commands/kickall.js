// commands/kickall.js

import { config } from '../config.js'

export const name = 'kickall'

export async function execute({ sock, m }) {

  try {

    // ✅ GROUP ONLY
    if (!m.key.remoteJid.endsWith('@g.us')) {

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 CRIMSON BOT KICKALL 〕━━⬣
┃ ❌ Groupe uniquement
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    // ✅ GROUP DATA
    const group =
      await sock.groupMetadata(
        m.key.remoteJid
      )

    // ✅ START MESSAGE
    await sock.sendMessage(
      m.key.remoteJid,
      {
        image: {
          url: './media/thumb.jpg'
        },

        caption:
`╭━━〔 CRIMSON BOT KICKALL 〕━━⬣

┃ ⚠️ Suppression massive
┃ 🚫 Tous les membres
┃ seront expulsés.

┃ ⚡ Powered By CRIMSON

╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )

    // ✅ REMOVE USERS
    for (const member of group.participants) {

      const jid = member.id

      // ❌ DON'T REMOVE OWNER
      if (
        jid.includes(config.owner)
      ) continue

      // ❌ DON'T REMOVE BOT
      if (
        jid === sock.user.id
      ) continue

      try {

        await sock.groupParticipantsUpdate(
          m.key.remoteJid,
          [jid],
          'remove'
        )

      } catch {}
    }

    // ✅ END MESSAGE
    await sock.sendMessage(
      m.key.remoteJid,
      {
        text:
`╭━━〔 CRIMSON BOT DONE 〕━━⬣
┃ ✅ Kickall terminé
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
`╭━━〔 CRIMSON BOT ERROR 〕━━⬣
┃ ❌ Erreur kickall
╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )
  }
}
