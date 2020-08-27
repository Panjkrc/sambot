const { Command } = require('discord.js-commando');

module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'say',
			group: 'admin',
			memberName: 'say',
			description: 'Bot repeats the message you write in a channel you choose',
			guildOnly: true,
			userPermissions: ['KICK_MEMBERS'],
			args: [
				{
					key: 'channel',
					prompt: 'In what channel do you want me to say something?',
					type: 'channel',
				},
				{
					key: 'text',
					prompt: 'What would you like the bot to say?',
					type: 'string',
				},
			],
		});
	}

	run(message, { channel, text }) {
		channel.send(text);
	}
	onError(err) {
		console.log(err);
	}
};