import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys'

import P from 'pino'
import fs from 'fs'
import os from 'os'

import {
  loadCommands,
  handleCommand
} from './handler/commandHandler.js'

import { loadDB } from './handler/db.js'
import { config } from './config.js'

// ✅ OWNER NUMBER
const PHONE =
config.owner.replace(/[^0-9]/g, '')

// ✅ PAIR LOCK
let pairingDone = false

// ✅ THUMB
const thumb =
fs.existsSync('./media/thumb.jpg')
? fs.readFileSync('./media/thumb.jpg')
: null

// ✅ MENU VIDEO
const menuVideo =
fs.existsSync('./media/menu.mp4')
? fs.readFileSync('./media/menu.mp4')
: null

async function startBot() {

  // ✅ AUTH
  const {
    state,
    saveCreds
  } = await useMultiFileAuthState(
    './session'
  )

  // ✅ VERSION
  const { version } =
  await fetchLatestBaileysVersion()

  // ✅ SOCKET
  const sock = makeWASocket({

    version,

    logger: P({
      level: 'silent'
    }),

    browser: [
      'Ubuntu',
      'Chrome',
      '20.0.04'
    ],

    mobile: false,

    printQRInTerminal: false,

    auth: {

      creds: state.creds,

      keys:
      makeCacheableSignalKeyStore(
        state.keys,
        P({
          level: 'silent'
        })
      )
    },

    markOnlineOnConnect: true,

    syncFullHistory: false,

    generateHighQualityLinkPreview: true,

    defaultQueryTimeoutMs: 60000,

    connectTimeoutMs: 60000,

    keepAliveIntervalMs: 15000,

    emitOwnEvents: false,

    fireInitQueries: true
  })

  // ✅ LOAD COMMANDS
  await loadCommands()

  // ✅ SAVE CREDS
  sock.ev.on(
    'creds.update',
    saveCreds
  )

  // ✅ CONNECTION
  sock.ev.on(
    'connection.update',

    async ({
      connection,
      lastDisconnect
    }) => {

      try {

        // ✅ CONNECTING
        if (
          connection === 'connecting'
        ) {

          console.log(
            '⏳ Connexion à WhatsApp...'
          )
        }

        // ✅ PAIRING
        if (

          connection === 'connecting' &&

          !sock.authState.creds.registered &&

          !pairingDone
        ) {

          pairingDone = true

          try {

            console.log(
              '🔐 Génération du Pairing Code...'
            )

            await new Promise(
              resolve =>
                setTimeout(
                  resolve,
                  20000
                )
            )

            const code =
            await sock.requestPairingCode(
              PHONE
            )

            console.clear()

            console.log(`
╔══════════════════════════════╗
║       CRIMSON LOGIN          ║
╠══════════════════════════════╣
║ 📱 NUMBER : ${PHONE}
║ 🔑 CODE   : ${code}
╚══════════════════════════════╝

WhatsApp
→ Appareils liés
→ Lier avec numéro
→ Entrer le code
`)

          } catch (e) {

            pairingDone = false

            console.log(
              '❌ Pair Error:',
              e.message
            )

            setTimeout(() => {

              startBot()

            }, 10000)
          }
        }

        // ✅ CONNECTED
        if (
          connection === 'open'
        ) {

          pairingDone = true

          console.log(
            '✅ CRIMSON CONNECTÉ'
          )

          try {

            await sock.sendMessage(

              PHONE +
              '@s.whatsapp.net',

              {

                image: thumb,

                caption:
`╭━━〔 CRIMSON ONLINE 〕━━⬣

┃ ✅ BOT CONNECTÉ
┃ 🚀 SESSION ACTIVE
┃ ⚡ CRIMSON SYSTEM
┃ 💻 HOST : KATABUMP

╰━━━━━━━━━━━━⬣`
              }
            )

          } catch (e) {

            console.log(
              '❌ Owner Msg:',
              e.message
            )
          }
        }

        // ❌ CLOSE
        if (
          connection === 'close'
        ) {

          const reason =
          lastDisconnect?.error
          ?.output?.statusCode

          console.log(
            '❌ Déconnecté:',
            reason
          )

          pairingDone = false

          if (
            reason !==
            DisconnectReason.loggedOut
          ) {

            console.log(
              '🔄 Reconnexion...'
            )

            setTimeout(() => {

              startBot()

            }, 5000)

          } else {

            console.log(
              '🚫 Session supprimée'
            )
          }
        }

      } catch (e) {

        console.log(
          '❌ Connection Error:',
          e.message
        )
      }
    }
  )

  // ✅ WELCOME / GOODBYE
sock.ev.on(
  'group-participants.update',
  async (data) => {

    try {

      const db = loadDB()

      if (!db.welcome)
        db.welcome = []

      if (!db.goodbye)
        db.goodbye = []

      const metadata =
      await sock.groupMetadata(
        data.id
      )

      const groupName =
      metadata.subject

      for (
        const user
        of data.participants
      ) {

        let pp =
'https://i.imgur.com/JPw4L1x.jpeg'

        try {

          pp =
          await sock.profilePictureUrl(
            user,
            'image'
          )

        } catch {}

        const username =
        user.split('@')[0]

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

        // ✅ WELCOME
        if (
          data.action === 'add' &&
          db.welcome.includes(data.id)
        ) {

          await sock.sendMessage(
            data.id,
            {
              image: { url: pp },

              caption:
`╭━━━〔 CRIMSON BOT WELCOME 〕━━━⬣

┃ 👋 Bienvenue @${username}
┃ 🏠 Groupe : ${groupName}

┃ 💻 Host : Katabump
┃ ⚡ RAM : ${ram} GB

┃ 🚀 CRIMSON BOT UPD2

╰━━━━━━━━━━━━━━━━⬣`,

              mentions: [user]
            }
          )
        }

        // ✅ GOODBYE
        if (
          data.action === 'remove' &&
          db.goodbye.includes(data.id)
        ) {

          await sock.sendMessage(
            data.id,
            {
              image: { url: pp },

              caption:
`╭━━━〔 CRIMSON BOT GOODBYE 〕━━━⬣

┃ 👋 Au revoir @${username}
┃ 🏠 Groupe : ${groupName}

┃ ⚡ Merci pour ta présence

╰━━━━━━━━━━━━━━━━⬣`,

              mentions: [user]
            }
          )
        }
      }

    } catch (e) {

      console.log(
        'WELCOME ERROR:',
        e.message
      )
    }
  }
)

  // ✅ MESSAGE HANDLER
  sock.ev.on(
    'messages.upsert',

    async ({ messages }) => {

      try {

        const m = messages[0]

        if (!m) return
        if (!m.message) return

        // ✅ MESSAGE BODY
        const body =

          m.message?.conversation ||

          m.message
          ?.extendedTextMessage
          ?.text ||

          m.message
          ?.imageMessage
          ?.caption ||

          m.message
          ?.videoMessage
          ?.caption ||

          m.message
          ?.buttonsResponseMessage
          ?.selectedButtonId ||

          m.message
          ?.listResponseMessage
          ?.singleSelectReply
          ?.selectedRowId ||

          ''

        if (!body) return

        console.log(
          '📩 MESSAGE:',
          body
        )

        // ✅ DATABASE
        const db = loadDB()

        // ✅ ANTILINK
        if (
          m.key.remoteJid.endsWith('@g.us')
        ) {

          const antilink =
          db.antilink || []

          const isActive =
          antilink.includes(
            m.key.remoteJid
          )

          if (isActive) {

            const isLink =

              body.includes('https://') ||
              body.includes('http://') ||
              body.includes('chat.whatsapp.com') ||
              body.includes('www.')

            if (isLink) {

              const metadata =
              await sock.groupMetadata(
                m.key.remoteJid
              )

              const sender =
              m.key.participant

              const admins =
              metadata.participants
              .filter(v => v.admin)
              .map(v => v.id)

              // ✅ IGNORE ADMINS
              if (
                !admins.includes(sender)
              ) {

                try {

                  await sock.sendMessage(
                    m.key.remoteJid,
                    {
                      delete: m.key
                    }
                  )

                } catch {}

                try {

                  await sock.groupParticipantsUpdate(
                    m.key.remoteJid,
                    [sender],
                    'remove'
                  )

                } catch {}

                try {

                  await sock.sendMessage(

                    m.key.remoteJid,

                    {
                      text:
`╭━━〔 CRIMSON ANTILINK 〕━━⬣

┃ 🚫 Lien détecté
┃ 👤 @${sender.split('@')[0]}
┃ ❌ Membre supprimé

╰━━━━━━━━━━━━⬣`,

                      mentions: [sender]
                    }
                  )

                } catch {}
              }
            }
          }
        }

        // ✅ ANTIBOT
        if (
          m.key.remoteJid.endsWith('@g.us')
        ) {

          const antibot =
          db.antibot || []

          const active =
          antibot.includes(
            m.key.remoteJid
          )

          if (active) {

            const sender =
            m.key.participant || ''

            // ✅ DETECT OTHER BOTS
            if (
              sender.includes(':')
            ) {

              try {

                await sock.groupParticipantsUpdate(
                  m.key.remoteJid,
                  [sender],
                  'remove'
                )

                await sock.sendMessage(

                  m.key.remoteJid,

                  {
                    text:
`╭━━〔 CRIMSON ANTIBOT 〕━━⬣

┃ 🤖 Bot détecté
┃ ❌ Suppression effectuée

╰━━━━━━━━━━━━⬣`
                  }
                )

              } catch {}
            }
          }
        }

// ═══════════════════════
// ⚔️ CRIMSON ARISE SYSTEM
// ═══════════════════════

try {

  const db = loadDB()

  const sender = (
    m.key.participant ||
    m.key.remoteJid ||
    ''
  )
  .split('@')[0]
  .split(':')[0]
  .replace(/[^0-9]/g, '')

  const owner =
  config.owner
  .replace(/[^0-9]/g, '')

  const sudo =
  db.sudo || []

  const isMaster =
  sender === owner

  const isSudo =
  sudo.includes(sender)

  if (
  body.startsWith('.') &&
  m.key.remoteJid.endsWith('@g.us') &&
  (isMaster || isSudo)
)

    const rank =
    isMaster
    ? '👑 OWNER'
    : '⚜️ SUDO'

    await sock.sendMessage(
      m.key.remoteJid,
      {
        react: {
          text: '👑',
          key: m.key
        }
      }
    )

    await sock.sendMessage(
      m.key.remoteJid,
      {
        image: thumb,

        caption:
`╔══════════════════════╗
║       ⚔️ ARISE ⚔️
╚══════════════════════╝

┃ 👤 ${m.pushName}

┃ 🎖️ RANG
┃ ${rank}

┃ ⚡ CRIMSON SYSTEM
┃ A reconnu son maître.

┃ 🩸 Autorité maximale
┃ détectée dans le groupe.

╰━━━━━━━━━━━━━━━━━━⬣`
      }
    )
  }

} catch (e) {

  console.log(
    'ARISE ERROR:',
    e.message
  )
}
        
        // ✅ COMMAND HANDLER
        await handleCommand(

          sock,

          m,

          body,

          db,

          {
            thumb,
            menuVideo
          }
        )

      } catch (e) {

        console.log(
          '❌ Message Error:',
          e.message
        )
      }
    }
  )
}

// ✅ START
startBot()
