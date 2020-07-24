var express = require('express');
var mysql = require('mysql');
var connection = require('./connect')

module.exports.qnpage = function(req, res) {
    connection.query('select u.FirstName,u.id,q.id qid,q.question,q.type from question q,users u where u.id=q.postedby order by qid desc', function(err, results) {
        var results = results;
        console.log(err);
        console.log(results);
        res.render('quetions', { user: req.session.user['usersdet'], question: results });






    })
}

module.exports.question = function(req, res) {

    //connection.query('select u.FirstName,a.answer, a.postedby,q.question,q.id from answer a,question q,users u where q.id=? and q.id=a.id and u.id=a.postedby ', a, function(err, results) {

    var z = req.params.id;
    db.collection('question').findOne({ qid: parseInt(z) }).then(data => { //findone shouldnt have .toarray
        console.log(data);
        res.render('answer', { user: req.session.user['usersdet'], ans: data })
    })





}

module.exports.postqn = function(req, res) {
    var y = req.session.user['usersdet'];
    var updat = new Date();
    var questiondetails = {
        "postedby": y["id"],
        "question": req.body.question,
        "type": req.body.questiontype,
        "postedon": updat
    }
    connection.query('insert into question set ?', questiondetails, function(err, result) {


        db.collection('question').insertOne({ questiondetails, 'qid': result.insertId, 'name': req.session.user['usersdet']['FirstName'] }).then(() => {
            res.redirect('/question');
        }).catch(err => { console.log(err) })

    })
}

var { ObjectId } = require('mongodb');
module.exports.postans = function(req, res) {

    var x = ObjectId()
    var answeredby = {
        id: req.session.user['usersdet']['id'],
        name: req.session.user['usersdet']['FirstName']
    }
    db.collection("question").updateOne({ _id: ObjectId(req.body.id) }, { $push: { answerslist: { _id: x, answer: req.body.ans, answeredby } } }).then(result => { //push is similar to insert
        res.send({ newans: { _id: x, answer: req.body.ans } })
    })
}
module.exports.postreply = (req, res) => {
    // db.collection('testing').updateOne({ _id: ObjectId(req.body.id), messageslist: { _id: req.body.idrep } }, { $push: { replies: req.body.ans } }).then(result => {
    console.log(req.body.id, req.body.idrep);
    db.collection('question').updateOne({ "answerslist._id": ObjectId(req.body.idrep) }, { $push: { "answerslist.$.replies": req.body.ans } }).then(result => {
        res.send(req.body.ans)
    }).catch(err => {
        console.log(err);
    })
}