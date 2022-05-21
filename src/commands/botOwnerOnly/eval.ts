import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { inspect } from 'util';
import { Type } from '@sapphire/type';
import { codeBlock, isThenable } from '@sapphire/utilities';
import { VM } from 'vm2';

const OWNERS = process.env.OWNERS?.split(',') ?? [];

@ApplyOptions<CommandOptions>({
	name: 'eval',
	description: 'Evals codes you provide out of the bot scope',
	// preconditions: ['ownerOnly'],
	flags: ['async', 'hidden', 'showHidden', 'silent', 's'],
	options: ['depth'],
	detailedDescription: 'eval [code]'
})
export default class EvalCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const code = interaction.options.getString('code') ?? '';

		const { result, success, type } = await this.eval(interaction, code, {
			async: interaction.options.getBoolean('async') ?? false,
			depth: interaction.options.getNumber('depth') ?? 0,
			showHidden: interaction.options.getBoolean('showHidden') ?? false
		});

		const output = success ? codeBlock('js', result) : `**ERROR**: ${codeBlock('bash', result)}`;
		if (Boolean(interaction.options.getBoolean('silent') ?? false)) return null;

		const typeFooter = `**Type**: ${codeBlock('typescript', type)}`;

		if (output.length > 2000) {
			return interaction.reply({
				content: `Output was too long... sent the result as a file.\n\n${typeFooter}`,
				files: [{ attachment: Buffer.from(output), name: 'output.js' }]
			});
		}

		return interaction.reply(`${output}\n${typeFooter}`);
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) => {
						return option.setName('code').setDescription('The code to eval').setRequired(true);
					})
					.addBooleanOption((option) => {
						return option.setName('async').setDescription('Run the code asynchronously');
					})
					.addNumberOption((option) => {
						return option.setName('depth').setDescription('The maximum depth of the result');
					})
					.addBooleanOption((option) => {
						return option.setName('hidden').setDescription('Show hidden properties');
					})
					.addBooleanOption((option) => {
						return option.setName('silent').setDescription('Wether or not to send the result');
					}),
			{
				idHints: ['968265380957151236']
			}
		);
	}

	private async eval(interaction: CommandInteraction, code: string, flags: { async: boolean; depth: number; showHidden: boolean }) {
		if (flags.async) code = `(async () => {\n${code}\n})();`;

		let success = true;
		let result = null;

		try {
			try {
				if (OWNERS.includes(interaction.user.id)) {
					// eslint-disable-next-line no-eval
					result = inspect(eval(code), { depth: flags.depth, showHidden: flags.showHidden });
				} else {
					result = inspect(new VM({ timeout: 1000, sandbox: {} }).run(code), {
						depth: flags.depth,
						showHidden: flags.showHidden
					});
				}
			} catch (error) {}
		} catch (error) {
			if (error && error instanceof Error && error.stack) {
				this.container.client.logger.error(error);
			}
			result = error;
			success = false;
		}

		const type = new Type(result).toString();
		if (isThenable(result)) result = await result;

		if (typeof result !== 'string') {
			result = inspect(result, {
				depth: flags.depth,
				showHidden: flags.showHidden
			});
		}

		return { result, success, type };
	}
}
