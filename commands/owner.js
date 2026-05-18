// commands/owner.js

import { reply } from '../lib/reply.js'

import { config } from '../config.js'

export const name = 'owner'

export async function execute({
  sock,
  m,
  thumb
}) {

  try {

    const owner =
      config.owner

    const text =
`╭━━━〔 CRINSON BOT OWNER 〕━━━⬣

┃ 👑 OWNER : ${owner}
┃ 🤖 BOT : CRIMSON BOT UPD2
┃ ⚡ STATUS : ONLINE

┣━━〔 CHANNEL 〕━━⬣
┃ 📢 Rejoins la chaîne
┃ officielle CRIMSON :

┃ ${config.channel}

╰━━━━━━━━━━━━━━━━⬣`

    await sock.sendMessage(
      m.key.remoteJid,
      {
        image: thumb,

        caption: text,

        contextInfo: {

          externalAdReply: {

            title:
              'CRIMSON OFFICIAL CHANNEL',

            body:
              'Clique pour rejoindre',

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
      { quoted: m }
    )

  } catch (e) {

    console.log(
      'OWNER ERROR:',
      e
    )
  }
}
