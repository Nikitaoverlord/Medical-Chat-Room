const express = require("express")
const app = express()

// socket.io setup
const http = require("http")
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 })

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const users = {} // a dictionary of objects with each key being the socket.id

var rooms = [{name: "Coronavirus", numOfPeople: 5}, {name: "Black Death", numOfPeople: 0}] // a list of objects (roomName, numOfPeopleInRoom)

io.on('connection', (socket) => {
    console.log('a user connected')
    users[socket.id] = {}
    io.emit('updateUsers', users)

    socket.on('disconnect', (reason) => {
        console.log(reason)
        delete users[socket.id]
        io.emit('updateUsers', users)
    })
})


setInterval(() => {
    io.emit('updateUsers', users)
    io.emit('updateRooms', rooms)
}, 15)
  
  
server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
  
console.log('server did load')