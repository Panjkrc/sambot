const { Command } = require('discord.js-commando');

module.exports = class LmgtfyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lmgtfy',
			group: 'search',
			memberName: 'lmgtfy',
			description: 'Let me google that for you',
			args: [
				{
					key: 'text',
					type: 'string',
					prompt: 'What would you like to search for?',
				},

			],
		});
	}

	run(message, { text }) {
		let url = new URL('https://lmgtfy.com/');

		url = addQuery(url, text);
		message.channel.send(url.href);
	}
	onError(err) {
		console.log(err);
	}
};

function addQuery(url, text) {

	const searchParams = text.split(/ +/);

	const query = [];
	searchParams.forEach(element => {
		if (element.startsWith('-')) {
			if (element == '-iie') {
				url.searchParams.set('iie', '1');
			}
			else {
				url.searchParams.set('s', element.replace('-', ''));
			}
		}
		else {
			query.push(element);
		}

	});
	url.searchParams.append('q', query.join(' '));

	return url;

}