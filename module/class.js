module.exports.classpage = function(req, res) {
    var id = req.session.user['usersdet']['id']
    if (req.session.user['usersdet']['pos'] == 'professor') {
        console.log(id)
        db.collection('class').find({ '$or': [{ 'tutorid': id }, { 'students.studentid': id }] }).toArray(function(err, result) {
            var curclasses = [];
            for (items = 0; items < result.length; items++) {
                curclasses.push(result[items]._id)
            }
            console.log(curclasses)

            res.render('classes', { user: req.session.user['usersdet'], classes: result, cureclasses: curclasses })



        })

    } else {
        db.collection('class').find({ 'students.studentid': id }).toArray(function(err, result) {
            var curclasses = [];
            for (items = 0; items < result.length; items++) {
                curclasses.push(result[items]._id)
            }
            console.log(curclasses)
            res.render('classes', { user: req.session.user['usersdet'], classes: result, cureclasses: curclasses })

        })
    }

}
var { ObjectId } = require('mongodb');
module.exports.classwork = (req, res) => {

    db.collection('class').find({ "_id": ObjectId(req.body.classid) }).toArray(function(err, result) {

        res.render('classwork', { user: req.session.user['usersdet'], cla: result[0] })
    })
};
module.exports.create = function(req, res) {
    var classschema = {
        tutor: req.session.user['usersdet']['FirstName'],
        tutorid: req.session.user['usersdet']['id'],
        name: req.body.class_name,
        number: req.body.nos,
        notes: req.body.hint,
        type: req.body.type,
        institute: req.session.user['usersdet']['institute'],
        date: new Date
    }
    console.log(classschema)
    db.collection('class').insertOne(classschema).then(res.redirect('/class')).catch();
}
module.exports.createln = function(req, res) {
    console.log('sss', req.body)
    var id = (req.body.classdet).split(' ')[1]
    console.log(id)


    db.collection('class').updateOne({ '_id': ObjectId(id) }, { $push: { lessons: req.body.lndet } }).then(x => {
        res.send('ok')
    })

}
module.exports.search = function(req, res) {
    if (req.body.search.length > 0) {
        db.collection('class').find({ 'name': { $regex: req.body.search, $options: "si" } }).toArray(function(err, result) {
            console.log(result)
            res.send(result)
        })
    }
}
module.exports.join = function(req, res) {
    console.log(req.body);
    var x = ObjectId()

    db.collection('class').updateOne({ '_id': ObjectId(req.body.class) }, { $push: { students: { _id: x, studentid: parseInt(req.body.studeid), studentname: req.body.studname } } }).then(x => {
        res.redirect('/class');
    })


}
module.exports.leave = function(req, res) {


    db.collection('class').updateOne({ '_id': ObjectId(req.body.class) }, { $pull: { students: { studentid: req.session.user['usersdet']['id'] } } }).then(x => {
        res.redirect('/class');
    })


}