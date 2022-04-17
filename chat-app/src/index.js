const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {generateMessage, generateLoc} = require('./utils/messages');
const {
    addUser,
    removeUser,
    getUser,
    getUserInroom
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(path.join(publicDirectoryPath)));


io.on('connection', (socket) => {
    console.log('new connention')
    // socket.emit('chatPerson', generateMessage('welcome'));
    // socket.broadcast.emit('chatPerson', generateMessage('a new'));
    socket.on('join', (options, cb) => {
       const {error,user}= addUser({id: socket.id,...options});
       if(error) {
           return cb(error);
       }
        socket.join(user.room);
        socket.emit('chatPerson', generateMessage('Admin','welcome'));
        socket.broadcast.to(user.room).emit('chatPerson', generateMessage(`${user.username} has joined`));
       io.to(user.room).emit('roomdata',{
           room: user.room,
           users: getUserInroom(user.room)
       })
        cb();
    });
     socket.on('incriment', (message, cb) => {
         const user = getUser(socket.id);
         const filter = new Filter();
         if(filter.isProfane(message)) {
             return cb('profanity is not allwd')
         }
        
       io.to(user.room).emit('chatPerson',generateMessage(user.username, message));
       cb();
    })

    socket.on('sendlocation', (location,cb) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('location',generateLoc(user.username,`https://google.com/maps?q=${location.latitude},${location.longitude}`))
        cb();
     })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if(user) {
            io.to(user.room).emit('chatPerson', generateMessage(user.username, `${user.username} has left`));
            io.to(user.room).emit('roomdata',{
                room: user.room,
                users: getUserInroom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log('server is up on port'+port);
})