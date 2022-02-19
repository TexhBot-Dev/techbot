import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Advertisement } from './advertisement';
import { Inventory } from './inventory';

/*
import { Advertisement } from './advertisement';
import { Inventory } from './inventory';
 */

@Entity()
export class User extends BaseEntity {
	@PrimaryColumn()
	id!: string;

	@Column({
		default: 0
	})
	wallet!: number;

	@Column({
		default: 0
	})
	bank!: number;

	// @ts-ignore
	@OneToMany((type) => Inventory, (inventory) => inventory.userId)
	inventory!: Inventory[];

	@Column({
		default: false
	})
	premium!: boolean;

	@Column({
		default: 'default'
	})
	preferredEmojiColor!: string;

	// @ts-ignore
	@OneToMany((type) => Advertisement, (advertisement) => advertisement.userID)
	ads?: Advertisement[];

	@Column({
		default: 'jobless'
	})
	currentJob!: string;

	@Column({
		default: 0
	})
	jobEXP!: number;

	@Column({
		default: false
	})
	passiveMode!: boolean;
}
