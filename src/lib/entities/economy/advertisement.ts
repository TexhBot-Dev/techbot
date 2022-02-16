import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Advertisement extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	userID: string | undefined;

	@Column()
	messageID: string | undefined;

	@Column()
	channelID: string | undefined;

	@Column()
	guildID: string | undefined;

	@Column()
	title: string | undefined;

	@Column()
	description: string | undefined;

	@Column()
	price: number | undefined;

	@Column()
	duration: number | undefined;

	@Column()
	type: string | undefined;

	@Column()
	image: string | undefined;

	@Column()
	thumbnail: string | undefined;

	@Column()
	color: string | undefined;
}
