/* eslint-disable quotes */
/* eslint-disable max-statements-per-line */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable no-inline-comments */

/** List of keys
 * https://discord.com/developers/docs/resources/audit-log#audit-log-change-object-audit-log-change-key
 */

const changeKeyDescription = {
	name: 'name changed',
	icon_hash: 'icon changed',
	splash_hash: 'invite splash page artwork changed',
	owner_id: 'owner changed',
	region: 'region changed',
	afk_channel_id: 'afk channel changed',
	afk_timeout: 'afk timeout duration changed',
	mfa_level: 'two-factor auth requirement changed',
	verification_level: 'required verification level changed',
	explicit_content_filter: 'change in whose messages are scanned and deleted for explicit content in the server',
	default_message_notifications: 'default message notification level changed',
	vanity_url_code: 'guild invite vanity url changed',
	$add: 'added a role',
	$remove: 'removed a role',
	prune_delete_days: 'change in number of days after which inactive and role-unassigned members are kicked',
	widget_enabled: 'server widget enabled/disable',
	widget_channel_id: 'channel id of the server widget changed',
	system_channel_id: 'id of the system channel changed',
	position: 'text or voice channel position changed',
	topic: 'text channel topic changed',
	bitrate: 'voice channel bitrate changed',
	permission_overwrites: 'permissions on a channel changed',
	nsfw: 'channel nsfw restriction changed',
	application_id: 'application id of the added or removed webhook or bot',
	rate_limit_per_user: 'amount of seconds a user has to wait before sending another message changed',
	permissions: 'legacy permissions for a role changed',
	permissions_new: 'permissions for a role changed',
	color: 'role color changed',
	hoist: 'role is now displayed/no longer displayed separate from online users',
	mentionable: 'role is now mentionable/unmentionable',
	allow: 'legacy: a permission on a text or voice channel was allowed for a role',
	allow_new: 'a permission on a text or voice channel was allowed for a role',
	deny: 'legacy: a permission on a text or voice channel was denied for a role',
	deny_new: 'a permission on a text or voice channel was denied for a role',
	code: 'invite code changed',
	channel_id: 'channel for invite code changed',
	inviter_id: 'person who created invite code changed',
	max_uses: 'change to max number of times invite code can be used',
	uses: 'number of times invite code used changed',
	max_age: 'how long invite code lasts changed',
	temporary: 'invite code is temporary/never expires',
	deaf: 'user server deafened/undeafened',
	mute: 'user server muted/unmuted',
	nick: 'user nickname changed',
	avatar_hash: 'user avatar changed',
	id: 'the id of the changed entity - sometimes used in conjunction with other keys',
	type: 'type of entity created',
	enable_emoticons: 'integration emoticons enabled/disabled',
	expire_behavior: 'integration expiring subscriber behavior changed',
	expire_grace_period: 'integration expire grace period changed',
};


class Tools {

