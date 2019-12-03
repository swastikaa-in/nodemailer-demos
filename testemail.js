const nodemailer = require('nodemailer');


var hbs = require('nodemailer-express-handlebars');

var selectedTemplate='hellomail';

var options = {
viewEngine : {
    extname: '.hbs', // handlebars extension
    layoutsDir: 'views/email/', // location of handlebars templates
    defaultLayout: false,//'testemail', // name of main template
    partialsDir: 'views/email/', // location of your subtemplates aka. header, footer etc
    
},
viewPath: 'views/email',
extName: '.hbs'
};



// Generate SMTP service account from ethereal.email
nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });

    transporter.use('compile', hbs(options));
    
    // Message object
    let message = {
        from: 'Sender Name <sender@example.com>',
        to: 'Recipient <recipient@example.com>',
        subject: 'Nodemailer is unicode friendly ✔',
        template: selectedTemplate,
        context: {
              name:"Sridhar Balasubramanian",
              email: "Sridhar.Balasubramanian@anthem.com",
              address: "10 entin drive"
            }
    };

   
    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
});