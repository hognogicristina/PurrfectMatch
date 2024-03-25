const {WebSocket} = require('ws')
const {Chat} = require('../../models')


const sendMessage = async (senderId, receiverId, content, wss) => {
    try {
        const chat = await Chat.create({ senderId, receiverId, content })
        const chatJson = chat.toJSON()

        const receiverWs = Array.from(wss.clients).find(client =>
            client.readyState === WebSocket.OPEN && client.userId === receiverId)

        if (receiverWs) {
            receiverWs.send(JSON.stringify(chatJson))
        }

        return chatJson
    } catch (error) {
        console.error(error)
        throw new Error('Internal server error')
    }
}

module.exports = { sendMessage }