import { Channel, GuildMember, TextChannel } from "discord.js";

import { discordClient } from "../bin/www";

export function sendRollResult(guildID: string, channelName: string, message: string, username: string): void {
	const guild = discordClient.guilds.cache.get(guildID);
	if (guild) {
		guild.members.fetch()
			.then((value) => {
				const member = value.find((member: GuildMember) => { return member.nickname === username; });
				const channel = guild.channels.cache.find((channel: Channel) => { return (channel as TextChannel).name === channelName; });
				if (channel && channel.type === "text") {
					(channel as TextChannel).send(`${(member) ? `<@${member.user.id}>` : username} ${(member) ? message : message}`);
				}
			})
			.catch((reason) => { console.log(reason); });
	}
}