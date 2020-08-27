const { Command } = require('discord.js-commando');

module.exports = class BanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ban',
			group: 'admin',
			memberName: 'ban',
			description: 'Ban a user',
			clientPermissions: ['BAN_MEMBERS'],
			userPermissions: ['BAN_MEMBERS'],
			guildOnly: true,
			args: [
				{
					key: 'user',
					type: 'member',
					prompt: 'What user would you like to ban?',
				},
				{
					key: 'reason',
					type: 'string',
					prompt: 'What is the ban reason?',
				},
			],
		});
	}

	run(message, { user, reason }) {
		user.ban({ reason: reason }).then((taggedUser) => {
			message.channel.send(`
			${taggedUser.displayName} has been successfully banned \nhttps://gfycat.com/playfulfittingcaribou`);

		}).catch(() => {
			message.channel.send('Access Denied');
		});
	}
	onError(err) {
		console.log(err);
	}
};