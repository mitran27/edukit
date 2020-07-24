var connection = require('./connect')
var wait
var b
checkfollow = async function(y, z) //function to check wherthe session user is following the viwer or not
    {
        b = await db.collection("follow").findOne({ leader: y, follower: z })
        if (b) { return 1; } else { return 0 }

    }
module.exports.teacher = function(req, res, ) { //going to teachers id with follo unfollow
    var x = parseInt(req.params.id);
    connection.query('select u.id,u.FirstName,b.title,b.doneby,b.id bid,u.pos from blog b,users u where u.id=b.doneby and b.doneby=?', x, async function(errr, results) {
        console.log('blogs present')
        if (results[0]) {
            let isfollowing = false;
            wait = true
            console.log(results);
            isfollowing = await checkfollow(x, parseInt(req.session.user['usersdet']['id']))
            var t = { id: parseInt(x), name: results[0].FirstName }
            console.log(t)
            res.render('profiles', { x: results, b: isfollowing, user: req.session.user['usersdet'], a: t })
        } else {
            connection.query('select * from users where id=?', x, async function(errr, results1) {
                data = [{
                        id: x,
                        FirstName: results1[0].FirstName,
                        pos: results1[0].pos
                    }

                ]
                let isfollowing = false;
                wait = true
                console.log(results);
                isfollowing = await checkfollow(x, parseInt(req.session.user['usersdet']['id']))
                var t = { id: parseInt(x), name: results1[0].FirstName }
                console.log(t, data)
                res.render('profiles', { x: data, b: isfollowing, user: req.session.user['usersdet'], a: t })

            })
        }
    })
}
module.exports.student = (req, res) => {
    var z = req.params.id;
    console.log(z)
    connection.query('select u.pos,u.id,q.id qid,u.FirstName,q.question,q.type from users u,question q where u.id=q.postedby and u.id=?', z, (err, result) => {
        if (result[0]) {

            var t = { id: parseInt(z), name: result[0].FirstName }
            res.render('profiles', { x: result, b: 1, user: req.session.user['usersdet'], a: t }); ////////////
        } else {
            connection.query('select * from users where id=?', z, async function(errr, results1) {
                data = [{
                        id: z,
                        FirstName: results1[0].FirstName,
                        pos: results1[0].pos
                    }

                ]

                var t = { id: parseInt(z), name: results1[0].FirstName }
                console.log(t, data)
                res.render('profiles', { x: data, b: 2, user: req.session.user['usersdet'], a: t })

            })
        }

    })



}