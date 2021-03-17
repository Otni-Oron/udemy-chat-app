//INDEX.JS (server side)

const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocation } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = (process.env.PORT || 3000);
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath)) //express.static is an epress middleware

io.on('connection', (socket) => {
    console.log('New Websocket connection!')

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        //    console.log('user: ', user)
        if (error) {
            return callback(error)
        }
        //      console.log('join -> user.room', user.room)
        socket.join(user.room)
        socket.emit('messageThrough', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('messageThrough', generateMessage(`${user.username} has just joined the conversation!`))

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('profanity is not allowed')
        }
        const user = getUser(socket.id)
        console.log('send message user: ', user)
        io.to(user.room).emit('messageThrough', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (position, callback) => {
        console.log('socket.id', socket.id)
        const user = getUser(socket.id)
        console.log('get user: ', user)
        socket.broadcast.to(user.room).emit('locationMessage', generateLocation(user.username, position.lat, position.lon))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        console.log('disconnect - user:', user)
        if (user) {
            io.to(user.room).emit('messageThrough', generateMessage(`${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`server is up! Listening at: ${port}`)
})

// server (emit) -> client (receive) - countUpdated
// client (emit) -> server (receive) - increment

  // socket.emit('countUpdated', count)

    // socket.on('increment', ()=>{
    //     count++
    //  //   socket.emit('countUpdated', count)
    //     io.emit('countUpdated', count)
    // })


    // socket.emit  io.emit socket.broadcast.emit
    // io.to.emit 
    // socket.broadcast.to.emit