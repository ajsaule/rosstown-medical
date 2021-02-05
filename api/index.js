require('dotenv').config()
const app = require('express')()
const { check, validationResult } = require('express-validator')
const bodyParser = require('body-parser')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const urlencodedParser = bodyParser.urlencoded({ extended: false })


app.post('/api', urlencodedParser, [
    check('nameContents', 'This field must be at least 3+ characters long')
        .exists()
        .isLength({ min: 3 }),
    check('emailContents', 'Email is not valid')
        .isEmail()
        .normalizeEmail(),
    check('messageContents', 'Please enter a valid message')
        .exists()
        .isLength({ min: 1 })
], (req, res) => {
        
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        // return res.status(422).jsonp(errors.array())
        // const alert = errors.array()
    } else {
        const { nameContents, emailContents, messageContents } = req.body

        console.log(nameContents)
        console.log(emailContents)
        console.log(messageContents)

        const msg = {
            to: 'andrejsaule8@gmail.com', // Change to your recipient
            from: `${emailContents}`, // Should I make it the sender email or just a default dummy email
            subject: 'This is a test email',
            // text: 'and easy to do anywhere, even with Node.js',
            html: `<strong>This is a message from ${nameContents}: ${messageContents} </strong>`
        }

        const sendMail = () => {
            sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent')
                })
                .catch((error) => {
                    console.error(error)
                })
        }
        sendMail()
    }

    res.json(req.body)
})
  
// app.get('/api/item/:slug', (req, res) => {

// })


module.exports = app 


// Continue on with this video 
// https://www.youtube.com/watch?v=z8m_Vy_9FIs&t=160s
// look at existing Happy path project to figure out how to get data back from a server and render it to HTML on the page
// 