import { ApplyOptions } from '@sapphire/decorators';
import { isMessageInstance } from '@sapphire/discord.js-utilities';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'ping',
	description: 'Pings discord or something.',
	detailedDescription: '/ping'
})
export class StatsCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const msg = await interaction.reply({ content: `Ping?`, ephemeral: true, fetchReply: true });
		if (isMessageInstance(msg)) {
			const diff = msg.createdTimestamp - interaction.createdTimestamp;
			const ping = Math.round(this.container.client.ws.ping);
			return interaction.editReply(`Pong 🏓! (Round trip took: ${diff}ms. Heartbeat: ${ping}ms.)`);
		}
		return interaction.editReply('Failed to retrieve ping :(');
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['']
		});
	}
}
