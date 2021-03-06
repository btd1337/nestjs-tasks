import { User } from './../auth/user.entity';
import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from 'src/dtos/create-task.dto';
import { GetTasksFiltersDto } from 'src/dtos/get-task-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
	async getTasks(filterDto: GetTasksFiltersDto, user: User): Promise<Task[]> {
		const { status, search } = filterDto;
		const query = this.createQueryBuilder('task');

		query.where('task.userId=:userId', { userId: user.id });
		if (status) {
			query.andWhere('task.status=:status', { status });
		}
		if (search) {
			query.andWhere('task.title:search OR task.description LIKE search', {
				search,
			});
		}
		const tasks = await query.getMany();
		return tasks;
	}
	async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
		const { title, description } = createTaskDto;
		const task = new Task(title, description, TaskStatus.IN_PROGRESS, user.id);
		await task.save();
		delete task.user;

		return task;
	}
}
