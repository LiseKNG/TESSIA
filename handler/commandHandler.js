import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { config } from '../config.js'

const __filename =
  fileURLToPath(import.meta.url)

const __dirname =
  path.dirname(__filename)

const commands = new Map()

// ✅ LOAD DB
function loadDB() {

  const pathDB =
    './database.json'

  if (!fs.existsSync(pathDB)) {

    fs.writeFileSync(
      pathDB,
      JSON.stringify({}, null, 2)
    )
  }

  return JSON.parse(
    fs.readFileSync(pathDB)
  )
}

// ✅ LOAD COMMANDS
export async function loadCommands() {

  commands.clear()

  const files =
    fs.readdirSync(
      path.join(
        __dirname,
        '../commands'
      )
    )

  for (const file of files) {

    if (!file.endsWith('.js'))
      continue

    try {

      const cmd =
        await import(
          `../commands/${file}?update=${Date.now()}`
        )

      commands.set(
        cmd.name,
        cmd
      )

      console.log(
        `✅ Command Loaded: ${cmd.name}`
      )

    } catch (e) {

      console.log(
        `❌ Failed: ${file}`,
        e.message
      )
    }
  }
}

// ✅ HANDLE COMMANDS
export async function handleCommand(
  sock,
  m,
  body,
  db,
  cache
) {

  try {

    // ✅ PREFIX
    const prefix =
      config.prefix || '.'

    if (
      !body.startsWith(prefix)
    ) return

    // ✅ PARSE
    const args =
      body
      .slice(prefix.length)
      .trim()
      .split(/ +/)

    const command =
      args
      .shift()
      ?.toLowerCase()

    if (!command) return

    // ✅ GET COMMAND
    const cmd =
      commands.get(command)

    if (!cmd) return

    // ✅ SENDER
    const sender =
      m.key.participant ||
      m.key.remoteJid

    // ✅ OWNER
    const isOwner =
      sender.includes(
        config.owner
      )

    // ✅ LOAD DB
    const data =
      loadDB()

    // ✅ PRIVATE MODE
    if (
      data.mode === 'private' &&
      !isOwner
    ) {

      return
    }

    // ✅ BANNED USERS
    if (
      data.ban &&
      data.ban.includes(sender)
    ) {

      return
    }

const sender = (

  m.key.participant ||

  m.key.remoteJid ||

  ''

)
.split('@')[0]
.split(':')[0]
.replace(/[^0-9]/g, '')

    // ✅ PRIVATE MODE
if (
  db.private === true &&
  sender !==
  config.owner.replace(/[^0-9]/g, '')
) {

  return
}
    
    // ✅ EXECUTE
    await cmd.execute({

      sock,

      m,

      body,

      args,

      db: data,

      cache,

      commands,

      pushName:
        m.pushName || 'User',

      sender,

      isOwner,

      thumb:
        cache?.thumb || null,

      menuVideo:
        cache?.menuVideo || null
    })

  } catch (e) {

    console.log(
      '❌ Command Error:',
      e
    )
  }
}
