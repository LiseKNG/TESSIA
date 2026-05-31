import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys'

import P from 'pino'
import fs from 'fs'
import os from 'os'

import { loadCommands, handleCommand } from './handler/commandHandler.js'
import { loadDB } from './handler/db.js'
import { config } from './config.js'

// ✅ CLEAN OWNER NUMBER
const PHONE =
config.owner.replace(/[^0-9]/g, '')

// ✅ PAIR LOCK
let pairingDone = false

// ✅ THUMB CACHE
const thumb =
fs.existsSync('./media/thumb.jpg')
? fs.readFileSync('./media/thumb.jpg')
: null

// ✅ MENU VIDEO CACHE
const menuVideo =
fs.existsSync('./media/menu.mp4')
? fs.readFileSync('./media/menu.mp4')
: null

async function startBot() {

  // ✅ AUTH
  const {
    state,
    saveCreds
  } = await useMultiFileAuthState('./session')

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
      'CIMSON',
      'Chrome',
      '1.0.0'
    ],

    printQRInTerminal: false,

    auth: {
      creds: state.creds,

      keys: makeCacheableSignalKeyStore(
        state.keys,
        P({ level: 'silent' })
      )
    },

    markOnlineOnConnect: true,

    syncFullHistory: true,

    generateHighQualityLinkPreview: true,

    defaultQueryTimeoutMs: 60000,

    connectTimeoutMs: 60000,

    keepAliveIntervalMs: 10000
  })

  // ✅ LOAD COMMANDS
  await loadCommands()

  // ✅ SAVE SESSION
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
            '⏳ Connexion...'
          )

          // ✅ PAIR CODE
          if (
            !sock.authState.creds.registered
            &&
            !pairingDone
          ) {

            pairingDone = true

            setTimeout(async () => {

              try {

                const code =
                await sock.requestPairingCode(
                  PHONE
                )

                console.log(`
╭━━━〔 CRIMSON BOT PAIRING 〕━━━⬣
┃ NUMBER : ${PHONE}
┃ CODE   : ${code}
╰━━━━━━━━━━━━━━━━━━⬣
`)

              } catch (e) {

                console.log(
                  '❌ Pair Error:',
                  e.message
                )

                pairingDone = false
              }

            }, 5000)
          }
        }

        // ✅ CONNECTED
        if (
          connection === 'open'
        ) {

          console.log(
            '✅ CRIMSON BOT CONNECTÉ'
          )

          try {

            await sock.sendMessage(
              PHONE + '@s.whatsapp.net',
              {
                image: thumb,

                caption:
`╭━━〔 CRIMSON BOT ONLINE 〕━━⬣

┃ ✅ BOT CONNECTÉ
┃ 🚀 SESSION ACTIVE
┃ ⚡ CRIMSON BOT UPD2

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

          // ✅ RECONNECT
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

        // ✅ BODY
        const body =
          m.message?.conversation ||
          m.message?.extendedTextMessage?.text ||
          m.message?.imageMessage?.caption ||
          m.message?.videoMessage?.caption ||
          ''

        if (!body) return

        // ✅ DEBUG
        console.log(
          '📩 MESSAGE:',
          body
        )

        // ✅ DATABASE
        const db = loadDB()

        // ✅ COMMANDS
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
