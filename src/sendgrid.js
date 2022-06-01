// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({path: path.join(__dirname, ".env")})

const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
sgMail.setApiKey('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')



const main = async()=> {
const res = await sgMail.send({
    to: 'ivaschenko_u@ukr.net', // Change to your recipient
    from: 'ivaschenko_u@ukr.net', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  })
  
  
  console.log('res', res)
}

main()

