import { reply } from '../lib/reply.js'

export const name = 'ping'

export async function execute({ sock, m }) {
  await sock.sendMessage(m.key.remoteJid, {
    text: '🏓 Pong'
  }, { quoted: m })
}
