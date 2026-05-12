export const name = 'owner'

export async function execute({ sock, m }) {

  const owner = sock.user.id.split(':')[0]

  await sock.sendMessage(m.key.remoteJid, {
    text: `👑 OWNER: ${owner}`
  }, { quoted: m })
}
