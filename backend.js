const fs = require('fs')

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
  res.sendFile(__dirname + '/public/html_files/index.html')
})

const users = {} // a dictionary of objects with each key being the socket.id

var rooms = [{name: "Coronavirus", currentUsers: []}, {name: "Black Death", currentUsers: []}] // a list of objects (roomName, numOfPeopleInRoom)

app.get('/room/:roomName', (req, res) => {
    let roomNames = []
    rooms.forEach((room)=>{ roomNames.push(room.name) })
    if (roomNames.includes(req.params["roomName"])){
        res.sendFile(__dirname + '/public/html_files/room.html')
    }
    else {res.sendFile(__dirname + '/public/html_files/error.html')}
})

// reading JSON data
jsonData = fs.readFileSync(__dirname + '/public/data/messages.json')
var messages = JSON.parse(jsonData)

var accountInfo = JSON.parse(fs.readFileSync(__dirname + '/public/data/accounts.json'))

io.on('connection', (socket) => {
    console.log('a user connected')
    users[socket.id] = {name: 'Internet Surfer', room: null, loggedIn: false}
    io.emit('updateUsers', users) // will this give errors?

    socket.on('disconnect', (reason) => {
        console.log(reason)

        delete users[socket.id]
        io.emit('updateUsers', users)
    })

    socket.on('join room', (roomName) => {
        users[socket.id].room = roomName
        socket.join(roomName)
    })

    socket.on('messageSent', (message)=>{
        let userRoom = users[socket.id].room
        messages[userRoom].push(users[socket.id].name + ": " + message)
    })

    socket.on('sign up', (contents) => {
        let email = contents[0], password = contents[1], username = contents[2]
        if (email in accountInfo){ io.to(socket.id).emit('account already exists') }
        else{
            accountInfo[email] = {password: password, username:username}
            io.to(socket.id).emit('account created')
        }
    })

    socket.on('log in', (contents) => {
        let email = contents[0], password = contents[1]
        if (email in accountInfo && accountInfo[email]["password"] == password){
            users[socket.id].loggedIn = true
            io.to(socket.id).emit('logged in')
        }
        else {io.to(socket.id).emit('log in failed')}    
    })
})


setInterval(() => {
    // updating data
    jsonMessages = JSON.stringify(messages)
    fs.writeFileSync(__dirname + '/public/data/messages.json', jsonMessages) // storing data to JSON file

    fs.writeFileSync(__dirname + '/public/data/accounts.json', JSON.stringify(accountInfo))
    ////////////////

    io.emit('updateRooms', rooms)

    for (const userID in users){
        if (users[userID].room != null)
            io.to(userID).emit('updateUsers', users)
    }

    rooms.forEach((room) => {
        io.to(room.name).emit('updateMessages', messages[room.name])
    })
    
}, 15)
  
  
server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
  
console.log('server did load')