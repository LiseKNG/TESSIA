// commands/tagall.js

export const name = 'tagall'

export async function execute({
  sock,
  m,
  args,
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
`╭━━〔 CRIMSON TAGALL 〕━━⬣

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

    const sender =
    m.key.participant

    const admins =
    metadata.participants
    .filter(v => v.admin)
    .map(v => v.id)

    if (
      !admins.includes(sender)
    ) {

      return await sock.sendMessage(
        jid,
        {
          image: cache?.thumb,

          caption:
`╭━━〔 CRIMSON TAGALL 〕━━⬣

┃ ❌ Admin seulement

╰━━━━━━━━━━━━⬣`
        },
        {
          quoted: m
        }
      )
    }

    let text =
`╭━━〔 CRIMSON TAGALL 〕━━⬣

┃ 📢 MESSAGE :
┃ ${args.join(' ') || 'Aucune raison'}

┣━━━━━━━━━━━━⬣
`

    const mentions = []

    for (
      const user
      of metadata.participants
    ) {

      mentions.push(user.id)

      text +=
`┃ 👤 @${user.id.split('@')[0]}
`
    }

    text +=
`╰━━━━━━━━━━━━⬣`

    await sock.sendMessage(

      jid,

      {
        image: cache?.thumb,

        caption: text,

        mentions
      },

      {
        quoted: m
      }
    )

  } catch (e) {

    console.log(
      'TAGALL ERROR:',
      e.message
    )
  }
}
