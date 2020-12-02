import { Channel, TextChannel } from "discord.js";

import { discordClient } from "../bin/www";

export function sendRollResult(guildID: string, channelName: string, message: string): void {
	const guild = discordClient.guilds.cache.get(guildID);
	if (guild) {
		const channel = guild.channels.cache.find((channel: Channel) => { return (channel as TextChannel).name === channelName; });
		if (channel && channel.type === "text") { (channel as TextChannel).send(message); }
	}
}