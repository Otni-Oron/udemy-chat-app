const users = []

const addUser = ({ id, username, room }) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if (!username || !room) {
        return {
            error: 'username and room are required'
        }
    }

    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate username
    if (existingUser) {
        return {
            error: "username already in use"
        }
    }

    //store user
    const user = { id, username, room }
    users.push(user)
    return {user} 
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1) {
        userToRemove = users.splice(index, 1)[0]
        return userToRemove
    }
}

// const getUser = (id) => {
//     console.log('idd', id)
//     const userFound = users.find((user) => {
//         user.id === id
//     })
//     if(!userFound){
//         return {
//             error: 'no user found'
//         }
//     }
//     return {userFound}
// }

// const getUsersInRoom = (room) => {
//     return users.filter((user) => {
//         user.room === room
//     })
// }
const getUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    if (index === -1) {
        return {
            error: "no user found"
        }
    }
    return users[index]
}
const getUsersInRoom = (room) => {
    let roomUsersArray = []
    for (let i = 0; i < users.length; i++) {
        if (users[i].room === room) {
            roomUsersArray.push(users[i])
        }
    }
 //   console.log('list of users from users.js: ', roomUsersArray)
    return roomUsersArray
}
module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}



// const RoomUsersList = getUsersInRoom('room3')
// console.log(RoomUsersList)








// for (let i = 0; i < 10; i++) {
//     for (let a = 0; a < 5; a++) {
//         addUser({
//             id: `id${a}${i}`,
//             username: `Otni${a}${i}`,
//             room: `Room${a}`
//         })
//     }
// }
// console.log(users)
// let roomToCheck = 'room3'
// getUsersInRoom(roomToCheck)
// console.log(`room ${roomToCheck} has the following users: `, roomUsersArray)

//console.log('getUser: ', getUser('ABC444'))

// addUser({
//     id: "22",
//     username: "Otni",
//     room: "5"
// })

// const res = addUser({
//     id: "23",
//     username: "",
//     room: ""
// })

// console.log(users)
// console.log(res)