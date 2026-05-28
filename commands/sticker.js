// commands/sticker.js

import {
  downloadContentFromMessage
} from '@whiskeysockets/baileys'

export const name = 'sticker'

async function getBuffer(stream) {

  let buffer = Buffer.from([])

  for await (const chunk of stream) {

    buffer = Buffer.concat([
      buffer,
      chunk
    ])
  }

  return buffer
}

export async function execute({
  sock,
  m
}) {

  try {

    const jid =
    m.key.remoteJid

    const quoted =
    m.message?.extendedTextMessage
    ?.contextInfo?.quotedMessage

    if (!quoted) {

      return await sock.sendMessage(
        jid,
        {
          text:
`╭━━〔 CRIMSON STICKER 〕━━⬣

┃ ❌ Réponds à :
┃ • image
┃ • vidéo

╰━━━━━━━━━━━━⬣`
        },
        {
          quoted: m
        }
      )
    }

    // ✅ IMAGE
    if (quoted.imageMessage) {

      const stream =
      await downloadContentFromMessage(
        quoted.imageMessage,
        'image'
      )

      const buffer =
      await getBuffer(stream)

      return await sock.sendMessage(

        jid,

        {
          sticker: buffer
        },

        {
          quoted: m
        }
      )
    }

    // ✅ VIDEO
    if (quoted.videoMessage) {

      const stream =
      await downloadContentFromMessage(
        quoted.videoMessage,
        'video'
      )

      const buffer =
      await getBuffer(stream)

      return await sock.sendMessage(

        jid,

        {
          sticker: buffer
        },

        {
          quoted: m
        }
      )
    }

    await sock.sendMessage(
      jid,
      {
        text:
`╭━━〔 CRIMSON STICKER 〕━━⬣

┃ ❌ Média invalide

╰━━━━━━━━━━━━⬣`
      },
      {
        quoted: m
      }
    )

  } catch (e) {

    console.log(
      'STICKER ERROR:',
      e.message
    )
  }
}
