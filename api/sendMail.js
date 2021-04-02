const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// const allowCors = fn => async (req, res) => {
//     res.setHeader('Access-Control-Allow-Credentials', true)
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     // another common pattern
//     // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
//     res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
//     res.setHeader(
//         'Access-Control-Allow-Headers',
//         'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
//     )
//     if (req.method === 'OPTIONS') {
//         res.status(200).end()
//         return
//     }
//     return await fn(req, res)
// }

// const handler = (req, res) => {
//     const d = new Date()
//     res.end(d.toString())
// }
  
// module.exports = allowCors(handler)

module.exports = async (req, res) => {

    const { nameContents, emailContents, messageContents } = req.body

    const msg = {
        to: 'andrejsaule8@gmail.com', 
        from: `${emailContents}`, 
        subject: 'Rosstown Website Form',
        html: `Name: ${nameContents} <br> Email: ${emailContents} <br> Message: ${messageContents}`
    }
    
    async function sendMail() {
        await sgMail
            // the below is a promise chain
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
                console.error(error)
            })
    }
    console.log('request', req.body)

    try {
        await sendMail()
    } catch (err) {
        res.status(500)
    }
} 

