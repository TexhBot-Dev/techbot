import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Guild extends BaseEntity {
	@PrimaryColumn()
	id!: string;

	@Column()
	prefix: string | undefined;

	@Column({
		default: 0
	})
	slotsWinMultiplier!: number;

	@Column({
		default: 0
	})
	slotsMoneyPool!: number;
}
