class ChatRepository {
	constructor(dao) {
		this.dao = dao;
	}
	getMessages = async () => {
		return await this.dao.getMessages()
	}

	createMessage = async msg => { 
		return await this.dao.createMessage(msg)
	}
}

export default ChatRepository