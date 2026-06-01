import os from 'os'

export const name = 'menu'

export async function execute({
  sock,
  m,
  commands,
  cache,
  pushName
}) {

  const ram =
  (
    (os.totalmem() - os.freemem())
    / 1024 / 1024 / 1024
  ).toFixed(2)

  const date =
  new Date().toLocaleString()

  const total =
  commands.size

  const list =
  [...commands.keys()]
  .sort()
  .map(cmd => `┃ ⚔️ .${cmd}`)
  .join('\n')

  await sock.sendMessage(
    m.key.remoteJid,
    {
      image: cache.thumb,

      caption:
`╔══════════════════════╗
║      CRIMSON BOT
╚══════════════════════╝

╭━━〔 SYSTEM INFO 〕━━⬣
┃ 👤 USER : ${pushName}
┃ 📦 COMMANDS : ${total}
┃ 💾 RAM : ${ram} GB
┃ 📅 DATE : ${date}
┃ ⚡ STATUS : ONLINE
╰━━━━━━━━━━━━⬣

╭━━〔 COMMANDS 〕━━⬣

${list}

╰━━━━━━━━━━━━⬣

╭━━〔 CRIMSON BOT 〕━━⬣
┃ 🔥 Version : UPD2
┃ 🚀 Host : Katabump
┃ 👑 Owner : Crimson
╰━━━━━━━━━━━━⬣`
    },
    {
      quoted: m
    }
  )
}
