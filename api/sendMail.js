const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = async (req, res) => {

    const { nameContents, emailContents, messageContents } = req.body

    const msg = {
        to: 'andrejsaule8@gmail.com', // Change to your recipient info@carnegiemedical.com.au
        from: `${emailContents}`, //`${emailContents}`, // Should I make it the sender email or just a default dummy email
        subject: 'Rosstown Website Form',
        // text: 'and easy to do anywhere, even with Node.js',
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

