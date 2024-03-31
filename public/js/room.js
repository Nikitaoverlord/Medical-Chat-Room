const socket = io();

let url = document.location.pathname
let urlArray = url.split("/")
let roomName = urlArray.slice(-1).toString().replace(/%20/g, ' ')
socket.emit('join room', roomName)

document.title = roomName + ' | Medical Chat Room'

const frontEndUsers = {}
var messages = []

socket.on('updateUsers', (backendUsers) => {
    for (const backendID in backendUsers) {
      if (!frontEndUsers[backendID]){ // add new players
        frontEndUsers[backendID] = backendUsers[backendID]
      }
    }
  
    for (const frontendID in frontEndUsers) { // remove non-existing players
      if (!backendUsers[frontendID]){
        delete frontEndUsers[frontendID]
        break
      }
    }
})

socket.on('updateMessages', (backendMessages) => {
    backendMessages.forEach((backendMessage) => {
        if (!messages.includes(backendMessage)){
            messages.push(backendMessage)
      
            const chat = document.querySelector("#chat")
            const newLine = document.createElement('p')
            newLine.textContent = backendMessage
            chat.appendChild(newLine)
            newLine.scrollIntoView()
          }
    })    
})



document.querySelector('#chatForm').addEventListener('submit', (e) => {
    e.preventDefault()
  
    socket.emit('messageSent', document.querySelector("#chatInput").value)
    document.querySelector("#chatInput").value = ""
  })