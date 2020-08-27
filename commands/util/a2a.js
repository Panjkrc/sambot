const { Command } = require('discord.js-commando');

module.exports = class A2aCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'a2a',
			group: 'util',
			memberName: 'a2a',
			description: 'Just ask the question',
		});
	}

	run(message) {
		message.say('https://i.imgur.com/WD2qvhX.png')
			.then(console.log)
			.catch(console.error);
	}
	onError(err) {
		console.log(err);
	}
};