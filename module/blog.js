module.exports.bloglist = function(req, res) {
    res.render('blogs', { user: req.session.user['usersdet'] })
}
module.exports.createblog = function(req, res) {
    res.render('blogcreate', { user: req.session.user['usersdet'] })
}
var mysql = require('mysql');
var connection = require('./connect')
var { ObjectId } = require('mongodb');
module.exports.postblog = function(req, res) {

    var blogdetails = {
        doneby: req.session.user['usersdet']['id'],
        title: req.body.title,

    }

    connection.query('insert into blog set ?', blogdetails, function(err, result) {
        console.log(result)
        var blogschema = {
            name: req.session.user['usersdet']['FirstName'],
            doneby: req.session.user['usersdet']['id'],
            date: new Date,
            title: req.body.title,
            blogid: result.insertId,
            blog: req.body.blog
        }
        console.log(blogschema)
        db.collection('blog').insertOne(blogschema).then((x) => { res.send(x) }).catch()

    })
}
module.exports.postcomment = function(req, res) {

    var x = ObjectId()
    db.collection("blog").updateOne({ _id: ObjectId(req.body.id) }, { $push: { commentslist: { _id: x, comment: req.body.comment, commentedby: req.session.user['usersdet']['FirstName'], date: new Date } } }).then(result => { //push is similar to insert
        res.send({ newcomment: { _id: x, comment: req.body.comment } })
    })

}
module.exports.postreply = function(req, res) {
    // db.collection('testing').updateOne({ _id: ObjectId(req.body.id), messageslist: { _id: req.body.idrep } }, { $push: { replies: req.body.ans } }).then(result => {
    console.log(req.body.id, req.body.idrep);
    db.collection('blog').updateOne({ "commentslist._id": ObjectId(req.body.idrep) }, { $push: { "commentslist.$.replies": req.body.reply } }).then(result => {
        res.send(req.body.reply)
    }).catch(err => {
        console.log(err);
    })
}
module.exports.getblog = function(req, res) {
    var z = req.params.id;
    console.log(z)
    db.collection('blog').findOne({ blogid: parseInt(z) }).then(data => { //findone shouldnt have .toarray
        console.log(data);

        res.render('blogdisplay', { user: req.session.user['usersdet'], blog: data })
    })
}
module.exports.search = function(req, res) {
    var x = '%' + req.params.title + '%';
    console.log("enterdwww");
    connection.query('select * from blog where title like ?', x, function(err, results) {
        if (results) {
            console.log(results);
            res.send(results);
        } else {
            console.log(err);
        }
    })
}
module.exports.blogup = function(req, res) {
    var filename = req.files.profileimg.name;
    console.log('sdfg', filename)
}