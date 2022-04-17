const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime(),
    }
}
const generateLoc = (username, loc) => {
    return {
        username,
        loc,
        createdAt: new Date().getTime(),
    }
}
module.exports = {
    generateMessage,
    generateLoc
}