const { Command } = require('discord.js-commando');

module.exports = class SetStatusCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'setstatus',
			group: 'owner',
			memberName: 'setstatus',
			description: 'Set bot\'s status.',
			ownerOnly: true,
			args: [
				{
					key: 'text',
					type: 'string',
					prompt: 'What would you like the status to say?',
				},
			],
		});
	}

	run(message, { text }) {
		this.client.user.setActivity(text);
		message.reply(`Bot status set to: ${text}`);
	}
	onError(err) {
		console.log(err);
	}
};