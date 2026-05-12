export const name = 'menu'

export async function execute({ sock, m, cache, commands }) {

  const list = Array.from(commands.keys())
    .map(cmd => `➤ .${cmd}`)
    .join('\n')

  await sock.sendMessage(m.key.remoteJid, {
    video: cache.menuVideo,
    caption:
`╭━━〔 TESSIA MENU 〕━━⬣
${list}
╰━━━━━━━━━━━━⬣`,
    gifPlayback: true
  }, { quoted: m })
}
