var bcrypt = require("bcryptjs");
var express = require("express");
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var mysql = require('mysql');
var sha = require('sha256')
var connection = require('./connect') //connect module for establishing mysql and not accesing individual apis bcz we need the whole module not only the function
module.exports.register = function(req, res) { //creating module api registerss
    //registering and sending email   @complte
    // sending email
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
        subject: 'welcome to edukit',
        text: 'thank you for using edukit one of the most powerful eduation platform'
    };

    mailTransporter.sendMail(mailDetails, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent successfully');
        }
    });
    //posting in database
    var hashpass = sha(req.body.pass)
    var users = { //making a set with values
        "FirstName": req.body.name,
        "LastName": req.body.name,
        "password": req.body.pass,
        "dob": req.body.dob,
        "email": req.body.email,
        "institute": req.body.ins,
        "domain": req.body.cs,
        "pos": req.body.pos
    }
    console.log(users["password"]);
    connection.query('INSERT INTO users SET ?', users, function(error, results, fields) { //passing the set with fields and values because no fields are explicitly mentiones
        if (error) {
            res.render('signup', { c: 1 })


            console.log(error);
        } else {

            res.redirect('/login'); //redirect to login page
        }
    });

}
module.exports.login = function(req, res) {
    var ses = {}
    var hashpass = sha(req.body.pass)
    connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [req.body.email, req.body.pass], function(err, result) {
        console.log(result)
        if (result[0] != undefined) {
            ses.usersdet = result[0]
            connection.query('select * from question where postedby= ? ', ses.usersdet["id"], async(err, result1) => {
                ses.question = result1
                db.collection("follow").find({ follower: ses.usersdet['id'] }).toArray(function(err, result2) {

                    ses.following = result2;
                    req.session.user = ses;
                    res.redirect('/dash');
                });
            });
        } else {
            res.render('login', { c: 1 })
        }
    });

}
module.exports.update = function(req, res) {
    var users = { //making a set with values
        "FirstName": req.body.name,
        "LastName": req.body.name,
        "password": req.body.pass,
        "dob": req.body.dob,
        "email": req.body.email,
        "institute": req.body.ins,
        "domain": req.body.cs,
        "pos": req.body.pos
    }
    console.log(users);
    connection.query('update users SET ? where id=?', [users, req.session.user["usersdet"]["id"]], function(error, results, fields) { //passing the set with fields and values because no fields are explicitly mentiones
        if (error) {
            res.json({ //must learn about json
                status: false,
                message: 'there are some error with query'
            })


            console.log(error);
        } else {

            res.redirect('/logout')
        }
    });

}
module.exports.updatepass = (req, res) => { //import login pagee
    var hashpass = sha(req.body.pass)
    console.log(hashpass)
    connection.query('update users SET password=? where email=?', [req.body.pass, req.body.email], function(error, results, fields) { //passing the set with fields and values because no fields are explicitly mentiones
        console.log(results)
        if (results) {


            res.send('ok')

        } else {
            res.send('error')
        }
    })
}