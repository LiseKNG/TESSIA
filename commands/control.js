// commands/control.js

export const name = 'control'

export async function execute({
  sock,
  m,
  args,
  cache
}) {

  try {

    const jid =
    m.key.remoteJid

    // ✅ GROUP ONLY
    if (
      !jid.endsWith('@g.us')
    ) {

      return await sock.sendMessage(
        jid,
        {
          image: cache?.thumb,

          caption:
`╭━━〔 CRIMSON CONTROL 〕━━⬣

┃ ❌ Groupe uniquement

╰━━━━━━━━━━━━⬣`
        },
        {
          quoted: m
        }
      )
    }

    // ✅ ADMIN ONLY
    const metadata =
    await sock.groupMetadata(jid)

    const sender =
    m.key.participant

    const admins =
    metadata.participants
    .filter(v => v.admin)
    .map(v => v.id)

    if (
      !admins.includes(sender)
    ) {

      return await sock.sendMessage(
        jid,
        {
          image: cache?.thumb,

          caption:
`╭━━〔 CRIMSON CONTROL 〕━━⬣

┃ ❌ Admin seulement

╰━━━━━━━━━━━━⬣`
        },
        {
          quoted: m
        }
      )
    }

    // ✅ MENU
    if (!args[0]) {

      return await sock.sendMessage(

        jid,

        {
          image: cache?.thumb,

          caption:
`╭━━〔 CRIMSON CONTROL PANEL 〕━━⬣

┃ 🎛️ SYSTÈME DE CONTRÔLE
┃ 👑 ADMIN PANEL

┣━━━━━━━━━━━━⬣

┃ 📝 .control name NOM
┃ 📝 .control desc TEXTE
┃ 🔒 .control close
┃ 🔓 .control open
┃ 🖼️ .control pp
┃ 👢 .control kick @user
┃ ☠️ .control kickall
┃ 🔇 .control mute
┃ 🔊 .control unmute

╰━━━━━━━━━━━━⬣`
        },
        {
          quoted: m
        }
      )
    }

    const action =
    args[0].toLowerCase()

    // ✅ CHANGE NAME
    if (action === 'name') {

      const newName =
      args.slice(1).join(' ')

      if (!newName) {

        return sock.sendMessage(
          jid,
          {
            text:
'❌ Donne un nom'
          },
          {
            quoted: m
          }
        )
      }

      await sock.groupUpdateSubject(
        jid,
        newName
      )

      return sock.sendMessage(
        jid,
        {
          image: cache?.thumb,

          caption:
`╭━━〔 CRIMSON CONTROL 〕━━⬣

┃ ✅ Nom modifié

┃ 📝 ${newName}

╰━━━━━━━━━━━━⬣`
        },
        {
          quoted: m
        }
      )
    }

    // ✅ CHANGE DESC
    if (action === 'desc') {

      const newDesc =
      args.slice(1).join(' ')

      if (!newDesc) {

        return sock.sendMessage(
          jid,
          {
            text:
'❌ Prochainement vous allez me nommer dans votre groupe personne ne decide suis je admin ou pas, je ne suis pas votre commencement mais je suis votre fin  '
          },
          {
            quoted: m
          }
        )
      }

      await sock.groupUpdateDescription(
        jid,
        newDesc
      )

      return sock.sendMessage(
        jid,
        {
          image: cache?.thumb,

          caption:
`╭━━〔 CRIMSON CONTROL 〕━━⬣

┃ ✅ Description modifiée

╰━━━━━━━━━━━━⬣`
        },
        {
          quoted: m
        }
      )
    }

    // ✅ CLOSE GROUP
    if (action === 'close') {

      await sock.groupSettingUpdate(
        jid,
        'announcement'
      )

      return sock.sendMessage(
        jid,
        {
          image: cache?.thumb,

          caption:
`╭━━〔 CRIMSON CONTROL 〕━━⬣

┃ 🔒 Groupe fermé

╰━━━━━━━━━━━━⬣`
        },
        {
          quoted: m
        }
      )
    }

    // ✅ OPEN GROUP
    if (action === 'open') {

      await sock.groupSettingUpdate(
        jid,
        'not_announcement'
      )

      return sock.sendMessage(
        jid,
        {
          image: cache?.thumb,

          caption:
`╭━━〔 CRIMSON CONTROL 〕━━⬣

┃ 🔓 Groupe ouvert

╰━━━━━━━━━━━━⬣`
        },
        {
          quoted: m
        }
      )
    }

    // ✅ GROUP PP
    if (action === 'pp') {

      const quoted =
      m.message?.extendedTextMessage
      ?.contextInfo?.quotedMessage

      if (
        !quoted?.imageMessage
      ) {

        return sock.sendMessage(
          jid,
          {
            text:
'❌ Réponds à une image'
          },
          {
            quoted: m
          }
        )
      }

      const stream =
      await downloadContentFromMessage(
        quoted.imageMessage,
        'image'
      )

      let buffer =
      Buffer.from([])

      for await (
        const chunk
        of stream
      ) {

        buffer =
        Buffer.concat([
          buffer,
          chunk
        ])
      }

      await sock.updateProfilePicture(
        jid,
        buffer
      )

      return sock.sendMessage(
        jid,
        {
          image: cache?.thumb,

          caption:
`╭━━〔 CRIMSON CONTROL 〕━━⬣

┃ ✅ Photo modifiée

╰━━━━━━━━━━━━⬣`
        },
        {
          quoted: m
        }
      )
    }

    // ✅ KICK
    if (action === 'kick') {

      const user =
      m.message
      ?.extendedTextMessage
      ?.contextInfo
      ?.mentionedJid?.[0]

      if (!user) {

        return sock.sendMessage(
          jid,
          {
            text:
'❌ Mentionne un membre'
          },
          {
            quoted: m
          }
        )
      }

      await sock.groupParticipantsUpdate(
        jid,
        [user],
        'remove'
      )

      return sock.sendMessage(
        jid,
        {
          image: cache?.thumb,

          caption:
`╭━━〔 CRIMSON CONTROL 〕━━⬣

┃ 👢 Membre expulsé

╰━━━━━━━━━━━━⬣`
        },
        {
          quoted: m
        }
      )
    }

    // ✅ KICKALL
    if (action === 'kickall') {

      const members =
      metadata.participants
      .filter(
        v =>
        !v.admin
      )
      .map(v => v.id)

      await sock.groupParticipantsUpdate(
        jid,
        members,
        'remove'
      )

      return sock.sendMessage(
        jid,
        {
          image: cache?.thumb,

          caption:
`╭━━〔 CRIMSON CONTROL 〕━━⬣

┃ ☠️ Tous les membres
┃ non-admin ont été retirés

╰━━━━━━━━━━━━⬣`
        },
        {
          quoted: m
        }
      )
    }

    // ✅ MUTE
    if (action === 'mute') {

      await sock.groupSettingUpdate(
        jid,
        'announcement'
      )

      return sock.sendMessage(
        jid,
        {
          image: cache?.thumb,

          caption:
`╭━━〔 CRIMSON CONTROL 〕━━⬣

┃ 🔇 Groupe mute

╰━━━━━━━━━━━━⬣`
        },
        {
          quoted: m
        }
      )
    }

    // ✅ UNMUTE
    if (action === 'unmute') {

      await sock.groupSettingUpdate(
        jid,
        'not_announcement'
      )

      return sock.sendMessage(
        jid,
        {
          image: cache?.thumb,

          caption:
`╭━━〔 CRIMSON CONTROL 〕━━⬣

┃ 🔊 Groupe unmute

╰━━━━━━━━━━━━⬣`
        },
        {
          quoted: m
        }
      )
    }

  } catch (e) {

    console.log(
      'CONTROL ERROR:',
      e.message
    )
  }
}
