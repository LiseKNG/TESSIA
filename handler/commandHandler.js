import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const commands = new Map()

export async function loadCommands() {
  commands.clear()

  const files = fs.readdirSync(path.join(__dirname, '../commands'))

  for (const file of files) {
    if (!file.endsWith('.js')) continue

    const cmd = await import(`../commands/${file}`)
    commands.set(cmd.name, cmd)
  }
}

export async function handleCommand(sock, m, body, db, cache) {
  try {
    if (!body.startsWith('.')) return

    const args = body.slice(1).trim().split(/ +/)
    const command = args.shift().toLowerCase()

    const cmd = commands.get(command)

    if (!cmd) return

    await cmd.execute({
      sock,
      m,
      args,
      db,
      cache,
      commands
    })

  } catch (e) {
    console.log('❌ Command error:', e.message)
  }
}
