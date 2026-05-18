// lib/reply.js

import { config } from '../config.js'

export async function reply(
  sock,
  jid,
  text,
  quoted,
  thumb = null
) {

  return await sock.sendMessage(
    jid,
    {
      image: thumb,

      caption: text,

      contextInfo: {

        externalAdReply: {

          title:
            'CRIMSON BOT UPD2',

          body:
            'Official WhatsApp Channel',

          thumbnailUrl:
'https://i.imgur.com/JPw4L1x.jpeg',

          sourceUrl:
            config.channel,

          mediaType: 1,

          renderLargerThumbnail: true,

          showAdAttribution: true
        }
      }
    },
    { quoted }
  )
}
