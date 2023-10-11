import fs from "fs";

class ChatManager {
	constructor(path) {
		this.path = path
		this.chats = []
		this.init(path)
	}

	init(path) {
		let file = fs.existsSync(path);
		if (!file) {
			fs.writeFileSync(path, "[]");
			return console.log("File created");
		} else {
			this.chats = JSON.parse(fs.readFileSync(path, "utf-8"));
			return console.log("Data recovered");
		}
	}

	getMessages() {
		return this.chats
	}

	async createMessage(msg) {
		try {
			this.chats.push(msg)
			const data = JSON.stringify(this.chats, null, 2)
			await fs.promises.writeFile(this.path, data)
			return 201
		} catch (error) {
			return 500
		}
	}
}

let chatManager = new ChatManager('./src/data/chats.json')

export default chatManager