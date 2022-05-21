import { PrismaClient } from '@prisma/client';
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url).replace(/seed.js$/, '');
/*
('GRILLED_CHEESE',50000,'EPIC','🍕','I was forgotten about by the devs ;(',false,false,false),
	 ('HELICOPTER',25000,'EPIC','🚁','I was forgotten about by the devs ;(',false,false,false),
	 ('HUNTING_RIFLE',10000,'COMMON','','I was forgotten about by the devs ;(',false,false,false),
	 ('GOLDEN_CHICKEN_NUGGET',10000,'EPIC','🐔','I was forgotten about by the devs ;(',false,false,false),
	 ('TV',5000,'RARE','📺','I was forgotten about by the devs ;(',false,false,false),
	 ('LAPTOP',2500,'RARE','','I was forgotten about by the devs ;(',false,false,false),
	 ('IPHONE',1500,'RARE','📱','I was forgotten about by the devs ;(',false,false,false),
	 ('FISHING_POLE',800,'COMMON','🎣','I was forgotten about by the devs ;(',false,false,false),
	 ('SCISSORS',500,'COMMON','✂️','I was forgotten about by the devs ;(',false,false,false),
	 ('TROPHY',200000,'LEGENDARY',':trophy:','I was forgotten about by the devs ;(',false,false,false);

	 turn into prisma.itemMetaData.createMany([{
		data: {}
	}])
*/

async function main() {
	await prisma.itemMetaData.createMany({
		data: [
			{
				name: 'GRILLED_CHEESE',
				price: 50000,
				rarity: 'EPIC',
				emoji: '🍕',
				description: 'I was forgotten about by the devs ;(',
				sellable: false,
				tradeable: false,
				collectable: false
			},
			{
				name: 'HELICOPTER',
				price: 25000,
				rarity: 'EPIC',
				emoji: '🚁',
				description: 'I was forgotten about by the devs ;(',
				sellable: false,
				tradeable: false,
				collectable: false
			},
			{
				name: 'HUNTING_RIFLE',
				price: 10000,
				rarity: 'COMMON',
				emoji: '',
				description: 'I was forgotten about by the devs ;(',
				sellable: false,
				tradeable: false,
				collectable: false
			},
			{
				name: 'GOLDEN_CHICKEN_NUGGET',
				price: 10000,
				rarity: 'EPIC',
				emoji: '🐔',
				description: 'I was forgotten about by the devs ;(',
				sellable: false,
				tradeable: false,
				collectable: false
			},
			{
				name: 'TV',
				price: 5000,
				rarity: 'RARE',
				emoji: '📺',
				description: 'I was forgotten about by the devs ;(',
				sellable: false,
				tradeable: false,
				collectable: false
			},
			{
				name: 'LAPTOP',
				price: 2500,
				rarity: 'RARE',
				emoji: '',
				description: 'I was forgotten about by the devs ;(',
				sellable: false,
				tradeable: false,
				collectable: false
			},
			{
				name: 'IPHONE',
				price: 1500,
				rarity: 'RARE',
				emoji: '📱',
				description: 'I was forgotten about by the devs ;(',
				sellable: false,
				tradeable: false,
				collectable: false
			},
			{
				name: 'FISHING_POLE',
				price: 800,
				rarity: 'COMMON',
				emoji: '🎣',
				description: 'I was forgotten about by the devs ;(',
				sellable: false,
				tradeable: false,
				collectable: false
			},
			{
				name: 'SCISSORS',
				price: 500,
				rarity: 'COMMON',
				emoji: '✂️',
				description: 'I was forgotten about by the devs ;(',
				sellable: false,
				tradeable: false,
				collectable: false
			},
			{
				name: 'TROPHY',
				price: 200000,
				rarity: 'LEGENDARY',
				emoji: ':trophy:',
				description: 'I was forgotten about by the devs ;(',
				sellable: false,
				tradeable: false,
				collectable: false
			}
		]
	});

	/*
	INSERT INTO public."Job" (name,description,"minimumXP") VALUES
	 ('JANITOR','Mop the floor, clean the toilets.',0),
	 ('COOK','Cook, clean, eat.',300),
	 ('FIRE_FIGHTER','Fight fires, make bank.',450),
	 ('YOUTUBER','Rake in money from the ads.',590),
	 ('INVESTOR','Invest in companies.',800),
	 ('PEPE_KING',' wish you were this.',1024);
	*/
	await prisma.job.createMany({
		data: [
			{
				name: 'JANITOR',
				description: 'Mop the floor, clean the toilets.',
				minimumXP: 0
			},
			{
				name: 'COOK',
				description: 'Cook, clean, eat.',
				minimumXP: 300
			},
			{
				name: 'FIRE_FIGHTER',
				description: 'Fight fires, make bank.',
				minimumXP: 450
			},
			{
				name: 'YOUTUBER',
				description: 'Rake in money from the ads.',
				minimumXP: 590
			},
			{
				name: 'INVESTOR',
				description: 'Invest in companies.',
				minimumXP: 800
			},
			{
				name: 'PEPE_KING',
				description: ' wish you were this.',
				minimumXP: 1024
			},
		]
	});

	/*
	INSERT INTO public."PetMetaData" ("type",price,rarity,tradeable,collectable,"feedInterval") VALUES
	 ('DOG',150,'COMMON',false,false,0);
	*/
	await prisma.petMetaData.createMany({
		data: [
			{
				type: 'DOG',
				price: 150,
				rarity: 'COMMON',
				tradeable: false,
				collectable: false,
				feedInterval: 0
			}
		]
	});
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	});