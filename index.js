/* eslint-disable no-undef */
/* eslint-disable no-inline-comments */
const { CommandoClient } = require('discord.js-commando');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { prefix, token } = require('./config.json');
const AntiSpam = require('discord-anti-spam');
const AlLog = require('./util/log.js');
const { isText } = require('istextorbinary');

const client = new CommandoClient({
	commandPrefix: prefix,
	//				krc
	owner: ['520169649879384074'],
	invite: 'https://discord.gg/43acR23',
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

const alLog = new AlLog();
alLog.run(client);

const forbidenExtensions = ['bat', 'bin', 'cmd', 'rom', 'cpl', 'exe', 'gadget', 'inf1', 'ins', 'inx', 'isu', 'job', 'jse', 'lnk', 'msc', 'msi', 'msp', 'mst', 'paf', 'pif', 'ps1', 'reg', 'rgs', 'scr', 'sct', 'shb', 'shs', 'u3p', 'vb', 'vbe', 'vbscript', 'ws', 'wsf', 'wsh', 'zip', 'rar', '7z', 'tar', 'jar'];
const channelsToReactTo = ['541501807638085644', '541501708765757442', '541833033439772692', '542204514900508683', '554553231183970326', '558978622677843969', '541502163424247828', '541502408866660353', '541838123643043841', '713354216248311868', '693845605478563940'];

const antiSpam = new AntiSpam({
	kickEnabled: false,
	warnThreshold: 5, // Amount of messages sent in a row that will cause a warning.
	banThreshold: 10, // Amount of messages sent in a row that will cause a ban.
	muteThreshold: 6, // Amount of messages sent in a row that will cause a mute.
	maxInterval: 5000, // Amount of time (in milliseconds) in which messages are considered spam.
	warnMessage: '{@user}, Please stop spamming.', // Message that will be sent in chat upon warning a user.
	kickMessage: '**{user_tag}** has been kicked for spamming.', // Message that will be sent in chat upon kicking a user.
	banMessage: '**{user_tag}** has been banned for spamming. \nhttps://gfycat.com/playfulfittingcaribou', // Message that will be sent in chat upon banning a user.
	muteMessage: '**{user_tag}** has been muted for spamming.', // Message that will be sent in chat upon muting a user.
	maxDuplicatesWarning: 3, // Amount of duplicate messages that trigger a warning.
	maxDuplicatesBan: 7, // Amount of duplicate messages that trigger a warning.
	maxDuplicatesMute: 4, // Amount of duplicate messages that trigger a warning.
	// Discord permission flags: https://discord.js.org/#/docs/main/master/class/Permissions?scrollTo=s-FLAGS
	exemptPermissions: ['ADMINISTRATOR', 'KICK_MEMBERS'], // Bypass users with any of these permissions(These are not roles so use the flags from link above).
	ignoreBots: true, // Ignore bot messages.
	verbose: true, // Extended Logs from module.
	ignoredRoles: [],
	ignoredChannels: ['613873813507276821', '541501807638085644', '541501708765757442', '541833033439772692', '542204514900508683', '554553231183970326', '558978622677843969', '541502163424247828', '541502408866660353', '541838123643043841', '713354216248311868', '693845605478563940'],
	banErrorMessage: 'Could not ban **{user_tag}** because of improper permissions.',
	maxDuplicatesInterval: 5000,
});


client.registry
	.registerDefaultTypes()
	.registerGroups([
		['admin', 'Admin commands'],
		['util', 'Utility'],
		['search', 'Commands used to search thing'],
		['owner', 'Commands only bot owners can use (selected group)', true],
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
		unknownCommandResponse: false,
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));


client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity(`${client.commandPrefix}help`);
});

client.on('message', message => {
	antiSpam.message(message);
	addVoteReations(message);
	checkForFile(message);
});

client.on('error', console.error);

client.on('messageReactionAdd', async (reaction) => {
	if (reaction.message.member.guild.me.hasPermission('KICK_MEMBERS')) {
		// When we receive a reaction we check if the reaction is partial or not
		if (reaction.partial) {
			// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
			try {
				await reaction.fetch();

			}
			catch (error) {
				console.log('Something went wrong when fetching the message: ', error);
				// Return as `reaction.message.author` may be undefined/null
				return;
			}
		}
		if (reaction.emoji != null && reaction.emoji.id == '674859298131542029') {
			const messageContent = reaction.message;
			reaction.message.delete();
			reaction.message.channel.send(`Message sent by **${reaction.message.author.username}**:\n\`\`\`cpp\n${messageContent.content} \`\`\` `);
		}
	}
});

client.login(token);

function checkForFile(message) {
	if (message.attachments.find(attachment => {
		if (!message.member.hasPermission('KICK_MEMBERS')) {
			const extension = attachment.name.split('.').pop();
			if (extension == 'ino' && attachment.size < 1000) {

				const download = function (url, dest, cb) {
					const file = fs.createWriteStream(dest);
					https.get(url, function (response) {
						response.pipe(file);
						file.on('finish', function () {
							file.close(cb);
						});
					});
				};

				download(attachment.url, './downloaded-attachment.ino', () => {
					const readStream = fs.createReadStream('./downloaded-attachment.ino', 'utf8');
					let data = '';
					readStream.on('data', function (chunk) {
						data += chunk;
					}).on('end', function () {
						const mContent = message.content;
						console.log(mContent.lenght);
						if (mContent) {

							message.channel.send(`${message.author} said:\n\n${message.content}`);
						}
						message.channel.send(`\`${attachment.name}\` file content sent by ${message.author}\n\`\`\`cpp\n${data}\n\`\`\``);

						fs.unlink('./downloaded-attachment.ino', (err) => {
							if (err) {
								console.error(err);
								return;
							}
						});
					});
				});
				deleteAttachment(message, attachment);
			}
			else if (isText(attachment.name)) {
				console.log(`The file ${attachment.name} was detected as text file`);
				message.channel.send(`${message.author} We don't support file debugging. Please paste you code to <https://pastebin.com> or post it in code tags like this:\n\\\`\`\`cpp\n\tyour code goes here\n\`\`\``);
				deleteAttachment(message, attachment);

			}
			else if (forbidenExtensions.includes(extension)) {
				message.channel.send(`${message.author} you can't post that here, \`.${extension}\` is a forbidden file extension!`);
				deleteAttachment(message, attachment);
			}

		}
	}));
}

function deleteAttachment(message, attachment) {
	if (message.guild.id == '541496165976244224') {
		const channel = message.guild.channels.cache.get('541747349224161310');

		channel.send(`Message by ${message.author} deleted in ${message.channel}:\n${message.content}`, { files: [attachment] });
	}
	setTimeout(function () {
		message.delete();
	}, 1000);

}

function addVoteReations(message) {
	channelsToReactTo.forEach(channelsToReact => {
		if (message.channel.id.localeCompare(channelsToReact) == 0) {
			message.react('692318249152544798');
			message.react('692319126898606129');

		}
	});

}