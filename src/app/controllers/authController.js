const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const mailer = require('../../modules/mailer')
const authConfig = require('../../config/auth')
const User = require('../models/user')

const router = express.Router()

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  })
}

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Cadastra um novo usuário
 *     description: Cria um novo usuário e retorna os dados junto com um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       200:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Erro no cadastro
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', async (req, res) => {
  try {
    if (await User.findOne({ email: req.body.email })) {
      return res.status(400).send({ error: 'User already exists' })
    }

    const user = await User.create(req.body)

    user.password = undefined

    const token = generateToken({ id: user.id })

    return res.send({ user, token })
  } catch (err) {
    console.log(err)
    return res.status(400).send({ error: `Registration failed: ${err.message}` })
  }
})

/**
 * @openapi
 * /auth/authenticate:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Autentica um usuário
 *     description: Realiza login com e-mail e senha e retorna um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthenticateInput'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Usuário não encontrado ou senha inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return res.status(400).send({ error: 'User not found' })
  }

  if (!await bcrypt.compare(password, user.password)) {
    return res.status(400).send({ error: 'Invalid password' })
  }

  user.password = undefined

  const token = generateToken({ id: user.id })

  return res.send({ user, token })
})

/**
 * @openapi
 * /auth/forgot_password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Solicita recuperação de senha
 *     description: Gera um token temporário e envia por e-mail para o usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *       200:
 *         description: E-mail enviado com sucesso
 *       400:
 *         description: Erro ao solicitar recuperação de senha
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/forgot_password', async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).send({ error: 'User not found' })
    }

    const token = crypto.randomBytes(20).toString('hex')

    const now = new Date()
    now.setHours(now.getHours() + 1)

    await User.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now
      }
    })

    mailer.sendMail(
      {
        to: email,
        from: 'axel.otto@bs.nttdata.com',
        subject: 'Recuperação de senha',
        template: 'auth/forgot_password',
        context: { token }
      },
      err => {
        if (err) {
          return res.status(400).send({ error: 'Cannot send forgot password email' })
        }

        return res.send('Email sent')
      }
    )
  } catch (err) {
    return res.status(400).send({ error: 'Error on forgot password, try again' })
  }
})

/**
 * @openapi
 * /auth/reset_password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Redefine a senha do usuário
 *     description: Recebe e-mail, token e nova senha para redefinição.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInput'
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Token inválido, expirado ou erro no processo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/reset_password', async (req, res) => {
  const { email, token, password } = req.body

  try {
    const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires')

    if (!user) {
      return res.status(400).send({ error: 'User not found' })
    }

    if (token !== user.passwordResetToken) {
      return res.status(400).send({ error: 'Token invalid' })
    }

    const now = new Date()

    if (now > user.passwordResetExpires) {
      return res.status(400).send({ error: 'Token expired, generate a new one' })
    }

    user.password = password

    await user.save()

    return res.send('Password reseted successfully')
  } catch (err) {
    return res.status(400).send({ error: 'Cannot reset password, try again' })
  }
})

module.exports = app => app.use('/auth', router)