import { User } from './../auth/user.entity';
import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from 'src/DTO/create-task.DTO';
import { GetTasksFiltersDto } from 'src/DTO/get-task-filter.dto';

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
		const task = new Task();
		task.title = title;
		task.user = user;
		task.description = description;
		task.status = TaskStatus.IN_PROGRESS;
		await task.save();
		delete task.user;

		return task;
	}
}
