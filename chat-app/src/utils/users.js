const users = [];

const addUser = ({id, username, room}) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    if(!username || !room) {
        return {
            error: 'username and room is required!!'
        }
    }
    const existingUser = users.find(user => user.room === room && user.username === username);
    if(existingUser) {
        return {
            error: 'username is in use!!'
        }
    }
    const user = {id, username, room}
    users.push(user);
    return {user};
}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);
    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    const index = users.findIndex(user => user.id === id);
    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}
const getUserInroom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter(u => u.room === room);
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInroom
}