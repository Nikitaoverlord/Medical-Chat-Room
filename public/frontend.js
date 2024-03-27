const socket = io();

const frontEndUsers = {}
var roomsKnown = []

// UPDATING VARIABLES FROM BACKEND
///////////////////////////////
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

socket.on('updateRooms', (backendRooms) => {
  backendRooms.forEach((backendRoom) => {
    let nameOfRoomsKnown = []
    roomsKnown.forEach((room)=>{ nameOfRoomsKnown.push(room.name) })
      if (!nameOfRoomsKnown.includes(backendRoom.name)){ // add new rooms
        roomsKnown.push(backendRoom)
      }
  })

  roomsKnown.forEach((frontendRoom) => {
    let nameOfbackEndRooms = []
    backendRooms.forEach((room)=>{ nameOfbackEndRooms.push(room.name) })
    if (!nameOfbackEndRooms.includes(frontendRoom.name)){ // add new rooms
      roomsKnown.splice(roomsKnown.indexOf(frontendRoom), 1)
    }
  })
})
/////////////////////////////


// Display functions
function displaySearchPage(searchTerm){
  let searchResults = document.querySelector("#searchResults")
  
  // Remove previous results
  while (searchResults.hasChildNodes()){
    searchResults.removeChild(searchResults.firstChild)
  }

  // Add Results
  
  let nameOfRoomsKnown = []
  roomsKnown.forEach((room)=>{ nameOfRoomsKnown.push(room.name) })
  console.log(roomsKnown)
  if (nameOfRoomsKnown.includes(searchTerm)){
    let searchResult = document.createElement('button')
    searchResult.textContent = searchTerm
    searchResults.appendChild(searchResult)
  }
  else {
    let errorResult = document.createElement('p')
    errorResult.textContent = "Room Not Found"
    searchResults.appendChild(errorResult)
  }
}
////////////////////



// Listener Functions
function homePageListeners(){
  document.querySelector("#chatSearch").addEventListener('submit', (e) => {
    e.preventDefault()
    let searchTerm = document.querySelector("#chatSearchInput").value
    displaySearchPage(searchTerm)
  })
}
/////////////////////

homePageListeners()