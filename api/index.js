require('dotenv').config()

const port = 5000
const express = require('express')
const app = express()
const cors = require('cors')
const sgMail = require('@sendgrid/mail')
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator')
const urlencodedParser = bodyParser.json()

// middleware functions that get executed, between enpoints and entrypoints of server (trim empty strings, rate limit, check origins)
// middleware also protects authentication and authorisation
app.use(cors())

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

app.post('/api', urlencodedParser, (req, res) => {

    const { nameContents, emailContents, messageContents } = req.body

    const msg = {
        to: 'andrejsaule8@gmail.com', // Change to your recipient
        from: `${emailContents}`, // Should I make it the sender email or just a default dummy email
        subject: 'This is a test email',
        // text: 'and easy to do anywhere, even with Node.js',
        html: `Message from ${nameContents}: <br> ${messageContents}`
    }

    const sendMail = () => {
        sgMail
            // the below is a promise chain
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
                console.error(error)
            })
    }
    sendMail()

    res.json(req.body)
})
  
// app.get('/api/item/:slug', (req, res) => {

// })

app.listen(port, () => console.info(`App listening on port ${port}`))

module.exports = app 


// Continue on with this video 
// https://www.youtube.com/watch?v=z8m_Vy_9FIs&t=160s
// look at existing Happy path project to figure out how to get data back from a server and render it to HTML on the page
// 