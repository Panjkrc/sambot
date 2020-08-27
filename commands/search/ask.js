const { Command } = require('discord.js-commando');

module.exports = class AskTheCowCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ask',
			group: 'search',
			memberName: 'ask',
			description: 'Ask the cow something. NOTE: Ignores first two words',
			args: [
				{
					key: 'text',
					type: 'string',
					prompt: 'What would you like to ask the cow?',
				},
			],
		});
	}

	run(message, { text }) {
		let url = new URL('https://swisscows.com/web');

		url = addQuery(url, text);
		message.channel.send('<' + url.href + '>');
	}
	onError(err) {
		console.log(err);
	}
};

function addQuery(url, text) {
	const searchParams = text.split(/ +/);
	searchParams.splice(0, 2);
	const query = [];
	searchParams.forEach(element => {
		query.push(element);

	});
	url.searchParams.append('query', query.join(' '));

	return url;

}