	resolveAuditLog(message, entrie) {
		let resolvedEntrie = '';

		switch (entrie.action) {
			case 'GUILD_UPDATE':
				resolvedEntrie += `made changes to ${message.guild.name}:\n\t`;
				entrie.changes.forEach(change => {
					resolvedEntrie += `${addKeyDescription(change)}: ${addOldNew(change)}`;
				});
				break;

			case 'CHANNEL_CREATE':
				resolvedEntrie += `created a ${entrie.target.type} channel [name: ${entrie.target.name} ][id: ${entrie.target.id} ]\n\t`;
				entrie.changes.forEach(change => {
					resolvedEntrie += `${addKeyDescription(change)}: ${addNew(change)}`;
				});
				break;

			case 'CHANNEL_UPDATE':
				resolvedEntrie += `updated a ${entrie.target.type} channel [name: ${entrie.target.name} ][id: ${entrie.target.id} ]\n\t`;
				entrie.changes.forEach(change => {
					resolvedEntrie += `${addKeyDescription(change)}: ${addNew(change)}`;
				});
				break;

			case 'CHANNEL_DELETE':
				resolvedEntrie += `deleted a ${entrie.target.type} channel [name: ${entrie.target.name} ][id: ${entrie.target.id} ]\n\t`;
				entrie.changes.forEach(change => {
					resolvedEntrie += `${addKeyDescription(change)}: ${addOld(change)}`;
				});
				break;

			case 'CHANNEL_OVERWRITE_CREATE':
				resolvedEntrie += `created channel overrides for [name: ${entrie.target.name} ][id: ${entrie.target.id} ]\n\t`;
				entrie.changes.forEach(change => {
					resolvedEntrie += `${addKeyDescription(change)}: ${addNew(change)}`;
				});
				break;

			case 'CHANNEL_OVERWRITE_DELETE':
				resolvedEntrie += `deleted channel overrides for [name: ${entrie.target.name} ][id: ${entrie.target.id} ]\n\t`;
				entrie.changes.forEach(change => {
					resolvedEntrie += `${addKeyDescription(change)}: ${addOld(change)}`;
				});
				break;

			case 'CHANNEL_OVERWRITE_UPDATE':
				resolvedEntrie += `updated channel overrides for [name: ${entrie.target.name} ][id: ${entrie.target.id} ]\n\t`;
				entrie.changes.forEach(change => {
					resolvedEntrie += `${addKeyDescription(change)}: ${addOldNew(change)}`;
				});
				break;

			case 'MEMBER_KICK':
				resolvedEntrie += `kicked ${entrie.target.tag} with reason: ${entrie.reason}`;
				break;


			case 'MEMBER_PRUNE':
				resolvedEntrie = `pruned ${entrie.extra.removed} members for ${entrie.extra.days} days of inactivity`;
				break;

			case 'MEMBER_BAN_ADD':
				resolvedEntrie = `banned ${entrie.target.tag} with reason: ${entrie.reason}`;
				break;

			case 'MEMBER_BAN_REMOVE':
				resolvedEntrie = `removed the ban for ${entrie.target.tag}`;
				break;

			case 'MEMBER_UPDATE':
				resolvedEntrie += `changed ${entrie.target.tag}:\n\t`;
				entrie.changes.forEach(change => {
					resolvedEntrie += `${addKeyDescription(change)}: ${addOldNew(change)}`;
				});
				break;

			case 'MEMBER_ROLE_UPDATE':
				resolvedEntrie += `updated roles for ${entrie.target.tag}:\n\t`;
				entrie.changes.forEach(change => {
					resolvedEntrie += `${addKeyDescription(change)}: ${addOldNew(change)}`;
				});
				break;

			case 'MEMBER_MOVE':
				resolvedEntrie += `moved ${entrie.extra.count} users to ${entrie.extra.channel.name} (channel id: ${entrie.extra.channel.id})\n\t`;
				break;

			case 'MEMBER_DISCONNECT':
				resolvedEntrie = `disconected ${entrie.extra.count} users from voice`;
				break;

			case 'BOT_ADD':
				resolvedEntrie = `added ${entrie.target.tag} to the server`;
				break;

			case 'ROLE_CREATE':
				resolvedEntrie = `created the role ${entrie.target.name}\n\t`;
				entrie.changes.forEach(change => {
					resolvedEntrie += `${addKeyDescription(change)}: ${addNew(change)}`;
				});
				break;

			case 'ROLE_UPDATE':
				resolvedEntrie = `updated the role ${entrie.target.name}\n\t`;
				entrie.changes.forEach(change => {
					resolvedEntrie += `${addKeyDescription(change)}: ${addOldNew(change)}`;
				});
				break;

			case 'ROLE_DELETE':
				resolvedEntrie = `deleted the role ${entrie.target.name}\n\t`;
				break;

			case 'INVITE_CREATE':
				resolvedEntrie = `created an invite\n\t`;
				entrie.changes.forEach(change => {
					resolvedEntrie += `${addKeyDescription(change)}: ${addNew(change)}`;
				});
				break;

			case 'INVITE_UPDATE':
				resolvedEntrie = `updated an invite\n\t`;
				entrie.changes.forEach(change => {
					resolvedEntrie += `${addKeyDescription(change)}: ${addOldNew(change)}`;
				});
				break;

			case 'INVITE_DELETE':
				resolvedEntrie = `updated an invite\n\t`;
				entrie.changes.forEach(change => {
					resolvedEntrie += `${addKeyDescription(change)}: ${addOld(change)}`;
				});
				break;

			case 'WEBHOOK_CREATE':
				resolvedEntrie = `created the weebhook (name: ${entrie.target.name}, avatar: ${entrie.target.avatar}, id: ${entrie.target.id}, type: ${entrie.target.type})\n\t`;
				entrie.changes.forEach(change => {
					resolvedEntrie += `${addKeyDescription(change)}: ${addNew(change)}`;
				});
				break;

			case 'WEBHOOK_UPDATE':
				resolvedEntrie = `updated the weebhook (name: ${entrie.target.name}, avatar: ${entrie.target.avatar}, id: ${entrie.target.id}, type: ${entrie.target.type})\n\t`;
				entrie.changes.forEach(change => {
					resolvedEntrie += `${addKeyDescription(change)}: ${addOldNew(change)}`;
				});
				break;

			case 'WEBHOOK_DELETE':
				resolvedEntrie = `deleted the weebhook (name: ${entrie.target.name}, avatar: ${entrie.target.avatar}, id: ${entrie.target.id}, type: ${entrie.target.type})\n\t`;
				entrie.changes.forEach(change => {
					resolvedEntrie += `${addKeyDescription(change)}: ${addOld(change)}`;
				});
				break;

			case 'EMOJI_CREATE':
				resolvedEntrie = `created the emoji (name: ${entrie.target.name}, id: ${entrie.target.id}, animated: ${entrie.target.animated})\n\t`;
				entrie.changes.forEach(change => {
					resolvedEntrie += `${addKeyDescription(change)}: ${addNew(change)}`;
				});
				break;

			case 'EMOJI_UPDATE':
				resolvedEntrie = `updated the emoji (name: ${entrie.target.name}, id: ${entrie.target.id}, animated: ${entrie.target.animated})\n\t`;
				entrie.changes.forEach(change => {
					resolvedEntrie += `${addKeyDescription(change)}: ${addOldNew(change)}`;
				});
				break;

			case 'EMOJI_DELETE':
				resolvedEntrie = `deleted the emoji (id: ${entrie.target.id})\n\t`;
				entrie.changes.forEach(change => {
					resolvedEntrie += `${addKeyDescription(change)}: ${addOld(change)}`;
				});
				break;

			case 'MESSAGE_DELETE':
				resolvedEntrie = `deleted ${entrie.extra.count} messages by ${entrie.target.tag} in #${entrie.extra.channel.name}\n\t`;
				break;

			case 'MESSAGE_BULK_DELETE':
				resolvedEntrie = `deleted ${entrie.extra.count} messages in #${entrie.target.name}\n\t`;
				break;

			case 'MESSAGE_PIN':
				resolvedEntrie = `pinned a message by ${entrie.target.tag} in #${entrie.extra.channel.name}\n\t`;
				break;

			case 'MESSAGE_UNPIN':
				resolvedEntrie = `unpinned a message by ${entrie.target.tag} in #${entrie.extra.channel.name}\n\t`;
				break;

			case 'INTEGRATION_CREATE':
				resolvedEntrie = 'INTEGRATION_CREATE';
				break;

			case 'INTEGRATION_UPDATE':
				resolvedEntrie = 'INTEGRATION_UPDATE';
				break;

			case 'INTEGRATION_DELETE':
				resolvedEntrie = 'INTEGRATION_DELETE';
				break;

			default:
				resolvedEntrie = `UNKNOWN ENTRIE ACTION: [${entrie.action}] - You shouldn't ever see an output like this. Please contact krc#8793 in this server: https://discord.gg/43acR23`;
				break;

		}
		return `\n[${entrie.createdAt}]\n${entrie.executor.tag} ${resolvedEntrie}\n`;
	}

}

function addOldNew(change) {
	return `old(${(Array.isArray(change.old) ? change.old.forEach(oldc => { return oldc; }) : change.old)}), new(${(Array.isArray(change.new) ? change.new.forEach(newc => { return newc; }) : change.new)})\n\t`;
}

function addOld(change) {
	return `old(${(Array.isArray(change.old) ? change.old.forEach(oldc => { return oldc; }) : change.old)})\n\t`;
}

function addNew(change) {
	return `new(${(Array.isArray(change.new) ? change.new.forEach(newc => { return newc; }) : change.new)})\n\t`;
}

function notFoundError(error, key) {
	return `ERROR: ${error}\n\tYou shouldn't ever see an output like this. Please contact krc#8793 in this server: https://discord.gg/43acR23`;
}

function addKeyDescription(change) {
	if (change.key in changeKeyDescription) {
		return `•${changeKeyDescription[change.key]}`;
	}
	else {
		return notFoundError(`UNKNOW AUDIT LOG CHANGE KEY [${change.key}] `, change.key);
	}
}

module.exports = Tools;