/* eslint-disable max-statements-per-line */
/* eslint-disable quotes */
/* eslint-disable indent */
const request = require('request');
const { Command } = require('discord.js-commando');
const ALR = require('../../util/tools.js');

const AuditLogResolver = new ALR();

module.exports = class LogsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'logs',
			group: 'admin',
			memberName: 'logs',
			description: 'Returns server audit logs',
			guildOnly: true,
			userPermissions: ['VIEW_AUDIT_LOG'],
			// Command usage limited to once every day because of being resource heavy
			throttling: {
				usages: 1,
				duration: 86400,
			},
			args: [
				{
					key: 'arg',
					type: 'string',
					prompt: '',
					default: '',
				},
			],
		});
	}

	run(message, { arg }) {

		const args = arg.split(/ +/);
		console.log(args);
		// console.log(args[1].slice(3, -1));
		const limit = (!(args[0] === null)) ? (isNaN(parseInt(args[0], 10)) ? null : parseInt(args[0], 10)) : null;
		const user = message.mentions.members.first();
		// const user = (!(args[1] === null)) ? this.client.users.resolveID(tuser.id) : null;
		console.log(`${limit} ${user}`);
		const formData = {

			text: '',

		};

		message.say('Trying to retrive audit logs...');

		message.guild.fetchAuditLogs({
			limit: limit,
			user: user,
		})
			.then(audit => {
				audit.entries.forEach(entrie => {
					formData.text += AuditLogResolver.resolveAutitLog(message, entrie);
				});
				request.post({ url: 'https://file.io', formData: formData }, function optionalCallback(err, httpResponse, body) {
					const obj = JSON.parse(body);
					if (err) {
						console.log(obj.succes);
						console.error('upload failed:', err);
						message.say('Unable to download logs');
						return;
					}
					console.log('Upload successful!');
					message.say(`Retriving logs successful!\nHere is one time use link:\n<${obj.link}>`);
				});
			})
			.catch(console.error);

	}
	onError(err) {
		console.log(err);
	}
};