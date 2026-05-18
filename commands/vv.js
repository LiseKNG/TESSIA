// commands/vv.js

import { reply } from '../lib/reply.js'

export const name = 'vv'

export async function execute({ sock, m }) {

  try {

    const quoted =
      m.message?.extendedTextMessage
      ?.contextInfo
      ?.quotedMessage

    if (!quoted) {

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 CRIMSON BOT VV 〕━━⬣
┃ ⚠️ Répond à une vue unique
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    // ✅ VIEWONCE V1
    const viewOnce =
      quoted?.viewOnceMessage
      ?.message

    // ✅ VIEWONCE V2
    const viewOnceV2 =
      quoted?.viewOnceMessageV2
      ?.message

    const msg =
      viewOnce || viewOnceV2

    if (!msg) {

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 CRIMSON BOT VV 〕━━⬣
┃ ❌ Ceci n'est pas une vue unique
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    // ✅ IMAGE
    if (msg.imageMessage) {

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          image: {
            url:
            await sock.downloadMediaMessage({
              message: {
                imageMessage:
                msg.imageMessage
              }
            })
          },

          caption:
`╭━━〔 CRIMSON BOT VV 〕━━⬣
┃ 🖼️ Image récupérée
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    // ✅ VIDEO
    if (msg.videoMessage) {

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          video: {
            url:
            await sock.downloadMediaMessage({
              message: {
                videoMessage:
                msg.videoMessage
              }
            })
          },

          caption:
`╭━━〔 CRIMSON BOT VV 〕━━⬣
┃ 🎥 Vidéo récupérée
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

  } catch (e) {

    console.log(
      'VV ERROR:',
      e
    )

    await sock.sendMessage(
      m.key.remoteJid,
      {
        text:
`╭━━〔 CRIMSON BOT ERROR 〕━━⬣
┃ ❌ Erreur VV
╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )
  }
}
