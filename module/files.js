var connection = require('./connect');
var fs = require('fs'); //adopt file upload download
var multer = require('multer')
var request = require('request');
// access token
var access_token = "T3He6OoU7PAAAAAAAAAAIoNLcluCPGFXgnM1Odlkms7o5Gf0URw5eqnWOJCQJkVy";
//Name of the file to be uploaded
module.exports.filepage = function(req, res) {
    connection.query('select * from file order by id desc', function(err, results) {
        console.log('coo', err);

        res.render('materials', { user: req.session.user['usersdet'], materials: results });
    })
}
module.exports.download = function(req, res) {
    var z = req.params.id;


    connection.query('SELECT * FROM file WHERE id = ?', z, function(err, result) { //select the id throug params
        if (err) {
            console.log(err);
        } else {
            var tile = result[0]['title'];


            var fetch = require('isomorphic-fetch');
            var Dropbox = require('dropbox').Dropbox;

            var dbx = new Dropbox({ accessToken: access_token, fetch: fetch });
            dbx.filesDownload({ path: '/Materials/' + tile })
                .then(function(data) {
                    console.log(data)
                        //  const file = new File({ buffer: data['fileBinary'], tile, type: result[0]['type'] });
                    let base64data = data['fileBinary'].toString('base64');


                    res.render('filedownload', { file: base64data, type: result[0]['type'] })


                })
                .catch(err => {
                    console.log(err);

                })


        }
    })
}
module.exports.search = function(req, res) {
    var x = '%' + req.params.title + '%';
    console.log("enterd");
    connection.query('select * from file where title like ?', x, function(err, results) {
        if (results) {
            console.log(results);
            res.send(results);
        } else {
            console.log(err);
        }
    })
}
module.exports.upload = function(req, res) {

    var filename = req.files.profile.name;
    //reading the contents 
    var content = req.files.profile.data;
    //write your folder name in place of YOUR_PATH_TO_FOLDER
    // For example if the folder name is njera then we can write it in the following way :
    // "Dropbox-API-Arg": "{\"path\": \"/njera/"+filename+"\",\"mode\": \"overwrite\",\"autorename\": true,\"mute\": false}"
    options = {
        method: "POST",
        url: 'https://content.dropboxapi.com/2/files/upload',
        headers: {
            "Content-Type": "application/octet-stream",
            "Authorization": "Bearer " + access_token,
            "Dropbox-API-Arg": "{\"path\": \"/Materials/" + filename + "\",\"mode\": \"overwrite\",\"autorename\": true,\"mute\": false}",
        },
        body: content
    };

    request(options, function(err, res, body) {
        console.log("Err : " + err);
        console.log("res : " + res);
        console.log("body : " + body);
    })
    var y = req.session.user;
    var updat = new Date();
    var filevar = { //after going throug multer and placing the file in temporary dirctory
        "title": req.files.profile.name,
        //getting the file from temp location and converting to binary
        "typemat": req.body.type,
        "category": req.body.cat,
        "type": req.files.profile.mimetype,
        "updatedby": y["id"],
        "updateddate": updat
    }

    connection.query('insert into file set ?', filevar, function(err, results) { //insering
        if (results) {} else {
            console.log(err);
        }
    })

    res.redirect('/dash');
}