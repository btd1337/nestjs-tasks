import * as bcrypt from 'bcrypt';
import { Task } from '../tasks/task.entity';
import { Entity, Unique, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column()
	password: string;

	@Column()
	salt: string;

	@OneToMany(type => Task, task => task.user, { eager: true })
	tasks: Task[];

	constructor(username?: string, password?: string) {
		super();
		this.username = username;
		this.password = password;
	}

	async validatePassword(password: string): Promise<boolean> {
		const hash = await bcrypt.hash(password, this.salt);
		return hash === this.password;
	}
}
