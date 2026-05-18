// commands/gpp.js

export const name = 'gpp'

export async function execute({
  sock,
  m
}) {

  try {

    if (
      !m.key.remoteJid.endsWith('@g.us')
    ) {

      return
    }

    const quoted =
      m.message?.extendedTextMessage
      ?.contextInfo
      ?.quotedMessage

    if (!quoted?.imageMessage) {

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 CRIMSON GPP 〕━━⬣
┃ ⚠️ Répond à une image
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    const media =
      await sock.downloadMediaMessage({
        message: quoted
      })

    await sock.updateProfilePicture(
      m.key.remoteJid,
      media
    )

    await sock.sendMessage(
      m.key.remoteJid,
      {
        text:
`╭━━〔 CRIMSON GPP 〕━━⬣
┃ ✅ Photo du groupe modifiée
╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )

  } catch (e) {

    console.log(e)
  }
}
