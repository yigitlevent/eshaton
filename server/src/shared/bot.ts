import { Channel, GuildMember, TextChannel } from "discord.js";

import { discordClient } from "../bin/www";

export function sendRollResult(guildID: string, channelName: string, message: string, username: string): void {
	const guild = discordClient.guilds.cache.get(guildID);
	if (guild) {


		console.log(guild.members.cache);
		const member = guild.members.cache.find((member: GuildMember) => { console.log(member); return member.nickname === username; });

		console.log(member);
		const channel = guild.channels.cache.find((channel: Channel) => { return (channel as TextChannel).name === channelName; });

		if (channel && channel.type === "text") {
			(channel as TextChannel).send(`${(member) ? `<@${member.user.id}> ` : ""}${(member) ? message.charAt(0).toLowerCase() + message.slice(1) : message}`);
		}
	}
}