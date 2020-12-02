import { Channel, GuildMember, TextChannel } from "discord.js";

import { discordClient } from "../bin/www";

export function sendRollResult(guildID: string, channelName: string, message: string, username: string): void {
	const guild = discordClient.guilds.cache.get(guildID);
	if (guild) {
		const member = guild.members.cache.find((member: GuildMember) => { return member.displayName === username; });
		const channel = guild.channels.cache.find((channel: Channel) => { return (channel as TextChannel).name === channelName; });

		if (channel && channel.type === "text") {
			(channel as TextChannel).send(`${(member) ? `<@${member.user.id}> ` : ""}${message.charAt(0).toLowerCase() + message.slice(1)}`);
		}
	}
}