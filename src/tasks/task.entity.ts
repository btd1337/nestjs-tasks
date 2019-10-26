import { User } from './../auth/user.entity';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TaskStatus } from './task-status.enum';

@Entity()
export class Task extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column()
	status: TaskStatus;

	@ManyToOne(type => User, user => user.tasks, { eager: false })
	user: User;

	@Column()
	userId: number;

	constructor(
		title: string,
		description: string,
		status: TaskStatus,
		userId: number,
		id?: number,
	) {
		super();
		this.id = id ? id : undefined;
		this.title = title;
		this.description = description;
		this.status = status;
		this.userId = userId;
	}
}
