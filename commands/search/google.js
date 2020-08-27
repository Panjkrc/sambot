const { Command } = require('discord.js-commando');

module.exports = class GoogleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'google',
			group: 'search',
			memberName: 'google',
			description: 'Runs a google search on provided arguments',
			args: [
				{
					key: 'text',
					type: 'string',
					prompt: 'What would you like to search for on Google?',
				},
			],
		});
	}

	run(message, { text }) {
		let url = new URL('https://google.com/search');

		url = addQuery(url, text);
		message.channel.send(url.href);
	}
	onError(err) {
		console.log(err);
	}
};

function addQuery(url, searchParams) {

	url.searchParams.append('q', searchParams);

	return url;

}