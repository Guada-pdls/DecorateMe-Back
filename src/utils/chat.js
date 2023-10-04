import { chatService } from "../service/index.js"

export default async (socket, io) => {
	socket.emit('allMessages', await chatService.getMessages())
	socket.on('newMessage', async data => {
		const msg = await chatService.createMessage(data)
		io.emit('message', msg)
	})
}