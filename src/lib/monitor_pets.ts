import { container } from '@sapphire/framework';
import { randomInt } from './helpers/index.js';

setInterval(async () => {
	(await container.prisma.pet.findMany()).forEach(async (pet) => {
		if (pet.hunger < 0) {
			await container.prisma.pet.delete({
				where: {
					userID_petType: {
						petType: pet.petType,
						userID: pet.userID
					}
				}
			});

			if (container.client.isReady()) {
				void (await container.client.users.fetch(pet.userID)).send({
					content: `Your pet ${pet.name} has died of hunger because **you** neglected to feed it.`
				});
			}
		}
		// check if pet.lastFed has been over a day
		if (pet.lastFed.getTime() + 86400000 < Date.now()) {
			const hunger = pet.hunger - randomInt(1, 3);
			// If it has, subtract from pet.hunger
			await container.prisma.pet.update({
				where: {
					userID_petType: {
						petType: pet.petType,
						userID: pet.userID
					}
				},
				data: {
					hunger
				}
			});

			void (await container.client.users.fetch(pet.userID)).send({
				content: `Your pet ${pet.name} has lost ${hunger} points because you forgot to feed it!.`
			});
		}
	});
}, 86_400_000);
