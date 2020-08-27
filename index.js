/* eslint-disable no-inline-comments */
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { prefix, token } = require('./config.json');
const AntiSpam = require('discord-anti-spam');
const AlLog = require('./util/log.js');

const client = new CommandoClient({
	commandPrefix: prefix,
	//				krc
	owner: ['520169649879384074'],
	invite: 'https://discord.gg/43acR23',
});

const alLog = new AlLog();
alLog.run(client);

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
});

client.on('error', console.error);

client.login(token);


function addVoteReations(message) {
	channelsToReactTo.forEach(channelsToReact => {
		if (message.channel.id.localeCompare(channelsToReact) == 0) {
			message.react('692318249152544798');
			message.react('692319126898606129');

		}
	});

}