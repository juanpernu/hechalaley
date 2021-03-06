const { Router } = require('express')
const config = require('dos-config')
const ms = require('ms')
const dbApi = require('../db-api')
const { sendEmail } = require('../notifier')
const jwt = require('../helpers/jwt')
const createUrl = require('../helpers/create-url')

const app = Router()

module.exports = app

const SESSION_DURATION = ms('15d')
const LOGIN_TIMEOUT = ms('3hrs')

const sendTokenEmail = (email, token) => {
  const uri = createUrl(`/api/auth/${token}`)

  return sendEmail({
    to: email,
    subject: 'Login a Hecha la Ley',
    html: `
      <p>Para entrar haz click en el link:</p>
      <p><a href="${uri}">${uri}</a></p>
      <p><sub>Fecha de creación: ${(new Date()).toString()}</sub></p>
    `
  })
}

const sendToken = async (email) => {
  const payload = { email }
  const token = await jwt.create(payload, LOGIN_TIMEOUT)
  return sendTokenEmail(email, token)
}

const setCookie = (res, name, payload, duration = 0) =>
  res.cookie(name, payload, {
    maxAge: duration,
    sameSite: true,
    httpOnly: true
  })

const setToken = async (res, email) => {
  const token = await jwt.create({ email }, SESSION_DURATION)
  setCookie(res, 'sessionToken', token, SESSION_DURATION)
  setCookie(res, 'sessionTokenExists', true, SESSION_DURATION)
}

app.post('/auth/login', async (req, res) => {
  const { email } = req.body

  if (!email) return res.sendStatus(400)

  try {
    const user = await dbApi.users.findByEmail(email)

    if (!user) {
      const isEmpty = await dbApi.users.isEmptyCached()

      if (isEmpty) {
        await dbApi.users.create({ email })
      } else {
        throw new Error('email not found.')
      }
    }

    await sendToken(email)

    const data = { code: 'TOKEN_SENDED' }

    // Send `notificationCatcherUrl` on development so the client
    // can automatically open a new window with the validation email.
    if (
      config.nodeEnv === 'development'
      && config.notifier.useNotificationCatcher
      && config.notificationCatcherUrl
    ) {
      data.notificationCatcherUrl = config.notificationCatcherUrl
    }

    res.status(200).json(data)
  } catch (err) {
    res.sendStatus(403)
  }
})

app.get('/auth/logout', (req, res) => {
  res.clearCookie('sessionToken')
  res.clearCookie('sessionTokenExists')
  res.redirect('/admin')
})

app.get('/auth/:token', async (req, res) => {
  const { token } = req.params

  try {
    const { email } = await jwt.verify(token)
    await setToken(res, email)
    res.redirect('/admin')
  } catch (err) {
    res.sendStatus(403)
  }
})
