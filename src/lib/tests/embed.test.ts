import { MessageEmbed } from 'discord.js';
import { generateEmbed, generateErrorEmbed } from '../helpers';

describe('embeds', () => {
	test('GIVEN some embed data CREATE a embed THEN RETURN it', () => {
		const embed = generateEmbed('hey', 'hello');
		expect(embed).toBeInstanceOf(MessageEmbed);
		expect(embed.description).toBe('hello');
		expect(embed.title).toBe('hey');
	});

	test('GIVEN some error embed data CREATE a embed THEN RETURN it', () => {
		const embed = generateErrorEmbed('hey', 'hello');

		expect(embed).toBeInstanceOf(MessageEmbed);
		expect(embed.title).toContain('hello');
		expect(embed.description).toBe('hey');
	});
});
