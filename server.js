   //modules imported   
   var express = require('express'); //import express module
   var body = require('body-parser'); //import to use variables in html form
   var path = require('path');
   var connection = require('./module/connect'); //get mysql connection
   var fs = require('fs'); //used to take binary content of upoaded file
   var app = express() //creating our app
   var mongodb = require('mongodb');
   var { ObjectId } = mongodb; //get object from mongodb to create id
   const socket = require('socket.io'); //socket for live communication
   const fileupload = require("express-fileupload");
   //connecions established
   var session = require('express-session'); //used to store details of the opbject
   var MongoStore = require('connect-mongo')(session); //storing the session in nomgo
   var connectionstring = "mongodb+srv://edukit:mitran20@cluster0-m7fv6.mongodb.net/edukit?retryWrites=true&w=majority"; //string given by mongodb
   const PORT = process.env.PORT || 3000; //for glocbal hot
   const server = app.listen(PORT, () => { // connext to the port 3000
       console.log("connected");
   })
   mongodb.connect(connectionstring, { useUnifiedTopology: true }, function(err, client) { //connect to mongodb
           db = client.db();
           if (err) { console.log(err); } else { console.log("mongodb connected"); }
       })
       //storing session
   let sessionOptions = session({
           secret: "JavaScript is sooooooooo coool",
           store: new MongoStore({ url: 'mongodb+srv://***********************************************?retryWrites=true&w=majority' }),
           resave: false,
           saveUninitialized: false,
           cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }
       })
       //libraries used
   app.use(fileupload());
   app.use(sessionOptions)
   app.set('view engine', 'ejs'); // set the view engine to ejs
   app.use(body.urlencoded({ extended: true })); //acq body
   app.use(express.json()); //use json datatype
   app.use('/scripts', express.static(`${__dirname}/node_modules/`)); //if any client side ask for modules
   app.use(express.static("css")) //use files in folder css
   app.use(express.static("javascript")) //basics
       { //basic
           var basic = require('./module/basic');
           app.get('/', basic.signup)
           app.get('/update', basic.update)
           app.get('/login', basic.login)
           app.get('/dash', basic.dashboard)
           app.post('/getotp', basic.getotp)
           app.get('/forgetpass', basic.forgetpass)
           app.get('/logout', basic.logout)

       } { //notification
           var notific = require('./module/notification');
           app.get('/notifications', notific.notification)
           app.post("/delnotification", notific.delete);
           app.post("/addclassnoti", notific.addclassnoti);
       } { //register login
           var reg = require('./module/registeremail'); //take our module and place in the variable
           app.post('/register', reg.register) //access api register
           app.post('/loginuser', reg.login) //access api login
           app.post('/update', reg.update)
           app.post('/updatepass', reg.updatepass)
       } { //files
           var files = require('./module/files');
           app.get('/materials', files.filepage)
           app.post('/upload', files.upload);
           app.get('/download/:id', files.download);
           app.post('/search/:title', files.search);
       } { //question
           var quest = require('./module/post')
           app.post('/question/post', quest.postqn)
           app.post('/postans', quest.postans)
           app.get('/question/:id', quest.question)
           app.get('/question', quest.qnpage)
           app.post("/postreply", quest.postreply);
       } { // chat
           var reg = require('./module/profilechat');
           const io = socket.listen(server);
           require('./module/profilechat.js')(io);
       } { //follow unfollow
           var folun = require('./module/follow')
           app.post('/profilefollow/:id', folun.follow)
           app.post('/profileunfollow/:id', folun.unfollow)
       } { //teachers
           var teacher = require('./module/teacher')
           app.get('/teachers', teacher.teacherlist)
           app.get('/createprofile', teacher.create_profile_page)
           app.post('/update-profile', teacher.updateprofile)
           app.post('/creating-profile', teacher.createingprofile)
           app.get('/followers', teacher.followers)
       } { //blog
           var blog = require('./module/blog')
           app.get('/blogs', blog.bloglist)
           app.get("/createblog", blog.createblog)
           app.post('/postblog', blog.postblog)
           app.post("/postcomment", blog.postcomment)
           app.post("/postbreply", blog.postreply)
           app.get('/blog/:id', blog.getblog)
           app.post('/searchblog/:title', blog.search);
           app.post('/uploadimg', blog.blogup)
       } { //classs
           var classes = require('./module/class');
           app.get('/class', classes.classpage)
           app.post('/classwork', classes.classwork)
           app.post('/createclass', classes.create)
           app.post('/class/createln', classes.createln)
           app.post('/class/search', classes.search)
           app.post('/class/join', classes.join)
           app.post('/class/leave', classes.leave)
       } { //profiles
           var profiles = require('./module/profiles');
           app.get('/profile/:id', profiles.teacher)
           app.get('/studprofile/:id', profiles.student)
       }