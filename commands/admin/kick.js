const { Command } = require('discord.js-commando');

module.exports = class KickCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kick',
			group: 'admin',
			memberName: 'kick',
			description: 'Kick a user',
			clientPermissions: ['KICK_MEMBERS'],
			userPermissions: ['KICK_MEMBERS'],
			guildOnly: true,
			args: [
				{
					key: 'user',
					type: 'member',
					prompt: 'What user would you like to kick?',
				},
				{
					key: 'reason',
					type: 'string',
					prompt: 'What is the kick reason?',
				},
			],
		});
	}

	run(message, { user, reason }) {
		user.kick(reason).then((taggedUser) => {
			message.channel.send(`
			${taggedUser.displayName} has been successfully kicked`);

		}).catch(() => {
			message.channel.send('Access Denied');
		});
	}
	onError(err) {
		console.log(err);
	}
};