// commands/menu.js

import { reply } from '../lib/reply.js'

import os from 'os'

export const name = 'menu'

export async function execute({
  sock,
  m,
  pushName,
  thumb,
  menuVideo
}) {

  try {

    const ram =
Math.round(
(
(os.totalmem() - os.freemem())
/
1024
/
1024
/
1024
) * 100
) / 100

    const date =
new Date().toLocaleString()

    const user =
pushName || 'Unknown'

    const text =
`╭━━━〔 TESSIA MENU 〕━━━⬣

┃ 👤 USER : ${user}
┃ 🧠 RAM : ${ram} GB
┃ 📅 DATE : ${date}

┣━━〔 OWNER 〕━━⬣
┃ .sudo
┃ .delsudo
┃ .public
┃ .private
┃ .ban
┃ .unban

┣━━〔 GROUP 〕━━⬣
┃ .tagall
┃ .hidetag
┃ .kick
┃ .kickall
┃ .promote
┃ .demote
┃ .mute
┃ .unmute
┃ .antilink
┃ .antibot
┃ .welcome
┃ .goodbye

┣━━〔 DOWNLOAD 〕━━⬣
┃ .play
┃ .song
┃ .tiktok
┃ .insta
┃ .pinterest
┃ .vv

┣━━〔 SYSTEM 〕━━⬣
┃ .ping
┃ .alive
┃ .owner
┃ .menu

┣━━〔 AI 〕━━⬣
┃ .tessia_ai

╰━━━━━━━━━━━━━━━━⬣

⚡ Powered By TESSIA PRO MAX`

    // ✅ VIDEO MENU
    if (menuVideo) {

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          video: menuVideo,

          gifPlayback: true,

          caption: text
        },
        { quoted: m }
      )
    }

    // ✅ IMAGE MENU
    return await sock.sendMessage(
      m.key.remoteJid,
      {
        image: thumb,

        caption: text
      },
      { quoted: m }
    )

  } catch (e) {

    console.log(
      'MENU ERROR:',
      e
    )
  }
}
