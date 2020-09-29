/* eslint-disable no-lonely-if */
/* eslint-disable no-undef */
/* eslint-disable no-inline-comments */
const { CommandoClient } = require('discord.js-commando');
const fs = require('fs');
const path = require('path');
const { prefix, token } = require('./config.json');
const AlLog = require('./util/log.js');
const client = new CommandoClient({
	commandPrefix: prefix,
	owner: ['520169649879384074', '509282163250692097', '265651045911232512'],
	invite: 'https://discord.gg/43acR23',
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

const alLog = new AlLog();
alLog.run(client);

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

fs.readdir('./events/', (err, files) => {
	if (err) console.log(err);
	files.forEach(file => {
		const eventFunc = require(`./events/${file}`);
		console.log('Successfully loaded ' + file);
		const eventName = file.split('.')[0];
		client.on(eventName, (...args) => eventFunc.run(client, ...args));
	});
});

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity(`${client.commandPrefix}help`);
});

client.on('error', console.error);

client.login(token);
