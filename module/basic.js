var connection = require('./connect')
module.exports.signup = (req, res) => { //import home page

    res.render('signup', { c: 0 })
}
module.exports.update = (req, res) => { //import home page

    res.render('update', { user: req.session.user['usersdet'] })
}
module.exports.login = (req, res) => { //import login page
    if ((req.session.user != undefined)) {
        res.redirect('/dash')
    } else {

        res.render('login', { c: 0 })
    }
}
module.exports.dashboard = (req, res) => { //import login pagee
    res.render('dashbord', { user: req.session.user['usersdet'], myquestion: req.session.user['question'], following: req.session.user['following'] });
}
module.exports.getotp = (req, res) => { //import login pagee
    console.log(req.body.email)
    connection.query('SELECT * FROM users WHERE email = ? ', req.body.email, function(err, result) {
        if (result[0]) {

            var otp = Math.floor(0000 + Math.random() * 9999);
            const nodemailer = require('nodemailer');



            let mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'mitran2rm@gmail.com',
                    pass: 'rmitran2%'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            let mailDetails = {
                from: 'mitran2rm@gmail.com',
                to: req.body.email,
                subject: 'your otp',
                text: (parseInt(otp)).toString()
            };

            mailTransporter.sendMail(mailDetails, function(err, data) {
                if (err) {
                    console.log(err);
                } else {

                    res.send((parseInt(otp)).toString())
                }
            });


        } else {
            res.send('error')
        }
    })
}

module.exports.forgetpass = (req, res) => { //import login pagee

    res.render('forgetpass', { user: req.session.user['usersdet'] })
}
module.exports.logout = (req, res) => { //import logout page
    req.session.destroy(function(err) {})

    res.redirect("/login")
}