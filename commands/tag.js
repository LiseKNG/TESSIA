// commands/tag.js

export const name = 'tag'

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
`╭━━〔 CRIMSON TAG 〕━━⬣

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
`╭━━〔 CRIMSON TAG 〕━━⬣

┃ ❌ Admin seulement

╰━━━━━━━━━━━━⬣`
        },
        {
          quoted: m
        }
      )
    }

    const text =
args.join(' ') ||
'CRIMSON TAG'

    const mentions =
metadata.participants.map(
  v => v.id
)

    await sock.sendMessage(

      jid,

      {
        image: cache?.thumb,

        caption:
`╭━━〔 CRIMSON TAG 〕━━⬣

┃ 📢 MESSAGE :

${text}

╰━━━━━━━━━━━━⬣`,

        mentions
      },

      {
        quoted: m
      }
    )

  } catch (e) {

    console.log(
      'TAG ERROR:',
      e.message
    )
  }
}
