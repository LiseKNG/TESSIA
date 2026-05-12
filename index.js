import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys'

import P from 'pino'
import fs from 'fs'

import { loadCommands, handleCommand } from './handler/commandHandler.js'
import { loadDB } from './handler/db.js'
import { config } from './config.js'

// ✅ CLEAN NUMBER
const PHONE = config.owner.replace(/[^0-9]/g, '')

let pairingDone = false

// ✅ MEDIA CACHE
const thumb = fs.existsSync('./media/thumb.jpg')
  ? fs.readFileSync('./media/thumb.jpg')
  : null

const menuVideo = fs.existsSync('./media/menu.mp4')
  ? fs.readFileSync('./media/menu.mp4')
  : null

async function startBot() {

  // ✅ AUTH
  const { state, saveCreds } = await useMultiFileAuthState('./session')

  // ✅ BAILEYS VERSION
  const { version } = await fetchLatestBaileysVersion()

  // ✅ SOCKET
  const sock = makeWASocket({
    version,

    logger: P({
      level: 'silent'
    }),

    browser: ['Ubuntu', 'Chrome', '20.0.04'],

    printQRInTerminal: false,

    auth: {
      creds: state.creds,

      keys: makeCacheableSignalKeyStore(
        state.keys,
        P({ level: 'silent' })
      )
    },

    markOnlineOnConnect: false,

    generateHighQualityLinkPreview: true,

    syncFullHistory: false,

    defaultQueryTimeoutMs: 60000,

    connectTimeoutMs: 60000,

    keepAliveIntervalMs: 10000,

    emitOwnEvents: false,

    fireInitQueries: true
  })

  // ✅ LOAD COMMANDS
  await loadCommands()

  // ✅ CONNECTION EVENTS
  sock.ev.on('connection.update', async ({
    connection,
    lastDisconnect
  }) => {

    try {

      // 🔄 CONNECTING
      if (connection === 'connecting') {

        console.log('⏳ Connexion...')

        // ✅ PAIRING
        if (!sock.authState.creds.registered && !pairingDone) {

          pairingDone = true

          setTimeout(async () => {

            try {

              const code = await sock.requestPairingCode(PHONE)

              console.log(`
╭━━━〔 TESSIA PAIRING 〕━━━⬣
┃ NUMBER : ${PHONE}
┃ CODE   : ${code}
╰━━━━━━━━━━━━━━━━━━⬣
`)

            } catch (e) {

              console.log('❌ Pair Error:', e.message)

              pairingDone = false
            }

          }, 12000)
        }
      }

      // ✅ CONNECTED
      if (connection === 'open') {

        pairingDone = true

        console.log('✅ TESSIA CONNECTÉ')

        try {

          const owner = config.owner + '@s.whatsapp.net'

          // ✅ SEND CONNECT MESSAGE
          await sock.sendMessage(owner, {
            image: thumb,
            caption: '✅ TESSIA CONNECTÉ AVEC SUCCÈS'
          })

        } catch (e) {

          console.log('❌ Owner Message Error:', e.message)

        }
      }

      // ❌ DISCONNECTED
      if (connection === 'close') {

        const reason =
          lastDisconnect?.error?.output?.statusCode

        console.log('❌ Déconnecté:', reason)

        if (reason !== DisconnectReason.loggedOut) {

          console.log('🔄 Reconnexion...')

          setTimeout(startBot, 5000)

        } else {

          console.log('🚫 Session invalide')

        }
      }

    } catch (e) {

      console.log('❌ Connection Error:', e.message)

    }
  })

  // ✅ SAVE CREDS
  sock.ev.on('creds.update', saveCreds)

  // ✅ MESSAGE HANDLER
  sock.ev.on('messages.upsert', async ({
    messages
  }) => {

    try {

      const m = messages[0]

      if (!m) return
      if (!m.message) return
      if (m.key.fromMe) return

      // ✅ UNIVERSAL PARSER
      const body =
        m.message?.conversation ||
        m.message?.extendedTextMessage?.text ||
        m.message?.imageMessage?.caption ||
        m.message?.videoMessage?.caption ||
        m.message?.buttonsResponseMessage?.selectedButtonId ||
        m.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
        ''

      // ✅ IGNORE EMPTY
      if (!body) return

      // ✅ DEBUG
      console.log('📩 MESSAGE:', body)

      // ✅ DATABASE
      const db = loadDB()

      // ✅ EXECUTE COMMANDS
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

      console.log('❌ Message Error:', e.message)

    }
  })
}

// ✅ START BOT
startBot()