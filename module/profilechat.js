var channels = {};
var sockets = {};
var noti = require('./notification')
module.exports = function(io) {

    io.on('connection', (socket) => { //when user initailises his connection socket.io
        console.log("a user connected");

        socket.on('start', async(data) => { //when users enter the pageie document ready he sends a start key with his id 
            console.log('entered')
                //delete all the notifications where from is data[1] and to is data[0]
            var delnot = {
                fromUserId: data[1],
                toUserId: data[0]

            }

            noti.deletenoti(delnot)

            const dat = { '$or': [{ '$and': [{ 'toUserId': data[1] }, { 'fromUserId': data[0] }] }, { '$and': [{ 'toUserId': data[0] }, { 'fromUserId': data[1] }] }, ] }; //searching the prev chats

            db.collection('chatroom').find(dat).sort({ 'date': 1 }).toArray((err, result) => {

                for (i = 0; i < result.length; i++) {
                    //decrypt result[i] and send
                    socket.emit(`add-message-response`, result[i]);
                } //emitting the chats
            })
            await db.collection("status").deleteOne({ user: data[0] }, (err) => {
                // console.log(err);
            })


            await db.collection('status').insertOne({ user: data[0], SocketID: socket.id }) //inserting user socket id
        })





        socket.on(`add-message`, async(data) => {
            //encrypt data and add
            await db.collection("chatroom").insertOne(data) //inserting the chat messages
            var so = data['toUserId'];

            soc = await db.collection("status").findOne({ user: so }) //if the user is online we are taking the information of his socket
            if (soc) {
                var toSocketId = soc['SocketID']; //fom the information socket id is passed
                console.log('tosocketid', toSocketId, 'message is', data)

                io.to(toSocketId).emit(`add-message-response`, data); //emitting to to user
            } else {
                //he is offline send notifications
                noti.addnoti(data)



            }
            socket.emit(`add-message-response`, data); //emiiting to from user 
        });


        socket.channels = {};
        sockets[socket.id] = socket;

        //        console.log("[" + socket.id + "] connection accepted");
        socket.on('disconnect', function() {
            for (var channel in socket.channels) {
                removepeer(channel);
            }

            var rooms = io.sockets.adapter.sids[socket.id];
            for (var room in rooms) { socket.leave(room); }
            console.log("disconnected")
            db.collection("status").deleteOne({ SocketID: socket.id }, (err) => {})

            delete sockets[socket.id];
        });


        socket.on('join', function(config) {
            console.log("[" + socket.id + "] join ", config);
            var channel = config.channel;
            var userdata = config.userdata;



            if (!(channel in channels)) { //create channel if not exist
                channels[channel] = {};
            }

            for (id in channels[channel]) {
                console.log(id)
                channels[channel][id].emit('addPeer', { 'peer_id': socket.id, 'should_create_offer': false }); //emit ot all existing pers
                socket.emit('addPeer', { 'peer_id': id, 'create_offer': true });
            }

            channels[channel][socket.id] = socket; //add socket in the channel
            socket.channels[channel] = channel; //add channel to the socket
            console.log(channels)
        });

        function removepeer(channel) {


            if (!(channel in socket.channels)) {

                return;
            }

            delete socket.channels[channel];
            delete channels[channel][socket.id];

            for (id in channels[channel]) {
                channels[channel][id].emit('removePeer', { 'peer_id': socket.id });
                socket.emit('removePeer', { 'peer_id': id });
            }
        }

        socket.on('joinroom', x => {
            socket.user = x.user;
            socket.usern = x.name;
            socket.join(x.room)
            io.sockets.in(x.room).emit('emitmesinit', { mes: x.user + '  has joined', room: x.room });
        })

        socket.on('grpmes', (x) => {
            console.log(x)
            io.sockets.in(x.room).emit('emitmes', x);
        })

        socket.on('getroominfo', x => {

            var clients = io.sockets.adapter.rooms[x.room].sockets;
            for (var clientId in clients) {
                var Id = io.sockets.connected[clientId];
                socket.emit('emitmesinit', { mes: Id.usern, room: x.room })
            }
        })

        socket.on('relayICECandidate', function(config) {
            var peer_id = config.peer_id;
            var ice_candidate = config.ice_candidate;
            console.log(socket.id + " relaying ICE candidate to " + peer_id, ice_candidate);

            if (peer_id in sockets) {
                console.log('sending candidate')
                sockets[peer_id].emit('iceCandidate', { 'peer_id': socket.id, 'ice_candidate': ice_candidate });
            }
        });

        socket.on('relaySessionDescription', function(config) {
            var peer_id = config.peer_id;
            var session_description = config.session_description;

            if (peer_id in sockets) {
                sockets[peer_id].emit('sessionDescription', { 'peer_id': socket.id, 'session_description': session_description }); //sicket id has set this desc for him
            }
        });

    })
}