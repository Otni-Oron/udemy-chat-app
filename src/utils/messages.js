//MESSAGES.JS (utils)

const generateMessage = (username, text) => {
    return {
        username,
        text: text,
        createdAt: new Date().getTime()
    }
}

const generateLocation = (username, latitude, longitude) => {
    console.log('generate location test: ', `https://google.com/maps?q=${latitude},${longitude}`)
    return {
        username,
        url: `https://google.com/maps?q=${latitude},${longitude}`,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocation
}