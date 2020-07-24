var connection = require('./connect')
module.exports.teacherlist = function(req, res) { //displaying teachers list

    //	console.log(req.session.user);
    var c = '%prof%'
    connection.query('select * from users where pos like ? order by FirstName  ', c, function(err, results) {
        var results = results;
        if (err) {
            console.log(err);
        } else {
            console.log(results);
            // db.collection("status").insertOne({useid:req.session.user['id'],online:'y'})
            res.render('teacherlist', { user: req.session.user['usersdet'], results: results });
        }
    })
}
module.exports.create_profile_page = function(req, res) {
    { //create profile page
        connection.query('select * from profile where owner=?', req.session.user["usersdet"]["id"], function(error, results, fields) {
            if (results[0]) {
                var x = '/update-profile'
                res.render('createprofile', { t: x })

            } else {
                var x = '/creating-profile'
                res.render('createprofile', { t: x })

            }
        })

    }
}
module.exports.createingprofile = function(req, res) { //creating profile in database
    var data = {
        "title": req.body.title,
        "profile": req.body.profiles,
        "owner": req.session.user["usersdet"]["id"]
    }

    console.log(data)
    connection.query('INSERT INTO profile SET ?', data, function(error, results, fields) { //passing the set with fields and values because no fields are explicitly mentiones
        if (error) {
            res.json({ //must learn about json
                status: false,
                message: 'there are some error with query'
            })


            console.log(error);
        } else {

            res.redirect('/dash'); //redirect to login page
        }
    });

}
module.exports.updateprofile = function(req, res) { //creating profile in database
    var data = {
        "title": req.body.title,
        "profile": req.body.profiles,
        "owner": req.session.user["usersdet"]["id"]
    }

    console.log(data)
    connection.query('update profile SET ? where owner=?', [data, req.session.user["usersdet"]["id"]], function(error, results, fields) { //passing the set with fields and values because no fields are explicitly mentiones
        if (error) {
            res.json({ //must learn about json
                status: false,
                message: 'there are some error with query'
            })


            console.log(error);
        } else {

            res.redirect('/dash'); //redirect to login page
        }
    });

}
module.exports.followers = async function(req, res) {

    var followers = await db.collection("follow").find({ leader: req.session.user['usersdet']['id'] }).toArray();
    var followerlist = followers.map(function(task, index, array) {

        return parseInt(task.follower);

    });
    let Query = `select * from users where id in (${followerlist})`;

    connection.query(Query, (followerlist), (err, result) => {
        console.log(result)
        res.render('followers', { user: req.session.user['usersdet'], follower: result })
    })


}