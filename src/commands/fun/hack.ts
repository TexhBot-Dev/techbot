import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { randomUnitInterval } from '#lib/helpers';

const dms = ['Nice toes', 'Sheesh!', 'Chill bro', 'We are just friends?', 'Is it small?', 'Love you too mom.'];
const passwords = ['Greyissilly123', 'OwOSupriseDolls69', 'BigBoi420', 'HugeToad213', 'password', 'timothyoncrack'];
const emails = ['deeznuts@yahoo.com', 'joemomma@gmail.com', 'nullvoid@gmail.com', 'kekwww@gmail.com', 'thatonedude@gmail.com'];
const realNames = ['Timothy Green', 'Joe Smith', 'James Madison', 'Harry Cox', 'Lipin Jection', 'Pat Myaz', "Nick O' Teen"];

@ApplyOptions<CommandOptions>({
	name: 'hack',
	description: 'Hack a user. 100% real, totally.',
	detailedDescription: 'hack <user>',
	cooldownDelay: 200_000
})
export class ReverseCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const user = interaction.options.getUser('user');
		await interaction.reply(`Hacking ${user}... 0%`);
		setTimeout(async () => {
			await interaction.editReply('Getting IP... 9%');
		}, 1000);
		setTimeout(() => {
			void interaction.editReply(`Got IP... ${this.ip()}`);
		}, 2500);
		setTimeout(() => {
			void interaction.editReply('Stealing identity ... 17%');
		}, 5000);
		setTimeout(() => {
			void interaction.editReply('Stole identity!');
		}, 6500);
		setTimeout(() => {
			void interaction.editReply('Buying vbucks... 27%');
		}, 8500);
		setTimeout(() => {
			void interaction.editReply('Purchased 19 dollar forknife card!');
		}, 11000);
		setTimeout(() => {
			void interaction.editReply('Getting last message sent in DMs... 39%');
		}, 13000);
		setTimeout(() => {
			void interaction.editReply(`Last message sent in DMs: \`${dms.randomElement()}\``);
		}, 15000);
		setTimeout(() => {
			void interaction.editReply(`Getting password... 50%`);
		}, 17000);
		setTimeout(() => {
			void interaction.editReply(`Password is \`${passwords.randomElement()}\``);
		}, 19000);
		setTimeout(() => {
			void interaction.editReply('Getting email... 74%');
		}, 21000);
		setTimeout(() => {
			void interaction.editReply(`Got email! \`${emails.randomElement()}\``);
		}, 23000);
		setTimeout(() => {
			void interaction.editReply('Getting real name... 89%');
		}, 25000);
		setTimeout(() => {
			void interaction.editReply(`Got real name! \`${realNames.randomElement()}\``);
		}, 27000);
		setTimeout(() => {
			void interaction.editReply('Selling information on black market... 96%');
		}, 30000);
		setTimeout(() => {
			void interaction.editReply('Sold all information on black market! Haha.');
		}, 33000);
		setTimeout(() => {
			void interaction.editReply('A totally real and dangerous have complete.');
		}, 35500);
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addUserOption((option) => option.setName('user').setDescription('The user to hack.').setRequired(true)),
			{ idHints: ['944645979905331251'] }
		);
	}

	private ip() {
		return `${Math.floor(randomUnitInterval() * 255)}.${Math.floor(randomUnitInterval() * 255)}.${Math.floor(
			randomUnitInterval() * 255
		)}.${Math.floor(randomUnitInterval() * 255)}`;
	}
}
