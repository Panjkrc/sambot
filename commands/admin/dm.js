const { Command } = require('discord.js-commando');

module.exports = class DmCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dm',
			group: 'admin',
			memberName: 'dm',
			description: 'DM\'s user from a guild',
			guildOnly: true,
			userPermissions: ['KICK_MEMBERS'],
			args: [
				{
					key: 'user',
					prompt: 'What user do you want to DM?',
					type: 'member',
				},
				{
					key: 'text',
					prompt: 'What text would you like the bot to say?',
					type: 'string',
				},
			],
		});
	}

	run(message, { text, user }) {

		return user.send(text, { split: true })
			.then(() => {
				if (message.channel.type === 'dm') return;
				message.channel.send(user.displayName + ' recieved a DM from me!');
			})
			.catch(error => {
				console.error(`Could not send DM to ${user.displayName}.\n`, error);
				message.reply('it seems like I can\'t DM ' + user.displayName);
			});
	}
	onError(err) {
		console.log(err);
	}
};