export const name = 'alive'

export async function execute({ sock, m, cache }) {
  await sock.sendMessage(m.key.remoteJid, {
    image: cache.thumb,
    caption: '✅ TESSIA EST ACTIF'
  }, { quoted: m })
}
