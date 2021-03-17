//CHAT.JS (client side)

const socket = io()

//elements
const $messageForm = document.getElementById("message-form")
const $messageFormInput = document.getElementById('userInput')
const $messageFormButton = $messageForm.querySelector('button')
const $sentLocationButton = document.querySelector('#send-location')
const $messagesDiv = document.getElementById('messages-div') // web page position of rendered text

//templates
const messageTemplate = document.getElementById('message-template').innerHTML //the content to be rendered
const locationMessageTemplate = document.getElementById('location-message-template').innerHTML
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML

//options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // new message element
    const $newMessage = $messagesDiv.lastElementChild

    //height of the new message
    const newMessageStyles = getComputedStyle($newMessage) //this global function is made avaiable by the browser
    const newMessageMargin = parseInt(newMessageStyles.marginBottom) //extract element margin from the browser
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin //this does not include margins

    //visible height
    const visibleHeight = $messagesDiv.offsetHeight

    //height of messages container (that's the height of total content - include hidden messages which we need to scroll to)
    const containerHeight = $messagesDiv.scrollHeight

    //how far did i scrolled?
    const scrollOffset = $messagesDiv.scrollTop + visibleHeight // .scrollTop returns the distance i've scrolled from the top


    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messagesDiv.scrollTop = $messagesDiv.scrollHeight
    }
}



$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled') //disableing the button while message is precessed and sent

    const message = $messageFormInput.value

    socket.emit('sendMessage', message, (errorMessage) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (errorMessage) {
            return console.log(errorMessage)
        }
        console.log('message delivered')
    })


})
socket.on('messageThrough', (messageThrough) => {
    //  console.log("messageThrough: ", messageThrough)
    const html = Mustache.render(messageTemplate, {
        username: messageThrough.username,
        message: messageThrough.text,
        createAt: moment(messageThrough.createdAt).format('h:mm a')
    })
    $messagesDiv.insertAdjacentHTML('beforeend', html)
    autoscroll()
})




socket.on('message', (welcomeMessage) => {
    console.log(welcomeMessage.text, welcomeMessage.createdAt)
})



socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.getElementById('sidebar').innerHTML = html
})

$sentLocationButton.addEventListener('click', () => {
    $sentLocationButton.setAttribute('disabled', 'disabled')
    // if (!Navigator.geolocation) {
    //     return alert('geolocation is not supported by your browser')
    // }
    navigator.geolocation.getCurrentPosition((position) => { //returns a promise, but not supported by regular promise api so we have to work with a callback
        $sentLocationButton.removeAttribute('disabled')
        socket.emit('sendLocation', { lat: position.coords.latitude, lon: position.coords.longitude }, () => {
            console.log('location sent successfully!')
        })
    })
})

socket.on('locationMessage', (locationData) => {
    // console.log(url)
    const html = Mustache.render(locationMessageTemplate, {
        username: locationData.username,
        url: locationData.url,
        createdAt: moment(locationData.createdAt).format('h:mm a')
    })
    $messagesDiv.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = "/"
    }

})

