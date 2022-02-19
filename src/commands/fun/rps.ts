import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<CommandOptions>({
	name: 'rps',
	description: 'Lets you play RPS with the bot!',
	detailedDescription: `rps <choice>`
})
export default class rpsCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const choice = interaction.options.getString('choice', true);

		if (choice === '') return interaction.reply('You need to specify a choice!');

		const userChoice = ['rock', 'paper', 'scissors'];
		const userChoiceIndex = userChoice.indexOf(choice);
		if (userChoiceIndex === -1)
			return interaction.reply(
				'You need to specify a valid choice! Valid choices are rock, paper, scissors.'
			);
		const botChoice = userChoice[Math.floor(Math.random() * userChoice.length)];
		const botChoiceIndex = userChoice.indexOf(botChoice);

		if (userChoiceIndex === botChoiceIndex)
			return interaction.reply('You and the bot both chose the same thing! Try again!');

		if (userChoiceIndex === 0 && botChoiceIndex === 1)
			return interaction.reply('You chose rock, and the bot chose paper! You lose!');
		if (userChoiceIndex === 0 && botChoiceIndex === 2)
			return interaction.reply('You chose rock, and the bot chose scissors! You win!');
		if (userChoiceIndex === 1 && botChoiceIndex === 0)
			return interaction.reply('You chose paper, and the bot chose rock! You win!');
		if (userChoiceIndex === 1 && botChoiceIndex === 2)
			return interaction.reply('You chose paper, and the bot chose scissors! You lose!');
		if (userChoiceIndex === 2 && botChoiceIndex === 0)
			return interaction.reply('You chose scissors, and the bot chose rock! You lose!');
		if (userChoiceIndex === 2 && botChoiceIndex === 1)
			return interaction.reply('You chose scissors, and the bot chose paper! You win!');

		return interaction.reply('Something went wrong!');
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription('This should be either "Rock", "Paper", or "Scissors".')
				.addStringOption((option) =>
					option
						.setName('choice')
						.setDescription('Your RPS bet.')
						.setRequired(true)
						.setChoices([
							['Rock', 'rock'],
							['Paper', 'paper'],
							['Scissors', 'scissors']
						])
				), {idHints:['944646067243331714']}
		);
	}
}
