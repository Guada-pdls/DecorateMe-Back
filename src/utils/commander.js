import { Command } from "commander";

const commander = new Command()

commander
	.option('--mode <mode>', 'Execution mode', 'development')
	.parse()


export default commander