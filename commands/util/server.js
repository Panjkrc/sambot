const { Command } = require('discord.js-commando');

module.exports = class ServerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'server',
			group: 'util',
			memberName: 'server',
			description: 'Display\'s some server info.',
		});
	}

	run(message) {
		message.say(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
	}
	onError(err) {
		console.log(err);
	}
};