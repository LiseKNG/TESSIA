// commands/gstatut.js

export const name = 'gstatut'

export async function execute({
  sock,
  m,
  cache
}) {

  try {

    const jid =
    m.key.remoteJid

    if (
      !jid.endsWith('@g.us')
    ) {

      return await sock.sendMessage(
        jid,
        {
          image: cache?.thumb,

          caption:
`╭━━〔 CRIMSON GROUP STATUS 〕━━⬣

┃ ❌ Groupe uniquement

╰━━━━━━━━━━━━⬣`
        },
        {
          quoted: m
        }
      )
    }

    const metadata =
    await sock.groupMetadata(jid)

    const admins =
    metadata.participants
    .filter(v => v.admin)

    const total =
    metadata.participants.length

    const desc =
    metadata.desc || 'Aucune'

    const owner =
    metadata.owner
    ? metadata.owner.split('@')[0]
    : 'Inconnu'

    let adminText = ''

    for (const adm of admins) {

      adminText +=
`┃ 👑 @${adm.id.split('@')[0]}
`
    }

    await sock.sendMessage(

      jid,

      {
        image: cache?.thumb,

        caption:
`╭━━〔 CRIMSON GROUP STATUS 〕━━⬣

┃ 🏠 Nom :
┃ ${metadata.subject}

┃ 👥 Membres :
┃ ${total}

┃ 👑 Owner :
┃ @${owner}

┃ 📝 Description :
┃ ${desc}

┣━━━━━━━━━━━━⬣
${adminText}
╰━━━━━━━━━━━━⬣`,

        mentions: [
          ...admins.map(v => v.id),
          metadata.owner
        ]
      },

      {
        quoted: m
      }
    )

  } catch (e) {

    console.log(
      'GSTATUT ERROR:',
      e.message
    )
  }
}
