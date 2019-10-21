import { User } from './../auth/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetTasksFiltersDto } from 'src/DTO/get-task-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from 'src/DTO/create-task.DTO';

@Injectable()
export class TasksService {
	constructor(
		@InjectRepository(TaskRepository)
		private taskRepository: TaskRepository,
	) {}

	async getTasks(filterDto: GetTasksFiltersDto, user: User): Promise<Task[]> {
		return this.taskRepository.getTasks(filterDto, user);
	}

	async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
		return this.taskRepository.createTask(createTaskDto, user);
	}

	async getTaskById(id: number, user: User): Promise<Task> {
		const found = await this.taskRepository.findOne({
			where: { id, userId: user.id },
		});
		if (!found) {
			throw new NotFoundException('task not found');
		}
		return found;
	}

	async deleteTask(id: number, user: User): Promise<void> {
		const result = await this.taskRepository.delete({ id, userId: user.id });

		if (result.affected === 0) {
			throw new NotFoundException('task not found');
		}
	}

	async updateTaskStatus(id: number, user: User, status: TaskStatus): Promise<Task> {
		const task = await this.getTaskById(id, user);
		task.status = status;
		await task.save();
		return task;
	}
}
