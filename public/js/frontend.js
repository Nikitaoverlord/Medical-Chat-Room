const socket = io();

var roomsKnown = []

// UPDATING VARIABLES FROM BACKEND
///////////////////////////////

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

socket.on('account already exists', ()=> {
  notification = document.querySelector('#accountSuccessInfo')
  notification.textContent = 'Email already in use!'
  notification.style.color = 'red'
})
socket.on('account created', () =>{
  notification = document.querySelector('#accountSuccessInfo')
  notification.textContent = 'Account created!'
  notification.style.color = 'green'
  document.querySelector('#loginForm').style.display = 'none'
})
socket.on('log in failed', ()=>{
  notification = document.querySelector('#accountSuccessInfo')
  notification.textContent = 'Incorrect password or invalid email!'
  notification.style.color = 'red'
})
socket.on('logged in', () =>{
  notification = document.querySelector('#accountSuccessInfo')
  notification.textContent = 'Logged in!'
  notification.style.color = 'green'
  document.querySelector('#loginForm').style.display = 'none'
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
  if (nameOfRoomsKnown.includes(searchTerm)){
    let searchResult = document.createElement('button')
    searchResult.textContent = searchTerm
    searchResults.appendChild(searchResult)
    searchResult.addEventListener('click', function(){
      window.location.href = "/room/" + searchTerm;
    })
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

  let form = document.querySelector('#loginForm')
  document.querySelector('#loginButton').addEventListener('click', function(){
    form.style.display = 'flex'
    document.querySelector('#loginText').textContent = 'Put In Login Information'
    document.querySelector('#usernameInput').style.display = 'none'
    document.querySelector('#loginFormButton').textContent = "Log in"
  })

  document.querySelector('#signUpButton').addEventListener('click', function(){
    form.style.display = 'flex'
    document.querySelector('#loginText').textContent = 'Create your account'
    document.querySelector('#usernameInput').style.display = 'block'
    document.querySelector('#loginFormButton').textContent = "Sign Up"
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    let emailInput = document.querySelector('#emailInput')
    let passwordInput = document.querySelector('#passwordInput')
    let usernameInput = document.querySelector('#usernameInput')

    if (document.querySelector('#loginText').textContent == "Create your account")
      socket.emit('sign up', ([emailInput.value, passwordInput.value, usernameInput.value]))
    else {
      socket.emit('log in', ([emailInput.value, passwordInput.value]))
    }
    // Clear input
    passwordInput.value = ""
  })
}
/////////////////////

homePageListeners()