import { newToken } from '../models/auth'
import { User } from '../models/user'

const APP_PASSWORD_RECOVERY_URL = `${process.env.APP_URL}${process.env.PASSWORD_RECOVERY_PATH}`

export const passwordRecoveryMail = (user: User) => {
  const url = `${APP_PASSWORD_RECOVERY_URL}?token=${newToken(user)}`
  return createMail(user.email, "Recupero de contraseña", `Entrá a <br/>${url}<br/> y seguí los pasos.`)
}

const createMail = (to: string, subject: string, content: string) => ({
  from: process.env.SMTP_USER,
  to: to,
  // attachments: [{
  //   filename: 'logo-sadosky2019.png',
  //   content: base64logo150px,
  //   encoding: 'base64',
  //   cid: 'sadoskyLogo2019-150px'
  // }],
  subject: subject,
  html: `
        <div style='background:#EEEpadding:50px'>
          <div style='background:#FFFcolor:#000font-family:sans-serif'>
            <h3 style='background:#3f51b5color:#FFFpadding:30pxmargin:0text-align:leftfont-size:22px'>
              ${subject}
            </h3>
            <div style='padding:30pxfont-size:16px'>
              ${applyStyles(content)}
              <p>Saludos,<br/>Equipo Pilas Bloques<br/>Fundación Sadosky</p>
              <img src="cid:sadoskyLogo2019-150px" />
            </div>
          </div>
        </div>
      `
})

const applyStyles = (content: string) => {
  const border = 'border: 1px solid gray border-collapse: collapse'
  return content.
    replace(/<table>/g, `<table style="${border}">`).
    replace(/<th>/g, `<th style="${border}">`).
    replace(/<td>/g, `<td style="${border}">`)
}