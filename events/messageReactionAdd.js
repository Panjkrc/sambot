exports.run = async (client, reaction) => {
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
};