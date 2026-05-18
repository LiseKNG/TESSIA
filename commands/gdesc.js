// commands/gdesc.js

export const name = 'gdesc'

export async function execute({
  sock,
  m,
  args
}) {

  try {

    if (
      !m.key.remoteJid.endsWith('@g.us')
    ) {

      return
    }

    const text =
      args.join(' ')

    if (!text) {

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 CRIMSON GDESC 〕━━⬣
┃ ⚠️ Donne une description
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    await sock.groupUpdateDescription(
      m.key.remoteJid,
      text
    )

    await sock.sendMessage(
      m.key.remoteJid,
      {
        text:
`╭━━〔 CRIMSON GDESC 〕━━⬣

┃ ✅ Description modifiée

╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )

  } catch (e) {

    console.log(e)
  }
}
