import fs from 'fs'

export const name = 'control'

const path = './database.json'

// ✅ LOAD DB
function loadDB() {

  if (!fs.existsSync(path)) {

    fs.writeFileSync(
      path,
      JSON.stringify({}, null, 2)
    )
  }

  return JSON.parse(
    fs.readFileSync(path)
  )
}

// ✅ SAVE DB
function saveDB(data) {

  fs.writeFileSync(
    path,
    JSON.stringify(data, null, 2)
  )
}

// ✅ RANDOM CODE
function generateCode() {

  return Math.floor(
    100000 + Math.random() * 900000
  ).toString()
}

export async function execute({
  sock,
  m,
  args,
  pushName
}) {

  try {

    const group =
      m.key.remoteJid

    // ✅ GROUP ONLY
    if (!group.endsWith('@g.us')) {

      return await sock.sendMessage(
        group,
        {
          text:
`╭━━〔 CRIMSON CONTROL 〕━━⬣
┃ ❌ Groupe uniquement
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    const db = loadDB()

    if (!db.control)
      db.control = {}

    const sender =
      m.key.participant ||
      m.key.remoteJid

    // ✅ STEP 1
    // GENERATE CODE
    if (!args[0]) {

      const code =
        generateCode()

      db.control[sender] = {
        code,
        group
      }

      saveDB(db)

      // ✅ SEND PRIVATE CODE
      await sock.sendMessage(
        sender,
        {
          text:
`╭━━〔 CRIMSON SECURITY 〕━━⬣

┃ 🔐 CODE : ${code}

┃ ⚠️ Utilise :
┃ .control ${code}

┃ 🚨 Ce code est privé

╰━━━━━━━━━━━━⬣`
        }
      )

      return await sock.sendMessage(
        group,
        {
          text:
`╭━━〔 CRIMSON CONTROL 〕━━⬣

┃ 🔐 Code envoyé en privé
┃ 📩 Vérifie WhatsApp

╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    // ✅ STEP 2
    // VERIFY CODE
    const saved =
      db.control[sender]

    if (!saved) {

      return await sock.sendMessage(
        group,
        {
          text:
`╭━━〔 CRIMSON CONTROL 〕━━⬣
┃ ❌ Aucun code trouvé
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    if (args[0] !== saved.code) {

      return await sock.sendMessage(
        group,
        {
          text:
`╭━━〔 CRIMSON CONTROL 〕━━⬣
┃ ❌ Code invalide
╰━━━━━━━━━━━━⬣`
        },
        { quoted: m }
      )
    }

    // ✅ DELETE CODE
    delete db.control[sender]

    saveDB(db)

    // ✅ GROUP SETTINGS
    try {

      // CHANGE GROUP NAME
      await sock.groupUpdateSubject(
        group,
        `⚡ CONTROLLED BY CRIMSON`
      )

      // CHANGE GROUP DESC
      await sock.groupUpdateDescription(
        group,
`⚡ Groupe sécurisé par CRIMSON PRO MAX

👑 Owner : ${pushName}

🚀 FULL CONTROL ACTIVATED`
      )

      // MUTE GROUP
      await sock.groupSettingUpdate(
        group,
        'announcement'
      )

      // LOCK GROUP SETTINGS
      await sock.groupSettingUpdate(
        group,
        'locked'
      )

      // CHANGE GROUP PP
      if (
        fs.existsSync('./media/thumb.jpg')
      ) {

        const media =
          fs.readFileSync(
            './media/thumb.jpg'
          )

        await sock.updateProfilePicture(
          group,
          media
        )
      }

      // ✅ KICK MEMBERS
      const metadata =
        await sock.groupMetadata(group)

      const participants =
        metadata.participants

      for (const p of participants) {

        // DON'T KICK OWNER
        if (
          p.id.includes(sock.user.id.split(':')[0])
        ) continue

        // DON'T KICK COMMAND USER
        if (p.id === sender)
          continue

        try {

          await sock.groupParticipantsUpdate(
            group,
            [p.id],
            'remove'
          )

        } catch {}
      }

      // ✅ SUCCESS
      await sock.sendMessage(
        group,
        {
          image: {
            url: './media/thumb.jpg'
          },

          caption:
`╭━━〔 CRIMSON CONTROL 〕━━⬣

┃ ✅ FULL CONTROL ACTIVATED

┃ ⚡ Nom modifié
┃ ⚡ Description modifiée
┃ ⚡ Photo changée
┃ ⚡ Groupe mute
┃ ⚡ Paramètres verrouillés
┃ ⚡ Membres expulsés

┃ 👑 By ${pushName}

╰━━━━━━━━━━━━⬣`
        }
      )

    } catch (e) {

      console.log(e)

      await sock.sendMessage(
        group,
        {
          text:
`╭━━〔 CRIMSON CONTROL 〕━━⬣

┃ ❌ Impossible d'obtenir
┃ le contrôle total

┃ ⚠️ Vérifie que :
┃ • le bot est admin
┃ • le bot a tous les droits

╰━━━━━━━━━━━━⬣`
        }
      )
    }

  } catch (e) {

    console.log(
      'CONTROL ERROR:',
      e
    )
  }
}
