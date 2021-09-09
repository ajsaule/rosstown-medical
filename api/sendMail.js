const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const handler = async (req, res) => {
  const {nameContents, emailContents, messageContents} = req.body

  const msg = {
    to: 'caseojkl@gmail.com',
    from: 'andrejsaule8@gmail.com',
    subject: 'Rosstown Medical Website Form',
    html: `
            Name: ${nameContents} <br>
            Email: ${emailContents} <br>
            Message: ${messageContents} <br>
            `,
  }
  // if (req.headers.referer === 'https://www.carnegiemedical.com.au/') {
  try {
    await sgMail.send(msg)
    res.status(204).end()
  } catch (err) {
    console.log('err123', err)
    res.status(500)
  }
}
// }

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://www.carnegiemedical.com.au/',
  )
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

module.exports = allowCors(handler)
