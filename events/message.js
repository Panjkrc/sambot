/* eslint-disable semi */
/* eslint-disable no-inline-comments */
const https = require('https');
const { isText } = require('istextorbinary');
const AntiSpam = require('discord-anti-spam');
const fs = require('fs');

const forbidenExtensions = ['bat', 'bin', 'cmd', 'rom', 'cpl', 'exe', 'gadget', 'inf1', 'ins', 'inx', 'isu', 'job', 'jse', 'lnk', 'msc', 'msi', 'msp', 'mst', 'paf', 'pif', 'ps1', 'reg', 'rgs', 'scr', 'sct', 'shb', 'shs', 'u3p', 'vb', 'vbe', 'vbscript', 'ws', 'wsf', 'wsh', 'zip', 'rar', '7z', 'tar', 'jar', 'apk'];
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
	maxDuplicatesInterval: 6000,
});


exports.run = async (client, message) => {
	if (message.author.bot) return;
	// console.log(message.content);
	antiSpam.message(message);
	addVoteReations(message);
	checkForFile(message);
};

function checkForFile(message) {

	if (message.attachments.find(attachment => {
		const extension = attachment.name.split('.').pop();
		if (!message.member.hasPermission('KICK_MEMBERS')) {

			if (extension == 'ino' && attachment.size < 1000) {
				convertInoToText(message, attachment);
			}
			else if (isText(attachment.name)) {
				if (message.content) {
					message.channel.send(`${message.author} said:\n\n${message.content}`);
				}
				message.channel.send(`${message.author} tried to submit a file.  Please note:   We do not support file debugging. Please paste you code to <https://pastebin.com/> or post it in code tags like this:\n\\\`\`\`cpp\n\tyour code goes here\n\`\`\``).then(() => { deleteAttachment(message, attachment) });


			}
			else if (forbidenExtensions.includes(extension)) {
				message.channel.send(`${message.author} you can't post that here, \`.${extension}\` is a forbidden file extension!`).then(() => { deleteAttachment(message, attachment) });
			}

		}
		else if (extension == 'ino' && attachment.size < 1000 && message.channel.id == '630736100742397960') {
			convertInoToText(message, attachment);
		}
	}));
}

function convertInoToText(message, attachment) {
	const tempFile = './downloaded-attachment.ino';
	const download = function(url, dest, cb) {
		const file = fs.createWriteStream(dest);
		https.get(url, function(response) {
			response.pipe(file);
			file.on('finish', function() {
				file.close(cb);
			});
		});
	};

	download(attachment.url, tempFile, () => {
		const readStream = fs.createReadStream(tempFile, 'utf8');
		let data = '';
		readStream.on('data', function(chunk) {
			data += chunk;
		}).on('end', function() {
			if (message.content) {
				message.channel.send(`${message.author} said:\n\n${message.content}`);
			}
			message.channel.send(`\`${attachment.name}\` file content sent by ${message.author}\n\`\`\`cpp\n${data}\n\`\`\``);

			fs.unlink(tempFile, (err) => {
				if (err) {
					console.error(err);
					return;
				}
			});
		});
	});
	deleteAttachment(message, attachment);

}

function deleteAttachment(message, attachment) {
	if (message.guild.id == '541496165976244224') {
		const channel = message.guild.channels.cache.get('541747349224161310');

		channel.send(`Message by ${message.author} deleted in ${message.channel}:\n${message.content}`, { files: [attachment] });
	}
	setTimeout(function() {
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
