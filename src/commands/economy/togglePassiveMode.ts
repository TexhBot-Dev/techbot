import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<CommandOptions>({
	name: 'passiveModeToggle',
	description: "Toggle passive mode, when enabled you can't rob or be robbed by others.",
	detailedDescription: 'passivemodetoggle <bool>'
})
export default class TogglePassiveModeCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const newValue = interaction.options.getBoolean('new_mode', true);

		this.container.prisma.$executeRaw`
				UPDATE "Users"
				SET passiveMode = ${newValue}
				WHERE "id" = ${interaction.user.id}
			`;

		return interaction.reply({ content: `Your passive mode status is now **${newValue ? 'enabled' : 'disabled'}**!`, ephemeral: true });
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addBooleanOption((option) => option.setName('new_mode').setDescription('The new value of passive mode').setRequired(true)),
			{ idHints: ['977784302416846940'] }
		);
	}
}
