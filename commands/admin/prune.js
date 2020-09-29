const { Command } = require('discord.js-commando');

module.exports = class PruneCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'prune',
			group: 'admin',
			memberName: 'prune',
			description: 'Prune up to 99 messages',
			guildOnly: true,
			clientPermissions: ['MANAGE_MESSAGES'],
			userPermissions: ['MANAGE_MESSAGES'],
			args: [
				{
					key: 'amount',
					prompt: 'How many messages do you want to prune?',
					type: 'integer',
				},
			],
		});
	}

	run(message, { amount }) {

		message.channel.bulkDelete(amount + 1, true).catch(err => {
			console.error(err);
			message.channel.send('there was an error trying to prune messages in this channel!');
		});
	}
	onError(err) {
		console.log(err);
	}
};