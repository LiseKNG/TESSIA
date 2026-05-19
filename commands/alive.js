// commands/alive.js

import os from 'os'
import { config } from '../config.js'
import { reply } from '../lib/reply.js'

export const name = 'alive'

export async function execute({
  sock,
  m,
  pushName,
  thumb
}) {

  try {

    // ✅ RAM
    const used =
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

    const total =
Math.round(
(
os.totalmem()
/
1024
/
1024
/
1024
) * 100
) / 100

    // ✅ UPTIME
    const uptime =
process.uptime()

    const hours =
Math.floor(
uptime / 3600
)

    const minutes =
Math.floor(
(uptime % 3600) / 60
)

    const seconds =
Math.floor(
uptime % 60
)

    // ✅ DATE
    const date =
new Date().toLocaleString()

    // ✅ MESSAGE
    const text =
`╭━━━〔 CRIMSON SYSTEM 〕━━━⬣

┃ 👤 USER : ${pushName}

┣━━〔 BOT STATUS 〕━━⬣

┃ 🤖 BOT NAME : CRIMSON
┃ ⚡ STATUS : ONLINE
┃ 🚀 SPEED : STABLE
┃ 🔒 MODE : ACTIVE
┃ 🧠 PREFIX : ${config.prefix}

┣━━〔 SYSTEM INFO 〕━━⬣

┃ 💾 RAM USED : ${used} GB
┃ 📦 TOTAL RAM : ${total} GB
┃ ⏰ UPTIME :
┃ ${hours}H ${minutes}M ${seconds}S

┃ 📅 DATE :
┃ ${date}

┣━━〔 OWNER INFO 〕━━⬣

┃ 👑 OWNER :
┃ ${config.owner}

┣━━〔 SECURITY 〕━━⬣

┃ ✅ ANTILAG : ACTIVE
┃ ✅ ANTISPAM : ACTIVE
┃ ✅ CRASH PROTECTION : ON
┃ ✅ PRIVATE SYSTEM : SAFE

┣━━〔 CHANNEL 〕━━⬣

┃ 📢 OFFICIAL CHANNEL :
┃ ${config.channel}

╰━━━━━━━━━━━━━━━━━━⬣

⚡ POWERED BY CRIMSON`

    // ✅ SEND
    await reply(
      sock,
      m.key.remoteJid,
      text,
      m,
      thumb
    )

  } catch (e) {

    console.log(
      'ALIVE ERROR:',
      e
    )
  }
}
