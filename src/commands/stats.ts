import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { DurationFormatter } from '@sapphire/time-utilities';
import { codeBlock } from '@sapphire/utilities';
import { stripIndents } from 'common-tags';
import { CommandInteraction, version } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'stats',
	description: 'Shows some interesting stats about the bot.',
	detailedDescription: 'stats'
})
export class StatsCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const duration = new DurationFormatter().format(this.container.client.uptime!);
		const string = `
			= STATISTICS =
			• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
			• Uptime     :: ${duration}
			• Users      :: ${this.container.client.users.cache.size.toLocaleString()}
			• Servers    :: ${this.container.client.guilds.cache.size.toLocaleString()}
			• Channels   :: ${this.container.client.channels.cache.size.toLocaleString()}
			• Discord.js :: v${version}
			• Node       :: ${process.version}`;
		return void interaction.reply({
			content: codeBlock('asciidoc', stripIndents(string))
		});
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['944645459165712454']
		});
	}
}
