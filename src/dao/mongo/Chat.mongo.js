import Message from "./models/Message.js";

class ChatDao {
	constructor() {
		this.MessageModel = Message
	}

	getMessages = async () => {
		return await this.MessageModel.find()
	}

	createMessage = async msg => {
		return await this.MessageModel.create(msg)
	}
}

export default ChatDao