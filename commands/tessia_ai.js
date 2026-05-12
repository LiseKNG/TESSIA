// commands/tessia_ai.js

export const name = 'tessia_ai'

export async function execute({ sock, m, args }) {

  try {

    const question = args.join(' ')

    if (!question) {

      return sock.sendMessage(
        m.key.remoteJid,
        {
          text:
`╭━━〔 TESSIA AI 〕━━⬣
┃ ⚠️ Pose une question
┃ Exemple:
┃ .tessia_ai salut
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    await sock.sendMessage(
      m.key.remoteJid,
      {
        image: {
          url: './media/thumb.jpg'
        },

        caption:
`╭━━〔 TESSIA AI 〕━━⬣

┃ 🤖 Question:
┃ ${question}

┃ 🧠 Réflexion...
┃ ⚡ IA ACTIVE

╰━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )

  } catch (e) {
    console.log(e)
  }
}