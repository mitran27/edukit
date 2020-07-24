var { ObjectId } = require('mongodb');
module.exports.notification = (req, res) => { //import home page
    var user = (req.session.user['usersdet']['id']).toString()

    db.collection("notification").find({ toUserId: user }).sort({ 'date': -1 }).toArray(function(err, result) { res.render('notification', { user: req.session.user['usersdet'], notifi: result }) })

}
module.exports.delete = (req, res) => {
    console.log('enter 3')
    var data = {
        _id: ObjectId(req.body.id)
    }
    db.collection("notification").deleteOne(data, function(err, obj) {

        res.send('done')
    })

}
module.exports.deletenoti = (data) => {

    db.collection("notification").deleteMany(data, function(err, obj) {});
}
module.exports.addnoti = async(data) => {
    console.log('enter 4')
    db.collection("notification").insertOne(data, function(err, resulr) {

    })

}

module.exports.addclassnoti = (req, res) => {
    console.log(req.body)
    db.collection('class').find({ '_id': ObjectId(req.body.class) }).toArray(function(err, result) {

        console.log(result[0].students)
        for (var i = 0; i < result[0].students.length; i++) {
            var data = {
                fromUserId: '0',
                message: (req.body.mes).trim(),
                toUserId: (result[0].students[i].studentid).toString(),
                date: new Date(),
                pos: 'class',
                name: result[0].name
            }
            db.collection("notification").insertOne(data, function(err, resulr) {

            })
        }
    })
    res.send('ok')

}