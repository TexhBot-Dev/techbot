import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageActionRow, MessageButton, MessageComponentInteraction, User as DiscordUser, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchItemMetaData, fetchUser, fetchUserInventory, generateErrorEmbed } from '../../lib/helpers';
import type { ItemNames, User } from '@prisma/client';

@ApplyOptions<CommandOptions>({
	name: 'trade',
	description: 'Trade with others.',
	detailedDescription: 'trade',
	preconditions: ['accountVerified']
})
export default class TradeCommand extends Command {
	private origin!: CommandInteraction;
	private meta!: Meta;

	public override async chatInputRun(interaction: CommandInteraction) {
		this.origin = interaction;
		const requestedUser = interaction.options.getUser('user', true);
		const offer = interaction.options.getString('offer', true);
		const request = interaction.options.getString('request');
		const dbUser = await fetchUser(interaction.user);

		const meta: Meta = {
			offer: {
				item: offer.replace(/[0-9]/g, '').trim().toConstantCase(),
				amount: parseInt(offer.replace(/[^0-9]/g, '').trim()) || 1,
				from: {
					user: interaction.user,
					dbUser: await fetchUser(interaction.user)
				}
			},
			requested: {
				item: request?.replace(/[0-9]/g, '').trim().toConstantCase() || undefined,
				amount: parseInt(offer.replace(/[^0-9]/g, '').trim()) || 1,
				from: {
					user: requestedUser,
					dbUser: await fetchUser(requestedUser)
				}
			}
		};
		this.meta = meta;

		if (meta.offer.item === 'coins' || (meta.offer.item === '' && meta.offer.amount) || meta.offer.item === 'money') {
			if (!meta.offer.amount || isNaN(meta.offer.amount))
				return void interaction.reply({
					embeds: [generateErrorEmbed(`Invalid integer '${meta.offer.amount}'.`, 'Invalid Offer Number')],
					ephemeral: true
				});
			if (dbUser.wallet < meta.offer.amount)
				return void interaction.reply({
					embeds: [generateErrorEmbed(`You don't have enough money to trade ${meta.offer.amount} coins.`, 'Invalid Offer Number')],
					ephemeral: true
				});
			this.tradeConfirmation();
		} else {
			const itemOffered = await fetchItemMetaData(meta.offer.item.toConstantCase() as ItemNames);
			// console.log(itemOffered)
			// if (!itemOffered.name)
			// 	return void interaction.reply({
			// 		embeds: [generateErrorEmbed(`No such item ${meta.offer.item.toConstantCase()} exists.`, 'Invalid Item')],
			// 		ephemeral: true
			// 	});
			const offeredInventoryItem = await fetchUserInventory(interaction.user, itemOffered.name.toConstantCase() as ItemNames);
			if ((offeredInventoryItem?.count ?? 0) < meta.offer.amount)
				return void interaction.reply({
					embeds: [
						generateErrorEmbed(
							`You have ${offeredInventoryItem?.count?.toLocaleString() ?? 0} of ${meta.offer.item.toProperCase()} but offered ${
								meta.offer.amount
							} ${meta.offer.item.toProperCase()}. You cannot offer more items than you have.`,
							'Invalid Offer'
						)
					],
					ephemeral: true
				});
			this.tradeConfirmation();
		}
		return;
	}

	private async tradeConfirmation() {
		const interaction = this.origin;
		const meta = this.meta;

		const offerConfirmationReply = await interaction.reply({
			content: `Are you sure you'd like to trade ${meta.offer.amount} ${meta.offer.item.toProperCase()} for ${
				meta.requested.amount
			} ${meta.requested.item?.toProperCase()}? Both you and ${
				meta.requested.from.user.tag
			} will be able to adjust your offers before locking in.`,
			ephemeral: true,
			components: [userConfirmTradeRow],
			fetchReply: true
		});
		const filter = (i: MessageComponentInteraction) => /yes|no/.test(i.customId) && i.user.id === interaction.user.id;

		const offerConfirmation = interaction.channel ? interaction.channel.createMessageComponentCollector({ filter, time: 20_000 }) : null;
		if (!offerConfirmation) return;

		offerConfirmation.on('collect', async (i) => {
			switch (i.customId) {
				case 'yes':
					{
						void i.update({ components: [] });
						this.progress();
					}
					break;
				case 'no':
					{
						void i.update({ content: 'Trade successfully canceled.', components: [] });
					}
					break;
			}
		});
		offerConfirmation.on('end', async () => {
			offerConfirmationReply.components = [];
		});
	}

