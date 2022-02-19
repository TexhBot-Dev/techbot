import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Inventory extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	userId!: string;

	@Column()
	itemID!: number;

	@Column({
		default: 0
	})
	amount!: number;
}
