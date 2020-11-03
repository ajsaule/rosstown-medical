const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('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')

const msg = {
    to: 'andrejsaule8@gmail.com', // Change to your recipient
    from: `${emailContents}`, // Change to your verified sender
    subject: 'This is a test email',
    // text: 'and easy to do anywhere, even with Node.js',
    html: `<strong>This is a message from ${nameContents}: ${messageContents} </strong>`
}
  
//process.env.SENDGRID_API_KEY

const sendMail = function sendMail() {
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}

// module.exports = {
//     sendMail
// }

// Show a tooltip that dissapears after 10seconds saying ('enter the right email, name, message etc.')
// Just use the W3Schools example 

// Setup Browserify, using `browserify assets/js/sendgrid.js > sever.js --require 
// It looks like the require('@sendgrid') is working 
// but it looks as if when <script src="server.js"> is loaded above the textedit.js, the sendgrid function is not loaded into memory 


// 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