	private async progress() {
		const interaction = this.origin;
		const meta = this.meta;
		console.log(meta);
		const row = new MessageActionRow().addComponents(
			new MessageButton().setCustomId('edit').setLabel('Edit Trade').setStyle('SECONDARY'),
			new MessageButton().setCustomId('lock').setLabel('Lock In').setStyle('SUCCESS'),
			new MessageButton().setCustomId('cancel').setLabel('Cancel Trade').setStyle('DANGER')
		);
		const response = new MessageEmbed()
			.setTitle('Trade Request')
			.setDescription(
				`${interaction.user.tag} has offered ${meta.offer.amount} ${meta.offer.item.toProperCase()}` +
					(meta.requested?.item
						? ` for ${
								meta.requested.amount
						  } ${meta.requested.item.toProperCase()}. You can make a counter offer by clicking the "Edit Offering" button. This functionality will be disabled once a user locks in. Once both traders are locked in, the trade is done automatically and securely.`
						: `. However, ${interaction.user.tag} didn't provide a explicit starting offer, so you can make their own bid.`)
			);
		const followUp = await interaction.channel?.send({
			content: meta.requested.from.user.toString(),
			embeds: [response],
			components: [row]
		});
		const filter = (i: MessageComponentInteraction) =>
			/edit|lock|cancel|confirm/.test(i.customId) && (i.user.id === interaction.user.id || i.user.id === meta.requested.from.user.id);

		const btnClick = interaction.channel ? interaction.channel.createMessageComponentCollector({ filter, time: 20_000 }) : null;
		btnClick?.on('collect', async (i) => {
			switch (i.customId) {
				case 'cancel':
					const canceledEmbed = new MessageEmbed()
						.setColor('RED')
						.setTitle('Canceled Trade')
						.setDescription(
							`A trade between ${meta.offer.from.user.toString()} and ${meta.requested.from.user} was canceled by ${i.user.toString()}.`
						);
					{
						followUp?.edit({ components: [], embeds: [canceledEmbed] });
					}
					break;
				case 'lock':
					{
						if (!meta.lockedIn) {
							const lockedRow = new MessageActionRow().addComponents(
								new MessageButton().setCustomId('edit').setLabel('Edit Trade').setStyle('SECONDARY').setDisabled(true),
								new MessageButton().setCustomId('unlock').setLabel('Unlock').setStyle('SECONDARY'),
								new MessageButton().setCustomId('lock').setLabel('Lock In').setStyle('SUCCESS'),
								new MessageButton().setCustomId('cancel').setLabel('Cancel Trade').setStyle('DANGER')
							);
							meta.lockedIn = i.user;
							i.reply({ content: 'You are now locked in!', ephemeral: true });
							followUp?.edit({
								embeds: [
									response.setDescription(
										response.description +
											`\n\n${i.user.toString()} has locked in. Waiting for ${
												i.user.id === meta.offer.from.user.id
													? meta.requested.from.user.toString()
													: meta.offer.from.user.toString()
											} to lock in to complete the trade.`
									)
								],
								components: [lockedRow]
							});
							return;
						}

						if (meta.lockedIn?.id === i.user.id) return i.reply({ content: `You've already locked in.`, ephemeral: true });

						// if (meta.tradeType)
					}
					break;
			}
		});
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) =>
						option
							.setName('offer')
							.setDescription('Your item or coins to trade (like this: 2 helicopter or 200 coins)')
							.setRequired(true)
							.setAutocomplete(true)
					)
					.addUserOption((option) =>
						option
							.setName('user')
							.setDescription('The user you would like to trade with. If no user is provided then any one can accept the trade.')
							.setRequired(true)
					)
					.addStringOption((option) =>
						option
							.setName('request')
							.setDescription('What you request in return for your items or coins. If you are offering coins this must be an item.')
							.setAutocomplete(true)
							.setRequired(false)
					),
			{ idHints: ['967872899602075699'] }
		);
	}
}

interface Meta {
	lockedIn?: DiscordUser;
	tradeType?: 'ITEM_FOR_ITEM' | 'COINS_FOR_ITEM';
	offer: {
		item: string;
		amount: number;
		from: {
			user: DiscordUser;
			dbUser: User;
		};
	};
	requested: {
		item: string | undefined;
		amount: number;
		from: {
			user: DiscordUser;
			dbUser: User;
		};
	};
}
