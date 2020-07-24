var connection = require('./connect');
module.exports.unfollow = function(req, res) { //unfollow button
    var data = {
        leader: parseInt(req.params.id),
        follower: req.session.user['usersdet']['id']
    }
    db.collection("follow").deleteOne(data).then(() => {

        y = '/profile/' + req.params.id
        res.redirect(y)
    }).catch(() => {
        console.log("errormongo")
    })
}
module.exports.follow = function(req, res) { //follow buuton
    console.log('came')
    connection.query('select FirstName from users where id=?', parseInt(req.params.id), (err, result) => {
        var data = {
            leader: parseInt(req.params.id),
            follower: req.session.user['usersdet']["id"],
            leadername: result[0]['FirstName'],
            followername: req.session.user['usersdet']['FirstName']
        }
        console.log(data)

        db.collection("follow").insertOne(data).then(() => { res.redirect('/profile/' + req.params.id) }).catch(() => { console.log("errormongo") })

    })
};